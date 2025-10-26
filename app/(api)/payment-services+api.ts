import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const generateTransactionId = () => {
  return `TXN-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
};

/**
 * GET /api/payment-services
 * Obtiene los servicios de pago vinculados al usuario
 *
 * Query params:
 * - user_id: ID del usuario (obligatorio)
 * - status: Filtrar por estado (opcional): 'pending', 'paid', 'overdue'
 */
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  const status = url.searchParams.get("status");

  if (!user_id) {
    return Response.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    let services;

    if (status) {
      services = await sql`
        SELECT 
          ups.id,
          ups.account_number,
          ups.amount,
          ups.status,
          ups.due_date,
          ps.name,
          ps.provider,
          ps.icon
        FROM user_payment_services ups
        JOIN payment_services ps ON ups.service_id = ps.id
        WHERE ups.user_id = ${user_id} AND ups.status = ${status}
        ORDER BY ups.due_date ASC
      `;
    } else {
      services = await sql`
        SELECT 
          ups.id,
          ups.account_number,
          ups.amount,
          ups.status,
          ups.due_date,
          ps.name,
          ps.provider,
          ps.icon
        FROM user_payment_services ups
        JOIN payment_services ps ON ups.service_id = ps.id
        WHERE ups.user_id = ${user_id}
        ORDER BY ups.due_date ASC
      `;
    }

    // Calcular estadísticas
    const totalPending = services
      .filter((s: any) => s.status === "pending" || s.status === "overdue")
      .reduce((sum: number, s: any) => sum + parseFloat(s.amount), 0);

    return Response.json({
      success: true,
      services,
      stats: {
        total: services.length,
        total_pending: totalPending,
        count_pending: services.filter((s: any) => s.status === "pending")
          .length,
        count_overdue: services.filter((s: any) => s.status === "overdue")
          .length,
      },
    });
  } catch (err: any) {
    console.error("Error in GET /api/payment-services:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payment-services
 * Procesa el pago de uno o múltiples servicios
 *
 * Body:
 * {
 *   "user_id": 1,
 *   "service_ids": [1, 2, 3], // IDs de user_payment_services
 *   "total_amount": 2500.00
 * }
 */
export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const body = await request.json();
  const { user_id, service_ids, total_amount } = body;

  if (
    !user_id ||
    !service_ids ||
    !Array.isArray(service_ids) ||
    service_ids.length === 0
  ) {
    return Response.json(
      { error: "user_id and service_ids array are required" },
      { status: 400 }
    );
  }

  try {
    // Verificar que los servicios existen y obtener el monto total
    const services = await sql`
      SELECT id, amount, status
      FROM user_payment_services
      WHERE id = ANY(${service_ids}) AND user_id = ${user_id}
    `;

    if (services.length === 0) {
      return Response.json({ error: "No services found" }, { status: 404 });
    }

    if (services.length !== service_ids.length) {
      return Response.json(
        { error: "Some services not found or don't belong to user" },
        { status: 400 }
      );
    }

    // Verificar que todos los servicios están pendientes
    const nonPendingServices = services.filter(
      (s: any) => s.status !== "pending" && s.status !== "overdue"
    );
    if (nonPendingServices.length > 0) {
      return Response.json(
        { error: "Some services are not pending payment" },
        { status: 400 }
      );
    }

    // Calcular total real
    const calculatedTotal = services.reduce(
      (sum: number, s: any) => sum + parseFloat(s.amount),
      0
    );

    if (Math.abs(calculatedTotal - parseFloat(total_amount)) > 0.01) {
      return Response.json({ error: "Total amount mismatch" }, { status: 400 });
    }

    // Verificar balance del usuario
    const balance = await sql`
      SELECT balance FROM account_balances WHERE user_id = ${user_id}
    `;

    if (balance.length === 0) {
      return Response.json(
        { error: "User balance not found" },
        { status: 404 }
      );
    }

    if (parseFloat(balance[0].balance) < calculatedTotal) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Descontar del balance
    await sql`
      UPDATE account_balances
      SET balance = balance - ${calculatedTotal}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user_id}
    `;

    // Marcar servicios como pagados
    await sql`
      UPDATE user_payment_services
      SET status = 'paid', updated_at = CURRENT_TIMESTAMP
      WHERE id = ANY(${service_ids})
    `;

    // Registrar transacciones
    const transaction_id = generateTransactionId();

    for (const service of services) {
      await sql`
        INSERT INTO payment_service_transactions 
          (user_payment_service_id, user_id, amount, transaction_id, status, paid_at)
        VALUES 
          (${service.id}, ${user_id}, ${service.amount}, ${transaction_id}, 'completed', CURRENT_TIMESTAMP)
      `;
    }

    // Obtener nuevo balance
    const newBalance = await sql`
      SELECT balance FROM account_balances WHERE user_id = ${user_id}
    `;

    return Response.json(
      {
        success: true,
        message: `${services.length} service(s) paid successfully`,
        transaction_id,
        amount_paid: calculatedTotal,
        new_balance: parseFloat(newBalance[0].balance),
        services_paid: services.length,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/payment-services:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/payment-services
 * Elimina un servicio de pago vinculado al usuario
 *
 * Query params:
 * - service_id: ID del servicio (user_payment_services)
 */
export async function DELETE(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const service_id = url.searchParams.get("service_id");

  if (!service_id) {
    return Response.json({ error: "service_id is required" }, { status: 400 });
  }

  try {
    const result = await sql`
      DELETE FROM user_payment_services
      WHERE id = ${service_id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err: any) {
    console.error("Error in DELETE /api/payment-services:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
