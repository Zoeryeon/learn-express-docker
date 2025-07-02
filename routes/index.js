// routes/ index.js
const express = require('express');
// 라우터 객체 생성
const router = express.Router();

// GET /라우터
router.get('/', (req, res) => {
  // app객체 접근(app.js에 있음)
  // console.log(req.app.get('port'), '포트번호');
  // 요청 본문 접근
  // console.log(req.body, '요청본문');
  // 요청한 브라우저 ip 주소 알 수 있음(::1은 IPv6표기법)
  // console.log(req.ip, '요청ip');
  // 경로 /:userId로 변경하여 확인
  // console.log(req.params.userId, '경로 매개변수');
  // 쿼리를 객채 형태로 받는다
  // console.log(req.query, '쿼리 매개변수');

  // 일반 쿠키(세션 정보x 다른 여러가지 정보)
  if (!req.signedCookies.name) {
    // 크롬 - 어플리케이션 - 쿠키에서 확인
    // 크롬 maxage는 UTC이므로 +9해야 한국 시간, 다른탭으로 이동후 삭제 확인
    // 쿠키 만드는 함수, 쿠키 이름 name
    res.cookie('name', 'express_cookie', {
      // maxAge: 1000 * 60 * 60 * 24, // 유효기간 1일
      maxAge: 1000 * 60, // 유효기간 1분
      httpOnly: true, // js로 접근 못하게 하는 보안속성
      secure: false, // http에서도 쿠키 전송
      signed: true, // 쿠키값에 서명 추가하여 변조 방지
    });
  } else {
    // 쿠키가 존재할 경우, 브라우저 새로고침하여 두번째 요청에서 확인
    console.log(req.signedCookies.name, '서명된 쿠키');
  }

  res.send('hello, express');
});

module.exports = router;
