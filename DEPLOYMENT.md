# 🚀 Guia de Deploy

## Opção 1: Vercel + Render (Recomendado)

### 1. Push para GitHub
```bash
git push origin main
```

### 2. Deploy Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório GitHub
4. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em "Deploy"

**URL Frontend**: `https://seu-projeto.vercel.app`

### 3. Deploy Backend (Render)

1. Acesse [render.com](https://render.com)
2. Clique em "New+" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `portfolio-api`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
5. Configure variáveis de ambiente:
   - `PORT`: `4000`
   - `DB_HOST`: `localhost` (ou seu host PostgreSQL)
   - `DB_PORT`: `5432`
   - `DB_USER`: `postgres`
   - `DB_PASSWORD`: `sua-senha`
   - `DB_NAME`: `portfolio_db`
6. Clique em "Create Web Service"

**URL Backend**: `https://seu-projeto-api.onrender.com`

### 4. Atualizar URL da API no Frontend

Edite `client/src/App.tsx` e troque:
```typescript
// De:
const response = await fetch("http://localhost:4000/api/profile");

// Para:
const response = await fetch("https://seu-projeto-api.onrender.com/api/profile");
```

## Opção 2: Netlify + Heroku

### Frontend (Netlify)
```bash
npm install -g netlify-cli
netlify deploy --dir=client/dist
```

### Backend (Heroku)
```bash
heroku create seu-projeto-api
git push heroku main
```

## Variáveis de Ambiente

Certifique-se de configurar no painel de deploy:
- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Testando o Deploy

1. Acesse a URL do frontend
2. Verifique se consegue abrir a seção de projetos
3. Tente criar um novo projeto se PostgreSQL estiver conectado
4. Caso contrário, a API funcionará em modo de memória

## Dúvidas?

- Documentação Vercel: https://vercel.com/docs
- Documentação Render: https://render.com/docs
- Documentação Netlify: https://docs.netlify.com
- Documentação Heroku: https://devcenter.heroku.com
