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
