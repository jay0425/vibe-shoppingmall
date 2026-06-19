# 쇼핑몰 서버

Node.js, Express, MongoDB, TypeScript 기반 백엔드 서버입니다.

## 설정

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## 스크립트

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: TypeScript 빌드
- `pnpm start`: 빌드된 서버 실행
- `pnpm lint`: ESLint 검사
- `pnpm format`: Prettier 포맷 적용
- `pnpm format:check`: Prettier 포맷 검사
- `pnpm typecheck`: 타입 검사

## 상태 확인

```http
GET /health
GET /api/health
```
