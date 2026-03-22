import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "portfolio_db",
});

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      stack TEXT NOT NULL,
      demo_link TEXT,
      github_link TEXT
    );
  `);

  const { rows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM projects;"
  );

  if (Number(rows[0].count) === 0) {
    await pool.query(
      `INSERT INTO projects (title, description, stack, demo_link, github_link)
       VALUES
       (
         'SaaS de Gestao de Clientes',
         'Plataforma com cadastro de clientes, funil de vendas e automacao de follow-up por WhatsApp.',
         'React, TypeScript, Node.js, PostgreSQL',
         'https://demo-seu-saas.vercel.app',
         'https://github.com/seuusuario/saas-clientes'
       ),
       (
         'E-commerce de Moda',
         'Loja virtual com carrinho, checkout e painel administrativo para estoque e pedidos.',
         'React, TypeScript, Express, PostgreSQL',
         'https://demo-loja-moda.vercel.app',
         'https://github.com/seuusuario/ecommerce-moda'
       ),
       (
         'Dashboard Financeiro',
         'Dashboard com indicadores de receita, despesas e previsao de caixa em tempo real.',
         'React, TypeScript, Charts, PostgreSQL',
         'https://demo-finance.vercel.app',
         'https://github.com/seuusuario/dashboard-finance'
       ),
       (
         'Sistema de Agendamento',
         'Agenda online com confirmacao automatica e painel para profissionais e clientes.',
         'React, Node.js, PostgreSQL',
         'https://demo-agenda.vercel.app',
         'https://github.com/seuusuario/sistema-agendamento'
       );`
    );
  }
}
