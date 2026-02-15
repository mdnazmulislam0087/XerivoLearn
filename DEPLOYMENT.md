# Deployment Guide for xerivolearn.com

## Railway (Recommended)

## 1) Create Railway Service

1. Push this project to GitHub.
2. Create a Railway project from the repo.
3. Add a `PostgreSQL` service in Railway and copy its `DATABASE_URL`.
4. Set environment variables:
   - `DATABASE_URL` (from Railway Postgres service)
   - `REQUIRE_POSTGRES=true` (recommended in production)
   - `JWT_SECRET=your-long-random-secret`
   - `ADMIN_EMAIL=admin@yourdomain.com`
   - `ADMIN_PASSWORD=your-strong-admin-password`
   - `EDUCATOR_EMAIL=educator@yourdomain.com`
   - `EDUCATOR_PASSWORD=your-strong-educator-password`
   - Optional: `EDUCATOR_NAME=Xerivo Educator`
   - Optional: `PG_SSL=true`
   - Optional: `JWT_TTL_SECONDS=604800`
   - Optional: `APP_BASE_URL=https://xerivolearn.com`
   - Optional: `PASSWORD_RESET_TTL_MINUTES=30`
   - Optional: `PASSWORD_RESET_DEBUG=false`
   - Optional SMTP provider: `SMTP_HOST=smtp.yourprovider.com`
   - Optional SMTP provider: `SMTP_PORT=587`
   - Optional SMTP provider: `SMTP_SECURE=false`
   - Optional SMTP provider: `SMTP_USER=your-smtp-user`
   - Optional SMTP provider: `SMTP_PASS=your-smtp-password`
   - Optional SMTP provider: `SMTP_FROM_EMAIL=noreply@yourdomain.com`
   - Optional: `PASSWORD_RESET_FROM_EMAIL=noreply@yourdomain.com`
   - Optional: `RESEND_API_KEY=re_xxx`
   - Optional: `PASSWORD_RESET_WEBHOOK_URL=https://your-email-worker.example/send`
   - Optional: `CAPTCHA_TTL_MINUTES=10`
5. Deploy. Railway uses `railway.json` and starts with `npm start`.
6. In Railway Raw Editor, prefer `KEY=value` without wrapping values in quotes.

## 2) Attach Domains in Railway

Attach these custom domains to the same service:

- `xerivolearn.com`
- `app.xerivolearn.com`
- `educator.xerivolearn.com`
- `admin.xerivolearn.com`

Railway will show DNS targets for each domain.

## 3) DNS Records

Create records:

- `@` -> your server target (A/ALIAS/CNAME based on provider)
- `app` -> same Railway target
- `educator` -> same Railway target
- `admin` -> same Railway target

## 4) If You Self-Host Instead (Nginx reverse proxy example)

Run the Node app on port `8080` (PM2/systemd).

Point all domains to the same app:

```nginx
server {
  listen 80;
  server_name xerivolearn.com www.xerivolearn.com app.xerivolearn.com educator.xerivolearn.com admin.xerivolearn.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Routing behavior:

- `xerivolearn.com` -> marketing site
- `app.xerivolearn.com` -> parent app
- `educator.xerivolearn.com` -> educator portal
- `admin.xerivolearn.com` -> admin CMS

Single-host fallback paths still work:

- `/app/`
- `/educator/`
- `/admin/`

## 5) Secure Admin and Educator Access

- Set strong `JWT_SECRET`, `ADMIN_PASSWORD`, and `EDUCATOR_PASSWORD`.
- Serve HTTPS with Let's Encrypt (or Railway managed TLS).
- Rotate admin/educator passwords periodically.
- If you use optional `ADMIN_TOKEN` fallback, keep it private.
- Disable `PASSWORD_RESET_DEBUG` in production.
- For automatic reset emails, configure SMTP (`SMTP_*`) or Resend (`RESEND_API_KEY` + `PASSWORD_RESET_FROM_EMAIL`).

## 6) Optional: Keep subdomains for later

If you start with Railway free URL only, everything still works via paths:

- `https://<railway-domain>/`
- `https://<railway-domain>/app/`
- `https://<railway-domain>/educator/`
- `https://<railway-domain>/admin/`

You can attach custom domains later without code changes.
