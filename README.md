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
3. Run:
   - `npm start`
4. Open:
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
- Password reset flow (request + reset token)
- JWT session auth
- Role-based API checks (`admin`, `parent`, `educator`)

## Main API Endpoints

- Auth:
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
   - `EDUCATOR_EMAIL`
   - `EDUCATOR_PASSWORD`
   - Optional: `EDUCATOR_NAME`
   - Optional: `JWT_TTL_SECONDS`
   - Optional: `APP_BASE_URL`
   - Optional: `PASSWORD_RESET_TTL_MINUTES`
   - Optional: `PASSWORD_RESET_WEBHOOK_URL`
   - Optional: `PASSWORD_RESET_DEBUG`
4. Deploy
5. Use Railway free URL first, then attach custom domains later

Notes:

- On first start, default admin and educator users are auto-created in `backend/data/users.json`.
- Keep `ADMIN_PASSWORD`, `EDUCATOR_PASSWORD`, and `JWT_SECRET` strong.
- Password reset links are logged in debug mode (or sent to webhook if configured).
