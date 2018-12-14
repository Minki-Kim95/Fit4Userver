# SE team4 Fit4U
only routing for android App

Front: [Android APP source code](https://github.com/kuk941025/Fit4YouAndroid)

URL: http://fit4u.tk/  (received domain name from freenom site)

# Use Env

GCP: 서버구축

Nodejs: 서버 개발 및 라우팅

MySql: 데이터베이스

# OpenSource

Sequelize: ORM으로 데이터베이스랑 연동을 더 편하게 하기 위해 사용

Phpmyadmin: 웹상에서 데이터 베이스를 관리할 때 사용

multer: 서버에 이미지 저장할 때 사용

express-session: 로그인 상태 세션 유지를 위해 사용

sha256: DB상에 유저의 비밀번호를 암호화하여 저장하기 위해 사용


# how to use

**fill the /configs/config.json by server and DB's user information**
```
./configs/config.json
```
**Install all dependencies**
```
npm install
```
**run the local server**
```
node bin/www
```
**connect(this server only use port 80)**
```
localhost
```
**how to check routing**
```
localhost를 이용하거나 소스코드를 다운받지 않는 경우 fit4u.tk를 이용하면된다.
그리고 ./doc/REST Doc.xlsx 파일의 라우팅 정보를 통해서 일정한 input 값을 넣고 값을 받으면 된다.
```
