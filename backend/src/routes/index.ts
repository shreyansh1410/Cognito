import express from "express";
import userRouter from "./user";
import contentRouter from "./content";
//content router

const router = express.Router();
// Define user-related routes

router.get("/", (req, res) => {
  res.json({ msg: "Hello World" });
});

router.use("/user", userRouter);

module.exports = router;
