import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

function generateQRId(): string {
  // Generar un UUID v4 único para el QR
  const uuid = crypto.randomUUID();
  return uuid;
}

export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { name, email, clerkId } = await request.json();

  if (!name || !email || !clerkId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const qrId = generateQRId();

    const response = await sql`
      INSERT INTO users (name, email, clerk_id, qr_id) 
      VALUES (${name}, ${email}, ${clerkId}, ${qrId})
      RETURNING id, name, email, clerk_id, qr_id, created_at
    `;

    return new Response(
      JSON.stringify({
        success: true,
        user: response[0],
        debug: {
          generatedQrId: qrId,
          insertedQrId: response[0]?.qr_id,
          qrIdMatches: qrId === response[0]?.qr_id,
        },
      }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in user creation:", {
      error: err,
      code: err.code,
      message: err.message,
      detail: err.detail,
      constraint: err.constraint,
    });

    if (err.code === "23505") {
      return Response.json(
        {
          error: "User already exists",
          details: "Email or Clerk ID already registered",
        },
        { status: 409 }
      );
    }

    // Verificar si es un error de columna inexistente
    if (err.code === "42703") {
      return Response.json(
        {
          error: "Database schema error",
          details: "Column 'qr_id' does not exist in users table",
          suggestion: "Run the database migration to add qr_id column",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        error: "Database error",
        details: err.message,
        code: err.code,
        debug: {
          errorType: typeof err,
          errorKeys: Object.keys(err),
        },
      },
      { status: 500 }
    );
  }
}

// GET - Obtener usuario por clerk_id,  email, o qr_id
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const clerkId = url.searchParams.get("clerkId");
  const email = url.searchParams.get("email");
  const qr_id = url.searchParams.get("qr_id");

  if (!clerkId && !email && !qr_id) {
    return Response.json(
      { error: "Missing clerkId, email o qr_id parameter" },
      { status: 400 }
    );
  }

  try {
    let user;

    if (clerkId) {
      user = await sql`
        SELECT id, name, email, clerk_id, qr_id, created_at 
        FROM users 
        WHERE clerk_id = ${clerkId}
      `;
    } else if (qr_id) {
      user = await sql`
        SELECT id, name, email, clerk_id, qr_id, created_at 
        FROM users 
        WHERE qr_id = ${qr_id}
      `;
    } else {
      user = await sql`
        SELECT id, name, email, clerk_id, qr_id, created_at 
        FROM users 
        WHERE email = ${email}
      `;
    }

    if (user.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: user[0],
    });
  } catch (err: any) {
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar QR ID de usuario existente
export async function PUT(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { clerkId, regenerateQR } = await request.json();

  if (!clerkId) {
    return Response.json({ error: "Missing clerkId" }, { status: 400 });
  }

  try {
    // Verificar que el usuario existe
    const existingUser = await sql`
      SELECT id, qr_id FROM users WHERE clerk_id = ${clerkId}
    `;

    if (existingUser.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let updatedUser;

    if (regenerateQR || !existingUser[0].qr_id) {
      const newQrId = generateQRId();

      updatedUser = await sql`
        UPDATE users 
        SET qr_id = ${newQrId}
        WHERE clerk_id = ${clerkId}
        RETURNING id, name, email, clerk_id, qr_id, created_at
      `;
    } else {
      updatedUser = existingUser;
    }

    return Response.json({
      success: true,
      user: updatedUser[0],
    });
  } catch (err: any) {
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
