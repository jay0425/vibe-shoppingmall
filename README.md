# WearJoy

## 프로젝트 구조

```text
client/  - Frontend
server/  - Backend
docs/    - 프로젝트 문서
```

## 실행 방법

```bash
pnpm install
cp server/.env.example server/.env
pnpm dev:server
```

### 공통 스크립트

```bash
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm build
```

## 개발 컨벤션

### 커밋 메시지 컨벤션

자세한 내용은 [docs/convention.md](./docs/convention.md)를 참고한다.

---

### 브랜치 컨벤션

브랜치명은 작업 목적을 명확히 알 수 있도록 작성한다.

#### Format

```text
<type>/<scope>-<description>
```

#### Branch Types

| Type       | Description                   |
| ---------- | ----------------------------- |
| `feat`     | 새로운 기능 개발              |
| `fix`      | 버그 수정                     |
| `docs`     | 문서 수정                     |
| `style`    | 코드 스타일 수정              |
| `refactor` | 기능 변화 없는 코드 구조 개선 |
| `test`     | 테스트 코드 추가 및 수정      |
| `chore`    | 설정, 패키지, 빌드 작업       |
| `remove`   | 파일 또는 코드 삭제           |

#### Scope

| Scope    | Description            |
| -------- | ---------------------- |
| `fe`     | 프론트엔드             |
| `be`     | 백엔드                 |
| `common` | 공통 설정 및 루트 작업 |

#### Examples

```text
feat/fe-login
feat/be-auth-api
fix/fe-cart-button
docs/common-readme
chore/common-eslint
```

#### Rules

- 브랜치명은 영어 소문자를 사용한다.
- 단어 구분은 하이픈(`-`)을 사용한다.
- 작업 목적이 드러나도록 작성한다.
- 하나의 브랜치에서는 하나의 작업만 수행한다.

---

### 폴더/파일 네이밍 컨벤션

#### Barrel Pattern

프로젝트 전반에서 Barrel Pattern을 사용한다.

#### 공통 규칙

- 폴더명은 `kebab-case`를 사용한다.
- 일반 파일명은 `kebab-case`를 사용한다.
- 컴포넌트 파일은 `PascalCase`를 사용한다.
- 커스텀 훅 파일은 `use` 접두사를 사용한다.
- 타입 파일은 `.types.ts`를 사용한다.
- 테스트 파일은 `.test.ts` 또는 `.test.tsx`를 사용한다.
- 역할이 명확하도록 파일명을 작성한다.

#### Examples

| 대상           | 규칙               | 예시                               |
| -------------- | ------------------ | ---------------------------------- |
| 폴더           | `kebab-case`       | `user-profile`, `product-list`     |
| 일반 파일      | `kebab-case`       | `format-price.ts`, `auth-api.ts`   |
| React 컴포넌트 | `PascalCase`       | `ProductCard.tsx`, `LoginForm.tsx` |
| 커스텀 훅      | `use + PascalCase` | `useAuth.ts`, `useCart.ts`         |
| 타입 파일      | `.type.ts`         | `user.type.ts`, `product.type.ts`  |
| 테스트 파일    | `.test.ts(x)`      | `ProductCard.test.tsx`             |
| Barrel 파일    | `index.ts`         | `index.ts`                         |

#### Rules

- 이름만 보고 역할을 알 수 있도록 작성한다.
- 의미 없는 파일명은 사용하지 않는다.
- 약어 사용은 최소화한다.
- 동일 역할 파일은 동일 접미사를 사용한다.

```text
*.route.ts
*.controller.ts
*.service.ts
*.model.ts
*.middleware.ts
*.validator.ts
*.type.ts
```

---

### 코드 스타일

#### TypeScript

- TypeScript 사용을 기본으로 한다.
- `any` 사용을 지양한다.
- 타입 추론이 가능하더라도 공용 타입은 명시적으로 선언한다.

#### Naming

| 대상       | 규칙             |
| ---------- | ---------------- |
| 변수       | camelCase        |
| 함수       | camelCase        |
| React Hook | use + PascalCase |
| 컴포넌트   | PascalCase       |
| 타입       | PascalCase       |
| 인터페이스 | PascalCase       |
| Enum       | PascalCase       |
| 상수       | UPPER_SNAKE_CASE |

#### Examples

```ts
const userName = 'jaehee';

function getUserInfo() {}

const MAX_RETRY_COUNT = 3;

interface UserInfo {}

type ProductDetail = {};

enum UserRole {}
```

#### Next.js

- 컴포넌트는 함수형 컴포넌트를 사용한다.
- Props 타입은 별도로 선언한다.
- 공통 로직은 Custom Hook으로 분리한다.
- 서버 상태는 TanStack Query를 사용한다.
- 전역 상태는 Zustand를 사용한다.

#### Import Order

```ts
// external
import { useState } from 'react';

// internal
import { Button } from '@/components/Button';

// type
import type { User } from '@/types/user.type';
```

#### Formatting

- Prettier 설정을 따른다.
- ESLint 규칙을 따른다.
- 들여쓰기는 2칸을 사용한다.
- 문자열은 single quote(`'`)를 사용한다.
- 세미콜론(`;`)을 사용한다.
