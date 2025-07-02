# Dockerfile
# Node.js 공식 이미지 사용
FROM node:20-alpine

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 작업 디렉토리로 복사 후 의존성 설치
COPY package.json package-lock.json ./
# 빌드시 dev디펜던시 제외 최소 구성만 설치
ENV NODE_ENV=production
RUN npm install --omit=dev

# 현재 폴더의 모든 파일, 폴더를 /app으로 복사
COPY . .

# 컨테이너 실행 시 실행할 명령어
CMD ["npm", "start"]

# 컨테이너에서 사용할 포트 지정
EXPOSE 3001