// app.js
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// 라우터 연결
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

// dotnev 활성화
dotenv.config();

// 익스프레스 인스턴스(객체) 생성
const app = express();
// nextjs가 3000이므로 포트변경
app.set('port', process.env.PORT || 3001);

// 미들웨어 설정
app.use(cors()); // 모든 출처에 대해 요청 허용
app.use(morgan('dev'));
// public 폴더를 정적 폴더로 지정
// 데이터 이미지를 /public/images에 넣고 경로를 db에 저장하여 프론트로 보내줌
app.use('/', express.static(path.join(__dirname, 'public')));
// 프론트에서 넘어온 json을 req.body에 변환하여 담아줌
app.use(express.json());
// 쿼리파라메터 값으로 한글이 들어올 경우 인토딩해줌
// extended: false이면 querystring모듈 사용
app.use(express.urlencoded({ extended: false }));
// 쿠키(브라우저에 데이터를 심어줌, 파일)를 파싱하여 req.cokkies 객체에 담아줌
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 설정(로그인 유무, 인증 관련)
app.use(
  session({
    // 세션 데이터 수정사항 없을 경우 저장하지 않음
    resave: false,
    // 세션에 저장할 내용이 없을 경우 세션을 저장하지 않음
    saveUninitialized: false,
    // 세션쿠키의 비밀키
    secret: process.env.COOKIE_SECRET,
    cookie: {
      // 자바스크립트로 쿠키 접근 방지
      httpOnly: true,
      // https가 아닌 환경에서도 사용할 수 있도록
      secure: false,
    },
    name: 'session-cookie',
  })
);

// 라우터 설정
app.use(indexRouter);
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);

// 에러처리 미들웨어 (status: 상태 메세지 / 500: 서버 에러)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// 서버실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
