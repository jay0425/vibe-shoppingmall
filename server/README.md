# 쇼핑몰 서버

Node.js, Express, MongoDB, TypeScript 기반 백엔드 서버입니다.

## 설정

```bash
pnpm install
cp .env.example .env
# .env 값을 로컬 환경에 맞게 수정
pnpm dev
```

`.env`에는 다음 값을 설정해야 합니다.

- `MONGODB_URI`: MongoDB 접속 문자열
- `CORS_ORIGIN`: 허용할 클라이언트 origin. 여러 개면 쉼표로 구분
- `JWT_SECRET`: JWT 서명용 비밀값. 32자 이상 권장

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
