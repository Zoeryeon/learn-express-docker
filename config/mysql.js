// config/mysql.js
const mysql = require('mysql2');

// 디비 연결 정보, 컨테이너 환경(db) 또는 로컬(localhost) 환경 중 하나로 접속
// createConnection -> createPool로 변경
// 도커환경에선 express가 먼저 실행될 수 있으므로 createConnection사용시
// 디비컨테이너가 실행전이면 연결이 끊어지며 복구하지않으므로
// createPool사용하여 끊긴 연결 자동 복구, 연결 가능 상태 감지
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'nodejs_db',
  // 커넥션 풀이 가득차면 추가요청을 쌓고 기다림
  waitForConnections: true,
  // 최대 연결 수
  connectionLimit: 10,
  // 커넥션 풀이 가득차도 무제한 대기 허용
  queueLimit: 0,
});

module.exports = connection;
