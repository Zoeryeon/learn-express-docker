// routes/ user.js
const express = require('express');
// 라우터 객체 생성
const router = express.Router();
// 디비 객체 받기
const connection = require('../config/mysql');

// POST /user - 사용자 생성
router.post('/user', (req, res) => {
  const { name, age, comment } = req.body;

  // name과 age는 디비에서 not null이므로 필수사항
  if (!name || !age) {
    // 400: 잘못된 요청, 에러메세지 전송
    return res.status(400).send('필수 필드 없음: name, age');
  }

  const query = 'INSERT INTO user (name, age, comment) VALUES(? ,? ,?)';
  // comment는 undefined일 수 있으므로 db에 저장불가하므로 null로 변경
  const values = [name, age, comment || null];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('유저 생성 에러: ', err.message);
      return res.status(500).send('Database error');
    }
    res.json(result);
  });
});

// GET /user - 모든 사용자 조회
router.get('/user', (req, res) => {
  // results는 배열로 반환됨
  connection.query('SELECT * FROM user', (err, result) => {
    if (err) {
      console.error('사용자 가져오기 에러: ', err.message);
      //  500: 서버 내부 에러
      return res.status(500).send('Database Error');
    }
    res.json(result);
  });
});

// GET /user/:id 라우터 보다 위에 있어야함
router.get('/user/search', (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).send('검색어를 입력하세요');
  }

  // LINK : 문자열 검색 연산자
  const query = 'SELECT * FROM user WHERE name LIKE ?';
  // %(와일드 카드) 검색어가 포함되면 검색
  const searchValue = `%${search}%`;

  // 한개든 두개든 무조건 배열임
  connection.query(query, [searchValue], (err, result) => {
    if (err) {
      console.error('사용자 검색 에러: ', err.message);
      return res.status(500).send('Database error');
    }

    if (result.length === 0) {
      return res.status(404).send('검색된 사용자 없음');
    }

    res.json(result);
  });
});

// GET /user/:id - 특정 사용자 조회
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM user WHERE user_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('사용자 가져오기 에러: ', err.message);
      return res.status(500).sendStatus('Database error');
    }
    // result는 배열로 반환, id가 존재하지 않으면 빈 배열
    if (result.length === 0) {
      return res.status(404).send('사용자 없음');
    }
    res.json(result[0]);
  });
});

// PATCH /user/:id - 특정 사용자 정보 수정
router.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, comment } = req.body;

  // 수정할 내용이 모두 없으면 잘못된 요청
  if (!name && !age && !comment) {
    // 400: 잘못된 요청, 에러메세지 전송
    return res.status(400).send('수정할 내용 없음');
  }

  // 수정할 내용이 정해져 있지 않으므로 배열로 처리
  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (age) {
    updates.push('age = ?');
    values.push(age);
  }
  if (comment) {
    updates.push('comment = ?');
    values.push(comment);
  }
  // id는 쿼리 마지막에 있으므로 마지막에 추가
  values.push(id);

  const query = `UPDATE user SET ${updates.join(', ')} WHERE user_id = ?`;

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('사용자 수정 에러:', err.message);
      return res.status(500).send('Database error');
    }
    res.json(result);
  });
});

// DELETE /user/:id - 특정 사용자 삭제
router.delete('/user/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM user WHERE user_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('사용자 삭제 에러:', err.message);
      return res.status(500).send('Database error');
    }
    // result.affectedRows는 삭제된 행의 개수를 나타냄(mysql에서 보내줌)
    if (result.affectedRows === 0) {
      return res.status(404).send('사용자가 없습니다');
    }
    res.json(result);
  });
});

module.exports = router;
