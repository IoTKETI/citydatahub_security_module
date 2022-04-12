import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer';

// import '../../stylesheets/login.css';
// import '../../stylesheets/dhsec.css';

class agreement extends Component{
    constructor(props){
        super(props);
        this.agreementConfirm = this.agreementConfirm.bind(this);
    }
    agreementConfirm(e){
        var termsService = this.refs.agree1.checked;
        var termsPrivacy = this.refs.agree2.checked;
        var agreeMsg = this.refs.agreeMsg.style;
        if(termsService && termsPrivacy){
            window.location.href = '/signup/joinMemberStep2?termsService=on&termsPrivacy=on';
        }
        else{
            agreeMsg.cssText = 'color:red';
        }
    }
    render(){
        const {agreementConfirm} = this;
        return(
            <Fragment>
            <Helmet>
                <title>회원가입 - 약관동의 | 스마트 시티</title>
            </Helmet> 
            <div className="join__wrap">
                <div className="join__inner">
                    <header className="join__header">
                        <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>회원가입</h1>
                        <ul className="join__process-list">
                        <li className="join__process-item is-current"><span className="join__process-text--step material-icons">step1</span><span className="join__process-text">약관동의</span></li>
                        <li className="join__process-item"><span className="join__process-text--step material-icons">step2</span><span className="join__process-text">개인정보입력</span></li>
                        <li className="join__process-item"><span className="join__process-text--step material-icons">step3</span><span className="join__process-text">가입완료</span></li>
                        </ul>
                    </header>
                    <main className="join__main">
                        <h2 className="hidden">회원가입 본문</h2>
                        <div className="join__form">
                            <fieldset>
                                <legend>약관 동의 서식</legend>
                                <div className="join__terms">
                                    <h3 className="hidden">이용약관</h3>
                                    <div className="join__terms-scroll-box textarea">
                                        여러분을 환영합니다.<br/>
                                        <br/>
                                        스마트시티 도시데이터허브 서비스 및 제품(이하 ‘서비스’)을 이용해 주셔서 감사합니다. 본 약관은 다양한 도시데이터 서비스의 이용과 관련하여 도시데이터 서비스를 제공하는 스마트시티플랫폼과 이를 이용하는 회원(이하 ‘회원’) 또는 비회원과의 관계를 설명하며, 아울러 여러분의 도시데이터 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다.
                                    </div>
                                    <input id="joinAgree1" className="join__terms-checkbox checkbox" ref='agree1' type="checkbox"/><label htmlFor="joinAgree1" className="join__terms-label label__checkbox material-icons">이용약관 동의<span className="join__terms-label--required">(필수)</span></label>
                                </div>
                                <div className="join__terms">
                                    <h3 className="hidden">개인정보취급방침</h3>
                                    <div className="join__terms-scroll-box textarea">
                                        정보통신망법 규정에 따라 스마트시티 도시데이터허브 서비스에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                                    </div>
                                    <input id="joinAgree2" className="join__terms-checkbox checkbox" ref='agree2' type="checkbox"/><label htmlFor="joinAgree2" className="join__terms-label label__checkbox material-icons">개인정보 수집 및 이용안내<span className="join__terms-label--required">(필수)</span></label>
                                    <div className="warning_msg" ref="agreeMsg" style={{display:'none'}}> 이용약관 및 개인정보 수집 및 이용안내를 모두 동의해주세요.</div>
                                </div>
                                <div className="join__bottom">
                                    <button className="button button__primary" onClick={agreementConfirm}>확인</button>
                                    <a className="button button__outline--primary" href="/">취소</a>
                                </div>
                            </fieldset>
                        </div>
                        <Footer/>
                    </main>
                </div>
            </div>
            </Fragment>
        )
    }
}
export default agreement;