# RRC Law Associates AI Backend

This backend provides a secure AI assistant endpoint for the RRC Law Associates website. It is a separate service from the static website and is intended to handle only the assistant API endpoints.

## Purpose

- Provide a backend for the website AI assistant
- Keep all LLM secret configuration on the server side
- Restrict legal guidance to general information only
- Keep the existing static website unchanged

## Node.js version

This project is intended for Node.js 24.x and above.

## Installation

```bash
cd rrc-law-ai
npm install
```

## Environment variables

Copy the example file and set your values:

```bash
cp .env.example .env
```

Required values:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (defaults to `gemini-3.8-flash`)
- `PORT`

Do not commit a real `.env` file. Keep the API key server-side only.

## Local development

```bash
npm run dev
```

## Production deployment to cPanel

1. Upload the project contents to the Node.js application directory on the cPanel host.
2. Ensure the app root is the project folder, such as `/home/rrcltdbn/rrc-law-ai`.
3. Set the startup file to `app.js`.
4. Set the production Node.js version to 24.x.
5. Set the application to use `PORT` from the runtime environment.
6. Restart the Node.js application from the cPanel panel after updating environment variables.

## API endpoints

- `GET /health`
- `POST /chat`

The cPanel application is mapped to the host root `/api`, so the live endpoints become:

- `https://rrclawassociates.com/api/health`
- `https://rrclawassociates.com/api/chat`

## Security notes

- Do not store API keys in frontend code
- Do not log visitor legal questions or case details
- Do not permanently store conversation history
- Keep all LLM access behind this server-side backend
- Use the existing static website for public content; do not replace it

## Restarting the cPanel Node.js app

After changing environment variables or code, restart the application in cPanel's Node.js app manager.

## Important

This is a backend-only addition. The public website remains static and unchanged.
