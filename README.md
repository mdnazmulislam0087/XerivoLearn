# XerivoLearn Platform (Marketing + App + Admin CMS)

This project matches your structure:

- `xerivolearn.com` -> marketing
- `app.xerivolearn.com` -> parent/child video app
- `admin.xerivolearn.com` -> admin CMS

Single-host fallback also works (Railway free domain):

- `/` marketing
- `/app/` user app
- `/admin/` admin CMS

## Project Structure

```text
backend/
  data/videos.json
  data/users.json
  data/favorites.json
  data/children.json
  data/password_resets.json
  server.js
sites/
  marketing/
  app/
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
3. Run:
   - `npm start`
4. Open:
   - `http://localhost:8080/`
   - `http://localhost:8080/app/`
   - `http://localhost:8080/admin/`

## Auth Features Added

- Admin login with email/password
- Parent registration + login
- Password reset flow (request + reset token)
- JWT session auth
- Role-based API checks (`admin`, `parent`)
- Parent favorites save/toggle
- Child profiles with avatar selection

## Main API Endpoints

- Public:
  - `GET /api/videos`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `GET /api/auth/me`
- Parent:
  - `GET /api/parent/favorites`
  - `POST /api/parent/favorites/:videoId`
  - `GET /api/parent/children`
  - `POST /api/parent/children`
  - `PUT /api/parent/children/:id`
  - `DELETE /api/parent/children/:id`
- Admin:
  - `GET /api/admin/me`
  - `GET /api/admin/videos`
  - `POST /api/admin/videos`
  - `PUT /api/admin/videos/:id`
  - `DELETE /api/admin/videos/:id`

## Railway Deploy

1. Push repo to GitHub
2. Create Railway project from repo
3. Add Railway Variables:
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - Optional: `JWT_TTL_SECONDS`
   - Optional: `APP_BASE_URL`
   - Optional: `PASSWORD_RESET_TTL_MINUTES`
   - Optional: `PASSWORD_RESET_WEBHOOK_URL`
   - Optional: `PASSWORD_RESET_DEBUG`
4. Deploy
5. Use free URL first, then attach custom domains later

Notes:
- On first start, admin user is auto-created in `backend/data/users.json` from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Keep `ADMIN_PASSWORD` and `JWT_SECRET` strong.
- Password reset links are logged to server console in debug mode (or sent to webhook if configured).
