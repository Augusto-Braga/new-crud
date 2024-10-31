import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
