# XerivoLearn Starter (Marketing + App + Admin CMS)

This starter matches your requested structure:

- `xerivolearn.com` -> marketing static experience
- `app.xerivolearn.com` -> user app (video library)
- `admin.xerivolearn.com` -> admin CMS

It also supports admin inside app (`/admin`) if you prefer one app domain.

## Project Structure

```text
backend/
  data/videos.json
  server.js
sites/
  marketing/
  app/
  admin/
.env.example
package.json
DEPLOYMENT.md
```

## Quick Start

1. Create env file:
   - Copy `.env.example` to `.env`
   - Set a strong `ADMIN_TOKEN`
2. Start server:
   - `npm start`
3. Open local URLs:
   - Marketing: `http://localhost:8080/`
   - User app: `http://localhost:8080/app/`
   - Admin CMS: `http://localhost:8080/admin/`

## Deploy on Railway

1. Push this project to GitHub.
2. In Railway, create a new project from that GitHub repo.
3. Add environment variable in Railway:
   - `ADMIN_TOKEN=your-strong-token`
4. Deploy (Railway will run `npm start` from `railway.json`).
5. Add custom domains in Railway:
   - `xerivolearn.com`
   - `app.xerivolearn.com`
   - `admin.xerivolearn.com`

Notes:
- `PORT` is provided automatically by Railway.
- Before custom domains are attached, preview domain links fallback to `/app/` and `/admin/`.

## How CMS Works

- Public videos endpoint:
  - `GET /api/videos`
- Admin endpoints (require header `X-Admin-Token`):
  - `GET /api/admin/videos`
  - `POST /api/admin/videos`
  - `PUT /api/admin/videos/:id`
  - `DELETE /api/admin/videos/:id`

Video data is stored in `backend/data/videos.json`.

## Next Features You Can Add

- Parent and child profiles
- JWT login for admin and users
- Progress tracking and watch history
- Cloud storage for thumbnails and video files
- Role-based CMS access
