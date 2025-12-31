import express from "express";
import {
  createTransaction,
  deleteTransactionsByUserId,
  getTransactionsByUserId,
  getTransactionSummary,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);

router.delete("/:userId", deleteTransactionsByUserId);

router.get("/summary/:userId", getTransactionSummary);

export default router;
