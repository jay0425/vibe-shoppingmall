# Commit Message Convention

본 프로젝트는 Conventional Commits 규칙을 따른다.

- 공식 문서: https://www.conventionalcommits.org/en/v1.0.0/
- 참고 자료: https://commitlint.js.org/

## Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type     | Description                                                 |
| -------- | ----------------------------------------------------------- |
| feat     | 새로운 기능 추가                                            |
| fix      | 버그 수정                                                   |
| docs     | 문서 수정 (README, 문서 등)                                 |
| style    | 코드 로직 변경 없이 스타일 수정 (포맷팅, 세미콜론, 공백 등) |
| refactor | 기능 변화 없는 코드 구조 개선                               |
| test     | 테스트 코드 추가 및 수정                                    |
| chore    | 설정, 패키지, 빌드, 의존성 관리                             |
| remove   | 파일 또는 코드 삭제                                         |

## Scope (Optional)

변경 범위를 명시할 수 있다.

| Scope    | 의미                        |
| -------- | --------------------------- |
| `fe`     | 프론트엔드 변경             |
| `be`     | 백엔드 변경                 |
| `common` | 프론트엔드/백엔드 공통 변경 |

### EXAMPLE

```text
feat(auth): 로그인 기능 추가
fix(api): 회원 조회 오류 수정
refactor(user): 사용자 서비스 리팩토링
```

## Rules

- 제목은 50자 이내로 작성한다.
- 제목은 명령형으로 작성한다.
- 마침표(.)를 사용하지 않는다.
- 하나의 커밋은 하나의 작업만 포함한다.
- 커밋 메시지는 변경 사항을 명확하게 설명한다.
