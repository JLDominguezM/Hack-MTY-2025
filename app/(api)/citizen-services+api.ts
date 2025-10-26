import { neon } from "@neondatabase/serverless";

/**
 * GET /api/citizen-services
 * Obtiene los servicios ciudadanos
 *
 * Query params:
 * - user_id: ID del usuario (obligatorio para ver servicios vinculados)
 * - category: Filtrar por categoría (opcional): 'predial', 'multas', 'impuestos', 'verificacion'
 * - status: Filtrar por estado (opcional): 'pending', 'paid', 'overdue'
 * - available: Si es true, obtiene servicios disponibles (catálogo general)
 */
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");
  const category = url.searchParams.get("category");
  const status = url.searchParams.get("status");
  const available = url.searchParams.get("available");

  try {
    // Si se solicita el catálogo de servicios disponibles
    if (available === "true") {
      const conditions = [];
      const params: any[] = [];

      conditions.push("is_active = true");

      if (category) {
        params.push(category);
        conditions.push(`category = $${params.length}`);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const services = await sql`
        SELECT 
          id,
          service_code,
          name,
          description,
          category,
          base_amount,
          currency
        FROM citizen_services
        ${sql.unsafe(whereClause)}
        ORDER BY category, name
      `;

      return Response.json({
        success: true,
        services,
        count: services.length,
      });
    }

    // Obtener servicios vinculados al usuario
    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    let query = `
      SELECT 
        us.id,
        us.reference_number,
        us.amount,
        us.status,
        us.due_date,
        us.description as user_description,
        us.created_at,
        cs.id as service_id,
        cs.service_code,
        cs.name as service_name,
        cs.category,
        cs.currency,
        cs.description as service_description
      FROM user_services us
      JOIN citizen_services cs ON us.service_id = cs.id
      WHERE us.user_id = $1
    `;

    const params: any[] = [user_id];
    let paramCount = 1;

    if (category) {
      paramCount++;
      params.push(category);
      query += ` AND cs.category = $${paramCount}`;
    }

    if (status) {
      paramCount++;
      params.push(status);
      query += ` AND us.status = $${paramCount}`;
    }

    query += ` ORDER BY us.due_date ASC, us.created_at DESC`;

    // Ejecutar query con parámetros interpolados
    const result =
      category && status
        ? await sql`
          SELECT 
            us.id,
            us.reference_number,
            us.amount,
            us.status,
            us.due_date,
            us.description as user_description,
            us.created_at,
            cs.id as service_id,
            cs.service_code,
            cs.name as service_name,
            cs.category,
            cs.currency,
            cs.description as service_description
          FROM user_services us
          JOIN citizen_services cs ON us.service_id = cs.id
          WHERE us.user_id = ${user_id}
            AND cs.category = ${category}
            AND us.status = ${status}
          ORDER BY us.due_date ASC, us.created_at DESC
        `
        : category
        ? await sql`
          SELECT 
            us.id,
            us.reference_number,
            us.amount,
            us.status,
            us.due_date,
            us.description as user_description,
            us.created_at,
            cs.id as service_id,
            cs.service_code,
            cs.name as service_name,
            cs.category,
            cs.currency,
            cs.description as service_description
          FROM user_services us
          JOIN citizen_services cs ON us.service_id = cs.id
          WHERE us.user_id = ${user_id}
            AND cs.category = ${category}
          ORDER BY us.due_date ASC, us.created_at DESC
        `
        : status
        ? await sql`
          SELECT 
            us.id,
            us.reference_number,
            us.amount,
            us.status,
            us.due_date,
            us.description as user_description,
            us.created_at,
            cs.id as service_id,
            cs.service_code,
            cs.name as service_name,
            cs.category,
            cs.currency,
            cs.description as service_description
          FROM user_services us
          JOIN citizen_services cs ON us.service_id = cs.id
          WHERE us.user_id = ${user_id}
            AND us.status = ${status}
          ORDER BY us.due_date ASC, us.created_at DESC
        `
        : await sql`
          SELECT 
            us.id,
            us.reference_number,
            us.amount,
            us.status,
            us.due_date,
            us.description as user_description,
            us.created_at,
            cs.id as service_id,
            cs.service_code,
            cs.name as service_name,
            cs.category,
            cs.currency,
            cs.description as service_description
          FROM user_services us
          JOIN citizen_services cs ON us.service_id = cs.id
          WHERE us.user_id = ${user_id}
          ORDER BY us.due_date ASC, us.created_at DESC
        `;

    // Calcular estadísticas
    const stats = {
      total: result.length,
      total_amount: result.reduce(
        (sum: number, service: any) =>
          service.status === "pending" ? sum + parseFloat(service.amount) : sum,
        0
      ),
      by_status: result.reduce((acc: any, service: any) => {
        acc[service.status] = (acc[service.status] || 0) + 1;
        return acc;
      }, {}),
      by_category: result.reduce((acc: any, service: any) => {
        if (service.status === "pending") {
          acc[service.category] = (acc[service.category] || 0) + 1;
        }
        return acc;
      }, {}),
    };

    return Response.json({
      success: true,
      services: result,
      stats,
    });
  } catch (err: any) {
    console.error("Error in GET /api/citizen-services:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/citizen-services
 * Vincula un servicio ciudadano a un usuario o crea un nuevo servicio
 *
 * Body para vincular servicio a usuario:
 * {
 *   "action": "link",
 *   "user_id": 1,
 *   "service_id": 5,
 *   "amount": 800.00,
 *   "due_date": "2025-12-31",
 *   "description": "Descripción específica"
 * }
 *
 * Body para crear nuevo servicio en catálogo:
 * {
 *   "action": "create_service",
 *   "service_code": "NEW_SERVICE",
 *   "name": "Nuevo Servicio",
 *   "category": "multas",
 *   "base_amount": 500.00
 * }
 */
export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const body = await request.json();
  const { action } = body;

  try {
    // Acción: Vincular servicio a usuario
    if (action === "link") {
      const { user_id, service_id, amount, due_date, description } = body;

      if (!user_id || !service_id || !amount) {
        return Response.json(
          { error: "user_id, service_id, and amount are required" },
          { status: 400 }
        );
      }

      // Verificar que el servicio existe
      const serviceCheck = await sql`
        SELECT id, service_code FROM citizen_services WHERE id = ${service_id}
      `;

      if (serviceCheck.length === 0) {
        return Response.json({ error: "Service not found" }, { status: 404 });
      }

      // Generar número de referencia único
      const reference_number = `${
        serviceCheck[0].service_code
      }-${Date.now()}-${user_id}`;

      const result = await sql`
        INSERT INTO user_services 
          (user_id, service_id, reference_number, amount, status, due_date, description)
        VALUES 
          (${user_id}, ${service_id}, ${reference_number}, ${amount}, 'pending', 
           ${due_date || null}, ${description || null})
        RETURNING *
      `;

      return Response.json(
        {
          success: true,
          message: "Service linked to user successfully",
          user_service: result[0],
        },
        { status: 201 }
      );
    }

    // Acción: Crear nuevo servicio en catálogo
    if (action === "create_service") {
      const {
        service_code,
        name,
        description,
        category,
        base_amount,
        currency,
      } = body;

      if (!service_code || !name || !category || !base_amount) {
        return Response.json(
          {
            error: "service_code, name, category, and base_amount are required",
          },
          { status: 400 }
        );
      }

      const result = await sql`
        INSERT INTO citizen_services 
          (service_code, name, description, category, base_amount, currency)
        VALUES 
          (${service_code}, ${name}, ${description || null}, ${category}, 
           ${base_amount}, ${currency || "MXN"})
        RETURNING *
      `;

      return Response.json(
        {
          success: true,
          message: "Service created successfully",
          service: result[0],
        },
        { status: 201 }
      );
    }

    return Response.json(
      { error: "Invalid action. Use 'link' or 'create_service'" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/citizen-services:", err);

    if (err.code === "23505") {
      return Response.json(
        {
          error: "Duplicate entry",
          details: "Service already exists or reference number duplicated",
        },
        { status: 409 }
      );
    }

    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/citizen-services
 * Actualiza el estado de un servicio ciudadano vinculado a un usuario
 *
 * Body:
 * {
 *   "user_service_id": 1,
 *   "status": "paid" | "cancelled"
 * }
 */
export async function PATCH(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const body = await request.json();
  const { user_service_id, status } = body;

  if (!user_service_id || !status) {
    return Response.json(
      { error: "user_service_id and status are required" },
      { status: 400 }
    );
  }

  const validStatuses = ["pending", "paid", "overdue", "cancelled"];
  if (!validStatuses.includes(status)) {
    return Response.json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      UPDATE user_services
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user_service_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "User service not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Service status updated successfully",
      user_service: result[0],
    });
  } catch (err: any) {
    console.error("Error in PATCH /api/citizen-services:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/citizen-services
 * Elimina un servicio vinculado a un usuario (no el servicio del catálogo)
 *
 * Query params:
 * - user_service_id: ID del servicio vinculado al usuario
 */
export async function DELETE(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_service_id = url.searchParams.get("user_service_id");

  if (!user_service_id) {
    return Response.json(
      { error: "user_service_id is required" },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      DELETE FROM user_services
      WHERE id = ${user_service_id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "User service not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "User service deleted successfully",
    });
  } catch (err: any) {
    console.error("Error in DELETE /api/citizen-services:", err);
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
