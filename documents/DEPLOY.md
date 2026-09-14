# Deploy checklist (staging / produção)

## Variáveis obrigatórias
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET` (≥ 64 bytes em Base64: `openssl rand -base64 64`)
- `FRONTEND_URL` — URL pública do Angular
- `CORS_ALLOWED_ORIGINS` — mesma URL (e outras, separadas por vírgula)
- `AUTH_COOKIE_SECURE=true` se houver HTTPS
- `SPRING_PROFILES_ACTIVE=prod` (Swagger off, cookie Secure, só `/actuator/health`)

## Local (dev)
```bash
# backend — perfil default, Swagger on, CORS localhost
./mvnw spring-boot:run

# frontend
npm start   # API → http://localhost:8081/api
```

## Docker (staging simples)
1. `cp .env.example .env` e preencher
2. Ajustar `CORS_ALLOWED_ORIGINS` / `FRONTEND_URL` ao host que vais usar (ex. `http://localhost`)
3. `docker compose up --build`
4. App: `http://localhost` · API health: `http://localhost:8081/actuator/health`

O nginx do frontend faz proxy de `/api` → `backend:8081`, por isso o build de produção usa `apiUrl: '/api'`.

## Build frontend sem Docker
```bash
npm run build   # production + environment.prod.ts
```

Para API noutro host (sem proxy):
```bash
# editar src/environments/environment.prod.ts → apiUrl: 'https://api.exemplo.com/api'
npm run build
```

## Produção — não esquecer
- [ ] HTTPS + `AUTH_COOKIE_SECURE=true`
- [ ] SMTP real (`MAIL_HOST`, …) se quiseres reset de password por email
- [ ] `SWAGGER_ENABLED=false` (já forçado no perfil `prod`)
- [ ] Não expor a porta do backend publicamente se o nginx já faz proxy
- [ ] Rotacionar `JWT_SECRET` e passwords da BD
