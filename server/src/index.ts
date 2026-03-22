import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initializeDatabase, pool } from "./db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/profile", async (_req, res) => {
  try {
    const [projectsResult] = await Promise.all([
      pool.query(
        "SELECT id, title, description, stack, demo_link, github_link FROM projects ORDER BY id ASC"
      ),
    ]);

    res.json({
      name: "Seu Nome",
      role: "Desenvolvedor Full Stack",
      bio: "Construo interfaces modernas e APIs robustas para negocios digitais.",
      instagram: "https://instagram.com/seuusuario",
      whatsapp: "https://wa.me/5500000000000",
      projects: projectsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar dados do portfolio." });
  }
});

async function start(): Promise<void> {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
