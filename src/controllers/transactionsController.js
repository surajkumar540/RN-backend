import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    console.log("User ID:", userId);
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Insert transaction into the database
    const trasactions = await sql`
    INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category})  RETURNING *
    `;

    res
      .status(201)
      .json({ message: "Transaction created successfully", trasactions });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    // string check
    if (!isNaN(parseInt(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedTransactions = await sql`
          DELETE FROM transactions 
          WHERE user_id = ${userId}
          RETURNING *
        `;

    if (deletedTransactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found for this user",
      });
    }

    res.status(200).json({
      message: "Transaction(s) deleted successfully",
      deletedCount: deletedTransactions.length,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTransactionSummary(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT 
       COALESCE(SUM(amount), 0) AS balance 
      FROM transactions
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT 
       COALESCE(SUM(amount), 0) AS income 
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expenseResult = await sql`
      SELECT 
       COALESCE(SUM(amount), 0) AS expense 
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });

    //  console balalance
    console.log("Balance:", balanceResult[0].balance);
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
