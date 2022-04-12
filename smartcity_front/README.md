# 2.2 Frontend 설치

인증/인가 모듈의 Frontend는 인증/인가 모듈의 API를 이용하기 위한 GUI입니다.

React로 구현되있으며 2.1 Backend 설치에서 node 및 Npm을 설치하셨으면 무리 없이 설치가 가능합니다.



## 2.2.1 Node_modules 설치

설치를 진행하기 전 관리자 계정으로 변경합니다.

`sudo -su root`

프론트엔드의 디렉토리로 이동합니다.

`cd citydatahub_security/smartcity_front`

npm을 이용하여 필요한 노드모듈을 설치합니다. 이 때 리액트도 자동으로 설치됩니다.

`npm install`

프론트엔드를 원하는 포트에서 실행하기 위해 package.json의 수정이 필요합니다.

package.json의 "scripts" 의 "start" 부분을 수정합니다.

기존

```json
"scripts":{
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
}
```



30001번 포트에서 구동할 경우

```
"scripts":{
    "start": "export PORT=30001 && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
}
```



설정이 완료되었으면 2.1 Backend 설치 과정에서 설치된 pm2를 이용하여 실행합니다.

`sudo -su root`

`pm2 start npm -- start`



예시의 경우 http://localhost:30001 로 접속하여 정상 구동을 확인합니다.



<img width="429" alt="1 Frontend" src="https://user-images.githubusercontent.com/42496861/162933041-7fe9c3e4-980e-421d-8117-75ecbb1a11d9.png">



## 2.2.2 관리자 비밀번호 변경

2.1 Backend 설치 과정을 하였으면 디폴트 관리자 계정인 admin 계정이 생성된 상태입니다.

admin 계정의 초기 비밀번호는 admin45@ 이므로 원하는 비밀번호로 변경하여 사용하시기 바랍니다.

프론트엔드를 이용하여 admin 계정으로 로그인합니다.

로그인 후 **내 정보 보기 버튼**을 클릭합니다.

<img width="389" alt="2 Myinfo" src="https://user-images.githubusercontent.com/42496861/162933070-b68a0f4d-01b4-4bad-80da-5718c19a79cc.png">



**비밀번호 변경** 버튼을 클릭하여 비밀번호 재설정 페이지로 이동하여 원하는 비밀번호로 설정합니다.



<img width="404" alt="3 password_modify" src="https://user-images.githubusercontent.com/42496861/162933133-896a223a-c809-4674-9a55-d04247d6f144.png">



