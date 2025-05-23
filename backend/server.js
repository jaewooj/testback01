
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


// CORS 허용 도메인 명확히 지정
const allowedOrigins = [
    'https://shoosetosister.netlify.app',
    'https://shoosetosister.netlify.app/' // ← 이것도 허용
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS: ' + origin));
      }
    },
    credentials: true // 필요시 세션/쿠키 허용
  }));

// 미들웨어 설정
app.use(bodyParser.json());

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.naver.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
      });

    const mailOptions = {
        from: process.env.EMAIL_USER,      // 발신자: 본인 이메일 고정
        to: 'wodn1914@daum.net', // 이메일을 받을 다음 주소
        replyTo: email,                 // 사용자가 입력한 이메일
        subject: `고객 문의: ${name}`,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('문의 전송에 실패했습니다.');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('문의가 성공적으로 전송되었습니다!');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
