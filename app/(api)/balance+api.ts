import { neon } from "@neondatabase/serverless";

// GET - returns the balance of a certain user
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");

  if (!user_id) {
    return Response.json(
      { error: "Missing user_id parameter" },
      { status: 400 }
    );
  }

  try {
    const user = await sql`
      SELECT balance, updated_at
      FROM account_balances ab
      WHERE ab.user_id = ${user_id} 
    `;

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

/**
 * PATCH - Update user balance
 * Body:
 * {
 *   "user_id": 1,
 *   "amount": 100.00,
 *   "operation": "add" | "subtract" | "set"
 * }
 */
export async function PATCH(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const body = await request.json();
  const { user_id, amount, operation = "set" } = body;

  if (!user_id || amount === undefined) {
    return Response.json(
      { error: "user_id and amount are required" },
      { status: 400 }
    );
  }

  if (!["add", "subtract", "set"].includes(operation)) {
    return Response.json(
      { error: "operation must be 'add', 'subtract', or 'set'" },
      { status: 400 }
    );
  }

  try {
    let result;

    if (operation === "add") {
      result = await sql`
        UPDATE account_balances
        SET balance = balance + ${amount}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id}
        RETURNING balance, updated_at
      `;
    } else if (operation === "subtract") {
      // Check if user has sufficient balance
      const currentBalance = await sql`
        SELECT balance FROM account_balances WHERE user_id = ${user_id}
      `;

      if (currentBalance.length === 0) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      if (parseFloat(currentBalance[0].balance) < parseFloat(amount)) {
        return Response.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }

      result = await sql`
        UPDATE account_balances
        SET balance = balance - ${amount}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id}
        RETURNING balance, updated_at
      `;
    } else {
      // operation === "set"
      result = await sql`
        UPDATE account_balances
        SET balance = ${amount}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user_id}
        RETURNING balance, updated_at
      `;
    }

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Balance updated successfully",
      balance: result[0],
    });
  } catch (err: any) {
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}

//POST - Set a certain user balance
export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { user_id, newBalance } = await request.json();

  if (!newBalance) {
    return Response.json(
      { error: "Missing required balance" },
      { status: 400 }
    );
  }

  try {
    const response = await sql`
      UPDATE account_balances 
      SET balance = ${newBalance}
      WHERE user_id = ${user_id};
    `;

    return new Response(
      JSON.stringify({
        success: true,
        user: response[0],
        debug: {
          newBalance: newBalance,
        },
      }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in balance ser:", {
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
          details: "Check for actual balance",
        },
        { status: 409 }
      );
    }

    return Response.json({ new_balance: newBalance });
  }
}
