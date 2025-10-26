import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const generateTransactionId = () => {
  // Usar timestamp con microsegundos y un random más largo para evitar duplicados
  const timestamp = Date.now();
  const randomPart = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `TXN-${timestamp}-${randomPart}`;
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

    // Registrar transacciones y actualizar consumo
    const batch_id = generateTransactionId(); // ID del lote de transacciones
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    let greenPointsEarned = 0;
    const earlyPayments: string[] = [];

    for (const service of services) {
      // Generar un transaction_id único para cada servicio
      const transaction_id = generateTransactionId();

      // Registrar transacción
      await sql`
        INSERT INTO payment_service_transactions 
          (user_payment_service_id, user_id, amount, transaction_id, status, paid_at)
        VALUES 
          (${service.id}, ${user_id}, ${service.amount}, ${transaction_id}, 'completed', CURRENT_TIMESTAMP)
      `;

      // Obtener información del servicio
      const serviceInfo = await sql`
        SELECT ps.name, ps.provider, ups.due_date
        FROM user_payment_services ups
        JOIN payment_services ps ON ups.service_id = ps.id
        WHERE ups.id = ${service.id}
      `;

      if (serviceInfo.length > 0) {
        const serviceName = serviceInfo[0].name.toLowerCase();
        const dueDate = new Date(serviceInfo[0].due_date);
        const paymentDate = new Date();

        // Verificar si ya existe un registro de consumo para este mes
        const existingConsumption = await sql`
          SELECT id, amount
          FROM consumption_history
          WHERE user_id = ${user_id} 
            AND service_type = ${serviceName}
            AND month = ${currentMonth}
            AND year = ${currentYear}
        `;

        if (existingConsumption.length > 0) {
          // Obtener consumo del mes anterior para recalcular tendencia
          const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const previousYear =
            currentMonth === 1 ? currentYear - 1 : currentYear;

          const previousConsumption = await sql`
            SELECT amount
            FROM consumption_history
            WHERE user_id = ${user_id}
              AND service_type = ${serviceName}
              AND month = ${previousMonth}
              AND year = ${previousYear}
          `;

          let vsPreviousMonth = null;
          if (previousConsumption.length > 0) {
            const prevAmount = parseFloat(previousConsumption[0].amount);
            const currentAmount = parseFloat(service.amount);
            vsPreviousMonth = ((currentAmount - prevAmount) / prevAmount) * 100;
          }

          // Actualizar el registro existente con el nuevo monto y tendencia
          await sql`
            UPDATE consumption_history
            SET amount = ${service.amount},
                vs_previous_month = ${vsPreviousMonth}
            WHERE id = ${existingConsumption[0].id}
          `;
        } else {
          // Obtener consumo del mes anterior para calcular tendencia
          const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const previousYear =
            currentMonth === 1 ? currentYear - 1 : currentYear;

          const previousConsumption = await sql`
            SELECT amount
            FROM consumption_history
            WHERE user_id = ${user_id}
              AND service_type = ${serviceName}
              AND month = ${previousMonth}
              AND year = ${previousYear}
          `;

          let vsPreviousMonth = null;
          if (previousConsumption.length > 0) {
            const prevAmount = parseFloat(previousConsumption[0].amount);
            const currentAmount = parseFloat(service.amount);
            vsPreviousMonth = ((currentAmount - prevAmount) / prevAmount) * 100;
          }

          // Crear nuevo registro de consumo
          await sql`
            INSERT INTO consumption_history
              (user_id, service_type, month, year, amount, consumption_value, vs_previous_month)
            VALUES
              (${user_id}, ${serviceName}, ${currentMonth}, ${currentYear}, ${service.amount}, 0, ${vsPreviousMonth})
          `;
        }

        // Verificar si el pago fue anticipado (antes de la fecha de vencimiento)
        if (paymentDate < dueDate) {
          earlyPayments.push(serviceName);

          const actionMapping: any = {
            agua: "PAY_WATER_EARLY",
            luz: "PAY_LIGHT_EARLY",
            gas: "PAY_GAS_EARLY",
          };

          const actionType = actionMapping[serviceName];

          if (actionType) {
            // Verificar si ya ganó este logro este mes
            const existingAchievement = await sql`
              SELECT uga.id 
              FROM user_green_achievements uga
              JOIN green_actions ga ON uga.action_id = ga.id
              WHERE uga.user_id = ${user_id}
                AND ga.action_code = ${actionType}
                AND EXTRACT(MONTH FROM uga.earned_at) = ${currentMonth}
                AND EXTRACT(YEAR FROM uga.earned_at) = ${currentYear}
            `;

            if (existingAchievement.length === 0) {
              // Obtener información del logro
              const greenAction = await sql`
                SELECT id, points 
                FROM green_actions 
                WHERE action_code = ${actionType}
              `;

              if (greenAction.length > 0) {
                const actionId = greenAction[0].id;
                const points = greenAction[0].points;
                greenPointsEarned += points;

                // Registrar logro
                await sql`
                  INSERT INTO user_green_achievements
                    (user_id, action_id, points_earned)
                  VALUES
                    (${user_id}, ${actionId}, ${points})
                `;

                // Actualizar puntaje verde del usuario
                const userScore = await sql`
                  SELECT total_points FROM user_green_score WHERE user_id = ${user_id}
                `;

                if (userScore.length > 0) {
                  const newTotalPoints = userScore[0].total_points + points;
                  const treesPlanted = Math.floor(newTotalPoints / 100);
                  const co2Saved = newTotalPoints * 0.5;
                  const waterSaved = newTotalPoints * 2;

                  let level = "Bronce";
                  if (newTotalPoints >= 1000) level = "Platino";
                  else if (newTotalPoints >= 500) level = "Oro";
                  else if (newTotalPoints >= 200) level = "Plata";

                  await sql`
                    UPDATE user_green_score
                    SET total_points = ${newTotalPoints},
                        level = ${level},
                        trees_planted = ${treesPlanted},
                        co2_saved = ${co2Saved},
                        water_saved = ${waterSaved},
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = ${user_id}
                  `;
                } else {
                  // Crear registro inicial si no existe
                  const treesPlanted = Math.floor(points / 100);
                  const co2Saved = points * 0.5;
                  const waterSaved = points * 2;

                  await sql`
                    INSERT INTO user_green_score
                      (user_id, total_points, level, trees_planted, co2_saved, water_saved)
                    VALUES
                      (${user_id}, ${points}, 'Bronce', ${treesPlanted}, ${co2Saved}, ${waterSaved})
                  `;
                }
              }
            }
          }
        }
      }
    }

    // Obtener nuevo balance
    const newBalance = await sql`
      SELECT balance FROM account_balances WHERE user_id = ${user_id}
    `;

    return Response.json(
      {
        success: true,
        message: `${services.length} service(s) paid successfully`,
        batch_id, // ID del lote de pago
        amount_paid: calculatedTotal,
        new_balance: parseFloat(newBalance[0].balance),
        services_paid: services.length,
        green_points_earned: greenPointsEarned,
        early_payments: earlyPayments,
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
