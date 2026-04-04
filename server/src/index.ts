import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initializeDatabase, pool } from "./db";
import { addMemoryProject, getMemoryProjects } from "./memoryStore";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

/** true = PostgreSQL; false = memória (dados em memória somem ao reiniciar) */
let usePostgres = false;

app.use(cors());
app.use(express.json());

app.get("/api/profile", async (_req, res) => {
  try {
    const projects = usePostgres
      ? (
          await pool.query(
            "SELECT id, title, description, stack, demo_link, github_link FROM projects ORDER BY id ASC"
          )
        ).rows
      : getMemoryProjects();

    res.json({
      name: "Flávio Henrique",
      role: "Desenvolvedor full stack, com foco em backend",
      bio: "Construo interfaces modernas e APIs robustas para negócios digitais.",
      instagram: "https://instagram.com/fra.vios",
      whatsapp: "https://wa.me/5535997810561",
      email: "contato@exemplo.com",
      phone: "(35) 99781-0561",
      location: "Minas Gerais, Brasil",
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar dados do portfolio." });
  }
});

app.post("/api/projects", async (req, res) => {
  const { title, description, stack, demo_link, github_link } = req.body as {
    title?: string;
    description?: string;
    stack?: string;
    demo_link?: string;
    github_link?: string;
  };

  if (!title || !description || !stack) {
    return res.status(400).json({
      message:
        "É obrigatório informar os campos title, description e stack no corpo da requisição.",
    });
  }

  try {
    if (usePostgres) {
      const result = await pool.query(
        `INSERT INTO projects (title, description, stack, demo_link, github_link)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, title, description, stack, demo_link, github_link`,
        [title, description, stack, demo_link ?? null, github_link ?? null]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const row = addMemoryProject({
        title,
        description,
        stack,
        demo_link: demo_link?.trim() ? demo_link : null,
        github_link: github_link?.trim() ? github_link : null,
      });
      res.status(201).json(row);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar projeto." });
  }
});

async function start(): Promise<void> {
  try {
    await initializeDatabase();
    usePostgres = true;
    console.log("PostgreSQL conectado.");
  } catch (error) {
    usePostgres = false;
    console.warn(
      "PostgreSQL indisponível — a API está em modo memória (novos projetos somem ao reiniciar o servidor)."
    );
    console.warn(error);
  }

  app.listen(PORT, () => {
    console.log(`Servidor em execução em http://localhost:${PORT}`);
  });
}

start();
