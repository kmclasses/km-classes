# KM CLASSES — Online Starter

This is a starter full-stack version of the KM CLASSES app.

## Run locally
1. Install Node.js.
2. Open a terminal in this folder.
3. Run `npm install`
4. Set secure admin credentials:
   - Windows PowerShell: `$env:ADMIN_USER="yourname"; $env:ADMIN_PASS="your-strong-password"`
   - macOS/Linux: `export ADMIN_USER="yourname"; export ADMIN_PASS="your-strong-password"`
5. Run `npm start`
6. Open `http://localhost:3000`

The default credentials are `admin / change-me` only if environment variables are not set. Change them before any public deployment.

## What is included
- Student-facing Home, MCQ Practice, Notes, Classes
- UGC NET Commerce 10-unit notes categories
- Commerce + HTET + Child Development and Pedagogy subjects
- Admin login
- Add/delete MCQs
- Add notes
- JSON file persistence (`data.json` is created automatically)

## Production requirements
For a real public app, deploy this server on a Node-compatible host and replace the JSON file with a proper database, HTTPS, secure session/token authentication, file storage for PDFs/videos, and role-based access.


## Deploy on Render
1. Create a Render account and connect a GitHub repository containing these files.
2. Create a **Web Service** from the repository, or use the included `render.yaml`.
3. Set environment variables:
   - `ADMIN_USER` = your chosen admin username
   - `ADMIN_PASS` = a strong password
4. Render will run:
   - Build: `npm install`
   - Start: `npm start`
5. Open the generated `https://...onrender.com` URL.
6. Open **Admin** inside the app and sign in with your environment-variable credentials.

### Important
The starter currently persists content in `data.json`. On many cloud hosts, local disk may not be persistent across redeploys/restarts. For production, use a managed database (for example PostgreSQL) and secure session authentication before relying on it for real student content.
