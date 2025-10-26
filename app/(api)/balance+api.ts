import { neon } from "@neondatabase/serverless";

// GET - returns the balance of a certain user
export async function GET(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const url = new URL(request.url);
  const user_id = url.searchParams.get("user_id");

  if (!user_id) {
    return Response.json(
      { error: "Missing clerkId, email o qr_id parameter" },
      { status: 400 }
    );
  }

  try {
    let balance;

    if (user_id) {
      balance = await sql`
        SELECT balance, updated_at
        FROM account_balances ab
        WHERE ab.user_id = ${user_id} 
      `;
    } else {
      balance = await sql`
        SELECT *
        FROM account_balances
      `;
    }

    if (balance.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      balance: balance,
    });
  } catch (err: any) {
    return Response.json(
      { error: "Database error", details: err.message },
      { status: 500 }
    );
  }
}
