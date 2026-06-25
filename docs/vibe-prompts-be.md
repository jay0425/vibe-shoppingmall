1. /server 폴더 안에 nodejs, express, mongodb, typescript 조합으로 프로젝트 셋팅해줘
2. 첨부한 컨벤션 참고해서 /server 아래 내용 전체적으로 수정해줘
3. /server 메시지 내용 한글로 변경해주고 한글로 각각 뭐하는 함수인지 짧게 작성주석으로
4. 서버에서 유저 스키마 만들어줘.
   email 필수
   name 필수
   password 필수
   user_type 필수, customer (customer, admin)
   address 필수 아님
   이런 스키마를 timestamp 기능과 함께 만들어줘
5. 이 스키마를 참고해서 유저 데이터를 CRUD하는 라우터를 만들어줘
6. server/src/controllers/user.controller.ts : 유저 정보 생성할 때 패스워드는 암호화해서 저장해줘
7. 첨부한 파일 참고해서 로그인 라우터 만들어줘 유저는 이메일과 비밀번호로 로그인할 수 있고 로그인 성공 실패에 대한 적절한 처리도 해줘.
8. 로그인 시 토큰 발급 기능도 넣어줘.
9. /server 에서 토큰으로 유저정보를 가져올 수 있는 라우터를 만들어줘

### 상품 CRUD

1. /server 상품 등록하기 기능을 만들 예정이다. 상품은

sku (상품 id값. 유니크해야 함.)
상품 이름
상품가격
카테고리 (상의, 하의, 액세서리)
이미지 => cloudinary (이미지를 string 값으로)
설명 필수값 아님

이런 상품 스키마를 만들어줘.

2. 상품을 CRUD 해주는 라우터 만들어줘

### 카드 CRUD

1. server/src/models
   여기에 장바구니 스키마를 추가해줘
2. server/src/routes
   지금 만든 스키마 참고해서 위 루트로 장바구니 라우터 추가해줘
3. JWT 인증 미들웨어가 다른 곳에서도 사용될거 같다. 로직 파일 분리해줘
4. JWT 인증 미들웨어로 장바구니 쪽도 접근 권한 관리 로직 추가해줘

### 주문하기

1. server/src/models
   주문하기 기능에 대한 스키마를 추가해줘
2. 각각 어떤 필드들인지 주석 설명 달아줘
3. 이 스키마를 참고해서 주문 라우터, 컨트롤러 추가해줘
4. server/src/controllers/order.controller.ts : 주문 생성 전 주문 중복 여부 체크, 결제 검증 등을 하는 로직 추가해줘

### 관리자 주문 내역 조회

1. server/src/controllers

admin에서 주문 조회를 할 수 있는 컨트롤러, 라우터를 만들어줘
