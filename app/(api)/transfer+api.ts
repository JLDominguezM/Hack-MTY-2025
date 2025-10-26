import { neon } from "@neondatabase/serverless";

// POST - Transfer money between users
export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { fromUserId, toUserId, amount } = await request.json();

  if (!fromUserId || !toUserId || !amount || amount <= 0) {
    return Response.json(
      {
        error: "Missing required fields: fromUserId, toUserId, amount",
      },
      { status: 400 }
    );
  }

  try {
    // Start a transaction-like process

    // 1. Get sender's current balance
    const senderQuery = await sql`
      SELECT balance 
      FROM account_balances 
      WHERE user_id = ${fromUserId}
    `;

    if (senderQuery.length === 0) {
      return Response.json(
        {
          error: "Sender not found",
        },
        { status: 404 }
      );
    }

    const senderBalance = parseFloat(senderQuery[0].balance);

    // 2. Check if sender has enough balance
    if (senderBalance < amount) {
      return Response.json(
        {
          error: "Insufficient balance",
          currentBalance: senderBalance,
          requiredAmount: amount,
        },
        { status: 400 }
      );
    }

    // 3. Get receiver's current balance
    const receiverQuery = await sql`
      SELECT balance 
      FROM account_balances 
      WHERE user_id = ${toUserId}
    `;

    if (receiverQuery.length === 0) {
      return Response.json(
        {
          error: "Receiver not found",
        },
        { status: 404 }
      );
    }

    const receiverBalance = parseFloat(receiverQuery[0].balance);

    // 4. Update sender's balance (subtract)
    const newSenderBalance = senderBalance - amount;
    await sql`
      UPDATE account_balances 
      SET balance = ${newSenderBalance}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${fromUserId}
    `;

    // 5. Update receiver's balance (add)
    const newReceiverBalance = receiverBalance + amount;
    await sql`
      UPDATE account_balances 
      SET balance = ${newReceiverBalance}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${toUserId}
    `;

    // 6. Return success response
    return Response.json(
      {
        success: true,
        transfer: {
          fromUserId,
          toUserId,
          amount,
          senderNewBalance: newSenderBalance,
          receiverNewBalance: newReceiverBalance,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in transfer:", {
      error: err,
      code: err.code,
      message: err.message,
      detail: err.detail,
    });

    return Response.json(
      {
        error: "Database error during transfer",
        details: err.message,
        code: err.code,
      },
      { status: 500 }
    );
  }
}
