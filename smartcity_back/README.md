# 2.1 Backend 설치

**인증/인가 모듈의 Backend를 설치하는 과정을 설명합니다. 실질적인 인증/인가를 담당하며 Node 버전 14, npm v6 이상을 권장합니다.**

## 2.1.1 Node js 및 Postgresql 설치

**Centos 7 기준으로 Node js 14를 설치하는 방법은 다음과 같은 순서로 진행됩니다.**

 1. `sudo yum upgrade`
 2. `sudo yum update`
 3. Repository 추가<br/>
    `curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -`
 4. `sudo yum clean all && sudo yum makecache fast`
 5. `sudo yum install -y gcc-c++make`
 6. `sudo yum install -y nodejs`


**Centos 7 기준으로 Postgresql 11을 설치하는 방법은 다음과 같은 순서로 진행됩니다.**

 1. Repository 추가<br/>`sudo rpm –Uvh  https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm`
 2.  Postgresql 11 설치<br/>
    `sudo yum install -y postgresql11-server postgresql11-contrib`
 3. 기본 Database 생성<br/>
    `sudo /usr/pgsql-11/bin/postgresql-11-setup initdb`
 4. 서비스 실행 및 등록<br/>
     `sudo systemctl start postgresql-11` 
    `sudo systenctl enable postgresql-11` 

 **Postgresql 계정의 비밀번호를 사용자의 비밀번호로 변경합니다.**

 1. `sudo vi /var/lib/pgsql/11/data/pg_hba.conf`      
 2. 모든 방식을 trust로 변경<br/>
 ![1 hba_conf](https://user-images.githubusercontent.com/42496861/162934027-e8e686e7-2037-44d1-8e95-0213cb14bd52.png)
 3. postgresql 재시작<br/>
      `sudo systemctl service restart postgresql-11`
 4. postgres 계정으로 변경<br/>
      `su - postgres`
 5. psql 접속<br/>
      `psql` 
 6. postgres 계정의 비밀번호를 원하는 비밀번호로 변경<br/>`alter user postgres with password "사용할 비밀번호"`
 7. 인증 방식을 다시 trust -> md5로 모두 변경
 8. psql 재시작<br/>`sudo systemctl service restart postgresql-11`

## 2.1.2 Postgresql 사용자 및 DB 생성
**인증/인가 모듈에서 사용할 계정 및 데이터베이스를 생성합니다.**
 1. Psql 접속<br/>`psql -U postgres`
 2. 인증/인가 모듈에서 사용할 데이터베이스 생성<br/>`CREATE DATABASE 데이터베이스 이름 ENCODING 'utf-8';`
 3. 인증/인가 모듈 데이터베이스를 사용할 사용자 생성<br/>`CREATE USER 사용자 이름 password '사용할 비밀번호';`
 4. 데이터베이스의 소유권을 사용자에게 위임<br/>`alter database 데이터베이스 이름 owner to 사용자 이름`
 5. 데이터베이스의 모든 권한을 사용자에게 위임<br/>`grant all on database 데이터베이스 이름 to 사용자 이름 with grant option;`
 6. `exit`
 7. 생성한 관리자와 데이터베이스 정보로 접속 확인<br/>`psql -U 사용자 이름 이름 -d 데이터베이스 이름`

## 2.1.3 인증/인가 모듈 서버 설정

***/server_conf.json* 에서 서버 운영에 필요한 정보를 설정합니다.**

~~~json
{
 "serverip" : "Standalone IP",
 "serverport" : "Standalone PORT",
 "dbUserId" : "enter your DB ID",
 "dbUserPwd" : "enter your DB PASSWORD",
 "dbHost" : "IP of Database",
 "dbName" : "NAME of Database",
 "dbPort" : "PORT of Database",
 "emalAccountID" : "enter your email ID",
 "emailAccountPwd" : "enter your email PASSWORD"
}
~~~
 1. **serverip** : 인증/인가 모듈을 구동하는 서버의 IP를 입력

 2. **serverport** : 인증/인가 모듈을 구동할 포트를 입력

 3. **dbUserId** : postgresql 사용자의 이름을 입력

 4. **dbUserPwd** : postgresql 사용자의 비밀번호를 입력

 5. **dbHost** : postgresql 서버의 주소를 입력 (로컬에 설치했을 경우 127.0.0.1)

 6. **dbName** : postgresql 데이터베이스 이름을 입력

 7. **dbPort** : postgresql의 port를 입력 (기본 5432)

 8. **emailAccountId** : 이메일 인증을 제공해줄 아이디 입력(지메일 권장, 해당 계정은 인증메일의 발신자가 됨)

 9. **emailAccountPwd** : 이메일 인증을 제공해줄 아이디의 비밀번호 입력

    

## 2.1.4 인증/인가 모듈 DB Table 생성

**인증/인가 모듈에 사용할 데이터베이스에 관련 테이블을 생성하고 관리자의 계정을 생성합니다.**<br/>
소스파일의 **/initDB/createTable.js**  를 실행합니다.<br/>


smartcity_back 폴더 기준<br/>
`node /initDB/createTable.js`

~~~bash
/Home/citydatahub_security/smartcity_back $ node initDB/createTable.js
Database connected..
Success!
~~~
<br/>
Success! 메시지가 출력되면 정상적으로 테이블이 생성 및 관리자 계정이 생성된 것입니다.<br/>
관리자의 기본 정보는 <br/>
**ID** : admin<br/>
**Password** : admin45@<br/>
입니다.

비밀번호를 변경하고 싶으신 경우 인증/인가 모듈 프론트엔드를 설치하신 뒤 진행하시면 됩니다.



## 2.1.5 인증/인가 모듈 실행

모든 설정이 끝났으면 인증/인가 모듈이 실행 가능합니다.<br/>  node_modules를 설치합니다.
smartcity_back 폴더 기준<br/>
`npm i`<br/>

인증/인가 모듈을 사용할 때 키쌍이 필요합니다.
### 키쌍 생성
`node ./keys/initKey.js` <br/>
keys 디렉토리에 있는 initKey를 실행할 경우 인증/인가 모듈에 필요한 키쌍이 keys 폴더에 생성됩니다.

pm2를 사용할 경우 인증/인가 모듈을 더욱 효과적으로 관리 할 수 있습니다.

인증/인가 모듈을 pm2를 이용하여 node js 프로세스를 관리할 경우 인증/인가 모듈 서버에 이상이 생겼다가 복구될 경우 자동으로 실행시켜주며

cluster라는 기능을 이용하여 16개의 프로세스를 동시에 지원가능하게 만들어줍니다.

### pm2 설치

위에서 설치한 npm을 이용하여 전역으로 pm2를 설치합니다.

`sudo -su root`

`npm install pm2 -g`

pm2가 설치 완료되면 pm2를 이용하여 인증/인가 모듈을 실행합니다.

인증/인가 모듈을 실행시키기 전

`sudo -su root`

명령어를 통하여 관리자 계정으로 전환합니다.

smartcity_back 폴더로 경로를 이동 후 다음 명령어를 실행합니다.

`pm2 start ./bin/www`

```bash
[root@localhost smarcity_back]# pm2 start ./bin/www
[PM2] Starting /home/user/citydatahub_security/smarcity_back/bin/www in fork_mode (1 instance)
[PM2] Done.
```

`pm2 list` 명령어를 입력할 경우 현재 실행 중인 프로세스의 목록이 출력됩니다.



![2 pm2_execute](https://user-images.githubusercontent.com/42496861/162934048-4bf659c9-130d-4026-939f-d3b4ac6118e5.png)

