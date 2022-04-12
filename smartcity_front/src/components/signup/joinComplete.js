import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';

class joinComplete extends Component{
    
    render(){
        return(
          <Fragment>
            <Helmet>
              <title>회원가입 - 가입완료 | 스마트 시티</title>
            </Helmet>
            <div class="join__wrap">
              <div class="join__inner">
                <header class="join__header">
                  <h1 class="join__title"><span class="join__title--top">CITY DATA HUB</span>회원가입</h1>
                  <ul class="join__process-list">
                    <li class="join__process-item"><span class="join__process-text--step material-icons">step1</span><span class="join__process-text">약관동의</span></li>
                    <li class="join__process-item"><span class="join__process-text--step material-icons">step2</span><span class="join__process-text">개인정보입력</span></li>
                    <li class="join__process-item is-current"><span class="join__process-text--step material-icons">step3</span><span class="join__process-text">가입완료</span></li>
                  </ul>
                </header>
                <main class="join__main">
                  <h2 class="hidden">회원가입 본문</h2>
                  <p class="join__result-text"><span class="join__result-text--emphasis">회원가입</span>을 축하드립니다</p>
                  <div class="join__bottom">
                    <a class="button button__outline--primary" href="#none">메인화면 이동</a>
                    <a class="button button__outline--primary" href="/">로그인화면 이동</a>
                  </div>
                </main>
                <Footer/>
              </div>
            </div>
          </Fragment>
        )
    }
}
export default joinComplete;