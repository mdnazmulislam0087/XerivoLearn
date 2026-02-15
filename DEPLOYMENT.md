# Deployment Guide for xerivolearn.com

## Railway (Recommended for your setup)

## 1) Create Railway Service

1. Push this project to GitHub.
2. Create a new Railway project from the repo.
3. Set environment variable:
   - `ADMIN_TOKEN=your-strong-secret`
4. Deploy. Railway uses `railway.json` and starts with `npm start`.

## 2) Attach Domains in Railway

Attach these custom domains to the same service:

- `xerivolearn.com`
- `app.xerivolearn.com`
- `admin.xerivolearn.com`

Railway will show DNS targets for each domain.

## 3) DNS Records

Create records:

- `@` -> your server IP (A record)
- `app` -> same server IP (A record)
- `admin` -> same server IP (A record)

## 4) If You Self-Host Instead (Nginx reverse proxy example)

Run the Node app with PM2/systemd on port `8080`.

Then point all 3 domains to the same app:

```nginx
server {
  listen 80;
  server_name xerivolearn.com www.xerivolearn.com app.xerivolearn.com admin.xerivolearn.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

The app reads the `Host` header and serves:

- marketing site for `xerivolearn.com`
- app site for `app.xerivolearn.com`
- admin site for `admin.xerivolearn.com`
- admin site for `app.xerivolearn.com/admin` (optional mode)

## 5) Secure Admin

- Set strong `ADMIN_TOKEN` in `.env`.
- Serve HTTPS with Let's Encrypt.
- Rotate token periodically.

## 6) Optional: Keep admin inside app only

If you decide to skip `admin.xerivolearn.com`, you can use:

- `app.xerivolearn.com/admin`

No code change is needed in this starter.
