import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const generateTransactionId = () => {
  return `TXN-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;
};

/**
 * GET /api/payments
 *
 * Query params:
 * - user_id: ID del usuario para obtener su historial de pagos
 * - transaction_id: ID de transacción específica
 */
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  const transaction_id = url.searchParams.get("transaction_id");

  try {
    // Obtener pago específico por transaction_id
    if (transaction_id) {
      const payment = await sql`
        SELECT 
          sp.id,
          sp.transaction_id,
          sp.amount,
          sp.payment_method,
          sp.status,
          sp.paid_at,
          sp.metadata,
          us.reference_number,
          cs.name as service_name,
          cs.category,
          u.name as user_name,
          u.email as user_email
        FROM service_payments sp
        JOIN user_services us ON sp.user_service_id = us.id
        JOIN citizen_services cs ON us.service_id = cs.id
        JOIN users u ON sp.user_id = u.id
        WHERE sp.transaction_id = ${transaction_id}
      `;

      if (payment.length === 0) {
        return Response.json({ error: "Payment not found" }, { status: 404 });
      }

      return Response.json({
        success: true,
        payment: payment[0],
      });
    }

    // Obtener historial de pagos del usuario
    if (user_id) {
      const payments = await sql`
        SELECT 
          sp.id,
          sp.transaction_id,
          sp.amount,
          sp.payment_method,
          sp.status,
          sp.paid_at,
          us.reference_number,
          cs.name as service_name,
          cs.category
        FROM service_payments sp
        JOIN user_services us ON sp.user_service_id = us.id
        JOIN citizen_services cs ON us.service_id = cs.id
        WHERE sp.user_id = ${user_id}
        ORDER BY sp.paid_at DESC
        LIMIT 50
      `;

      return Response.json({
        success: true,
        payments,
        count: payments.length,
      });
    }

    return Response.json(
      { error: "user_id or transaction_id is required" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Error in GET /api/payments:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments
 * Procesa el pago de un servicio ciudadano
 *
 * Body:
 * {
 *   "user_id": 1,
 *   "user_service_id": 5,
 *   "amount": 800.00,
 *   "payment_method": "balance" // o "card", "transfer"
 * }
 */
export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const body = await request.json();
  const { user_id, user_service_id, amount, payment_method = "balance" } = body;

  if (!user_id || !user_service_id || !amount) {
    return Response.json(
      { error: "user_id, user_service_id, and amount are required" },
      { status: 400 }
    );
  }

  try {
    // Verificar que el servicio existe y está pendiente
    const userService = await sql`
      SELECT 
        us.id,
        us.user_id,
        us.amount,
        us.status,
        cs.name as service_name,
        cs.category
      FROM user_services us
      JOIN citizen_services cs ON us.service_id = cs.id
      WHERE us.id = ${user_service_id} AND us.user_id = ${user_id}
    `;

    if (userService.length === 0) {
      return Response.json(
        { error: "User service not found" },
        { status: 404 }
      );
    }

    if (userService[0].status !== "pending") {
      return Response.json(
        { error: "Service is not pending payment" },
        { status: 400 }
      );
    }

    // Verificar que el monto coincide
    if (parseFloat(userService[0].amount) !== parseFloat(amount)) {
      return Response.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Si el método de pago es balance, verificar que hay fondos suficientes
    if (payment_method === "balance") {
      const balance = await sql`
        SELECT balance 
        FROM account_balances 
        WHERE user_id = ${user_id}
      `;

      if (balance.length === 0) {
        return Response.json(
          { error: "User balance not found" },
          { status: 404 }
        );
      }

      if (parseFloat(balance[0].balance) < parseFloat(amount)) {
        return Response.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }

      // Descontar del balance
      await sql`
        UPDATE account_balances
        SET balance = balance - ${amount}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id}
      `;
    }

    // Generar ID de transacción
    const transaction_id = generateTransactionId();

    // Registrar el pago
    const payment = await sql`
      INSERT INTO service_payments 
        (user_service_id, user_id, amount, payment_method, transaction_id, status, paid_at)
      VALUES 
        (${user_service_id}, ${user_id}, ${amount}, ${payment_method}, ${transaction_id}, 'completed', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    // Actualizar el estado del servicio a 'paid'
    await sql`
      UPDATE user_services
      SET status = 'paid', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user_service_id}
    `;

    return Response.json(
      {
        success: true,
        message: "Payment processed successfully",
        payment: {
          transaction_id: payment[0].transaction_id,
          amount: payment[0].amount,
          service_name: userService[0].service_name,
          paid_at: payment[0].paid_at,
          status: payment[0].status,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/payments:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
