import { neon } from "@neondatabase/serverless";

/**
 * GET /api/consumption
 * Obtiene datos de consumo e impacto ambiental del usuario
 *
 * Query params:
 * - user_id: ID del usuario (obligatorio)
 * - months: Número de meses a obtener (opcional, default: 6)
 */
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  const months = parseInt(url.searchParams.get("months") || "6");

  if (!user_id) {
    return Response.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    // Obtener historial de consumo
    const consumptionHistory = await sql`
      SELECT 
        service_type,
        month,
        year,
        amount,
        consumption_value,
        vs_previous_month
      FROM consumption_history
      WHERE user_id = ${user_id}
      ORDER BY year DESC, month DESC
      LIMIT ${months * 3}
    `;

    // Obtener puntaje verde del usuario
    const greenScore = await sql`
      SELECT 
        total_points,
        level,
        trees_planted,
        co2_saved,
        water_saved,
        updated_at
      FROM user_green_score
      WHERE user_id = ${user_id}
    `;

    // Obtener logros recientes
    const recentAchievements = await sql`
      SELECT 
        uga.id,
        uga.points_earned,
        uga.earned_at,
        ga.name,
        ga.description,
        ga.icon,
        ga.category
      FROM user_green_achievements uga
      JOIN green_actions ga ON uga.action_id = ga.id
      WHERE uga.user_id = ${user_id}
      ORDER BY uga.earned_at DESC
      LIMIT 10
    `;

    // Calcular estadísticas de consumo
    const stats = {
      total_consumption: consumptionHistory.reduce(
        (sum: number, item: any) => sum + parseFloat(item.amount),
        0
      ),
      avg_monthly_consumption:
        consumptionHistory.length > 0
          ? consumptionHistory.reduce(
              (sum: number, item: any) => sum + parseFloat(item.amount),
              0
            ) / Math.min(months, consumptionHistory.length / 3)
          : 0,
    };

    // Organizar datos por servicio
    const byService: any = {};
    consumptionHistory.forEach((item: any) => {
      if (!byService[item.service_type]) {
        byService[item.service_type] = [];
      }
      byService[item.service_type].push({
        month: item.month,
        year: item.year,
        amount: parseFloat(item.amount),
        consumption_value: parseFloat(item.consumption_value),
        vs_previous_month: parseFloat(item.vs_previous_month || 0),
      });
    });

    return Response.json({
      success: true,
      consumption: {
        by_service: byService,
        history: consumptionHistory,
        stats,
      },
      green_score:
        greenScore.length > 0
          ? {
              total_points: greenScore[0].total_points,
              level: greenScore[0].level,
              trees_planted: greenScore[0].trees_planted,
              co2_saved: parseFloat(greenScore[0].co2_saved),
              water_saved: parseFloat(greenScore[0].water_saved),
              updated_at: greenScore[0].updated_at,
            }
          : null,
      achievements: recentAchievements.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        category: a.category,
        points_earned: a.points_earned,
        earned_at: a.earned_at,
      })),
    });
  } catch (err: any) {
    console.error("Error in GET /api/consumption:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/consumption
 * Registra un logro verde para el usuario
 *
 * Body:
 * {
 *   "user_id": 1,
 *   "action_code": "PAY_WATER_EARLY",
 *   "related_payment_id": 123
 * }
 */
export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const body = await request.json();
  const { user_id, action_code, related_payment_id } = body;

  if (!user_id || !action_code) {
    return Response.json(
      { error: "user_id and action_code are required" },
      { status: 400 }
    );
  }

  try {
    // Obtener la acción verde
    const action = await sql`
      SELECT id, name, points, icon, description
      FROM green_actions
      WHERE action_code = ${action_code} AND is_active = TRUE
    `;

    if (action.length === 0) {
      return Response.json(
        { error: "Green action not found" },
        { status: 404 }
      );
    }

    const actionData = action[0];

    // Verificar si el usuario ya tiene un green_score
    let userScore = await sql`
      SELECT id, total_points, level
      FROM user_green_score
      WHERE user_id = ${user_id}
    `;

    if (userScore.length === 0) {
      // Crear green_score para el usuario
      userScore = await sql`
        INSERT INTO user_green_score (user_id, total_points, level)
        VALUES (${user_id}, 0, 'Bronce')
        RETURNING id, total_points, level
      `;
    }

    // Registrar el logro
    await sql`
      INSERT INTO user_green_achievements 
        (user_id, action_id, points_earned, related_payment_id)
      VALUES 
        (${user_id}, ${actionData.id}, ${actionData.points}, ${
      related_payment_id || null
    })
    `;

    // Actualizar puntaje total
    const newTotalPoints =
      parseInt(userScore[0].total_points) + parseInt(actionData.points);

    // Calcular nuevo nivel basado en puntos
    let newLevel = "Bronce";
    if (newTotalPoints >= 1000) newLevel = "Platino";
    else if (newTotalPoints >= 500) newLevel = "Oro";
    else if (newTotalPoints >= 200) newLevel = "Plata";

    // Calcular impacto ambiental (aproximado)
    const treesPlanted = Math.floor(newTotalPoints / 100);
    const co2Saved = (newTotalPoints * 0.5).toFixed(2); // 0.5 kg CO2 por punto
    const waterSaved = (newTotalPoints * 2.0).toFixed(2); // 2 litros por punto

    const updatedScore = await sql`
      UPDATE user_green_score
      SET 
        total_points = ${newTotalPoints},
        level = ${newLevel},
        trees_planted = ${treesPlanted},
        co2_saved = ${co2Saved},
        water_saved = ${waterSaved},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user_id}
      RETURNING *
    `;

    return Response.json(
      {
        success: true,
        message: `¡Ganaste ${actionData.points} puntos verdes!`,
        achievement: {
          name: actionData.name,
          description: actionData.description,
          icon: actionData.icon,
          points: actionData.points,
        },
        green_score: {
          total_points: updatedScore[0].total_points,
          level: updatedScore[0].level,
          level_up: updatedScore[0].level !== userScore[0].level,
          trees_planted: updatedScore[0].trees_planted,
          co2_saved: parseFloat(updatedScore[0].co2_saved),
          water_saved: parseFloat(updatedScore[0].water_saved),
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/consumption:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
