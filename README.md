# XerivoLearn Platform (Marketing + Parent App + Educator + Admin CMS)

This project supports your full structure:

- `xerivolearn.com` -> marketing website
- `app.xerivolearn.com` -> parent app (video library + child profiles)
- `educator.xerivolearn.com` -> educator portal login
- `admin.xerivolearn.com` -> admin CMS

Single-host fallback also works (Railway free domain):

- `/` marketing
- `/app/` parent app
- `/educator/` educator portal
- `/admin/` admin CMS

## Project Structure

```text
backend/
  data/videos.json
  data/users.json
  data/favorites.json
  data/children.json
  data/password_resets.json
  data/settings.json
  server.js
sites/
  marketing/
  app/
  educator/
  admin/
.env.example
railway.json
```

## Quick Start

1. Copy `.env.example` to `.env`
2. Set at least:
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `EDUCATOR_EMAIL`
   - `EDUCATOR_PASSWORD`
3. For Railway Postgres (recommended), set:
   - `DATABASE_URL` (from Railway Postgres service)
   - Optional: `PG_SSL=true`
   - Optional: `REQUIRE_POSTGRES=true` (recommended on Railway production)
4. Run:
   - `npm start`
5. Open:
   - `http://localhost:8080/`
   - `http://localhost:8080/app/`
   - `http://localhost:8080/educator/`
   - `http://localhost:8080/admin/`

## Roles and Access

- `parent`: can watch videos, use favorites, manage child profiles
- `educator`: separate login and educator-only video library endpoint
- `admin`: manages all video content in CMS

Parent-only watching is enforced at API level:

- `GET /api/videos` requires `parent` role

## Subscription Model in Marketing

- Parent plan:
  - Bangla: `৳99 / month`
  - English: `$1 / month`
- Educator plan:
  - Bangla: `৳2000 / year`
  - English: `$20 / year`

## Auth Features

- Admin login with email/password
- Educator login with email/password
- Parent registration + login
- Parent signup requires captcha + terms acceptance
- One email can be used by only one account
- Password reset flow via email link
- JWT session auth
- Role-based API checks (`admin`, `parent`, `educator`)

## Main API Endpoints

- Auth:
  - `GET /api/public/settings`
  - `GET /api/auth/captcha`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `GET /api/auth/me`
- Parent:
  - `GET /api/videos`
  - `GET /api/parent/favorites`
  - `POST /api/parent/favorites/:videoId`
  - `GET /api/parent/children`
  - `POST /api/parent/children`
  - `PUT /api/parent/children/:id`
  - `DELETE /api/parent/children/:id`
- Educator:
  - `GET /api/educator/me`
  - `GET /api/educator/videos`
- Admin:
  - `GET /api/admin/me`
  - `GET /api/admin/settings`
  - `PUT /api/admin/settings/terms`
  - `GET /api/admin/videos`
  - `POST /api/admin/videos`
  - `PUT /api/admin/videos/:id`
  - `DELETE /api/admin/videos/:id`

## Railway Deploy

1. Push repo to GitHub
2. Create Railway project from repo
3. Add Railway Variables:
   - `DATABASE_URL` (from Railway Postgres)
   - `REQUIRE_POSTGRES=true` (recommended)
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `EDUCATOR_EMAIL`
   - `EDUCATOR_PASSWORD`
   - Optional: `EDUCATOR_NAME`
   - Optional: `JWT_TTL_SECONDS`
   - Optional: `APP_BASE_URL`
   - Optional: `PG_SSL=true`
   - Optional: `PASSWORD_RESET_TTL_MINUTES`
   - Optional SMTP provider: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`
   - Optional: `PASSWORD_RESET_FROM_EMAIL`
   - Optional: `RESEND_API_KEY`
   - Optional: `PASSWORD_RESET_WEBHOOK_URL`
   - Optional: `PASSWORD_RESET_DEBUG`
   - Optional: `CAPTCHA_TTL_MINUTES`
4. Deploy
5. Use Railway free URL first, then attach custom domains later

Notes:

- On first start, default admin and educator users are auto-created automatically.
- With `DATABASE_URL` set, data is stored in PostgreSQL and the schema is auto-created.
- First PostgreSQL boot can auto-import existing JSON data from `backend/data/` if DB is empty.
- Keep `ADMIN_PASSWORD`, `EDUCATOR_PASSWORD`, and `JWT_SECRET` strong.
- Password reset emails are sent automatically when SMTP (`SMTP_*`) or Resend (`RESEND_API_KEY` + `PASSWORD_RESET_FROM_EMAIL`) is configured.
- If no provider is configured, reset links are logged only for server-side debugging.
- In Railway Raw Editor, prefer `KEY=value` without wrapping values in quotes.
