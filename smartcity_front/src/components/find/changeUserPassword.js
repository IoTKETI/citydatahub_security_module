import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import queryString from 'query-string';
import Footer from '../../components/footer';
import InvalidEmailCode from '../error/invalidEmailCode';
import Complete from './changePasswordComplete';
import cookie from 'react-cookies';
import _ from 'lodash';
import $ from 'jquery';
import reg from '../../regExp';

class changeUserPassword extends Component{
    constructor(props){
        super(props);
        this.state={
            pwd1 : null,
            pwd2 : null,
            result : null,
            userId: this.props.match.params.userId

        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.debouncedHandler = _.debounce(this.debouncedHandler.bind(this), 300);
        this.submit = this.submit.bind(this);

    }


    debouncedHandler(t){
        if(t.name === 'password1'){
            if(!t.value){
                this.setState({pwd1:null});
                this.refs.pwdMsg1.innerHTML = '필수 정보입니다.';
                this.refs.pwdMsg1.style.cssText = 'color:red';
            }
            else if(!reg.userPwdReg.test(t.value)){
                this.setState({pwd1:null});
                this.refs.pwdMsg1.innerHTML = '알파벳, 숫자 및 특수문자(!@#$%^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.';
                this.refs.pwdMsg1.style.cssText = 'color:red';
            }
            else {
                this.setState({pwd1:t.value});
                this.refs.pwdMsg1.style.cssText = 'display:none';
            }
        }
        else if(t.name === 'password2'){
            if(!t.value){
                this.setState({pwd2:null});
                this.refs.pwdMsg2.innerHTML = '필수 정보입니다.';
                this.refs.pwdMsg2.style.cssText = 'color:red';
            }
            else if(t.value != this.refs.password.value){
                this.setState({pwd2:null});
                this.refs.pwdMsg2.innerHTML = '비밀번호가 일치하지 않습니다.';
                this.refs.pwdMsg2.style.cssText = 'color:red';
            }
            else {
                this.setState({pwd2:t.value});
                this.refs.pwdMsg2.style.cssText = 'display:none';
            }
        }
    }
  
    onChangeHandler(e){
        this.debouncedHandler(e.target);
    }
    
    submit(e){
        var token = cookie.load('chaut');
        e.preventDefault();
        if(this.state.pwd1 && this.state.pwd2){
            let email = queryString.parse(window.location.search).email;
            let verifyCode = queryString.parse(window.location.search).verifyCode;
            $.ajax({
                url:"/security/changePwd/"+this.state.userId,
                type:"PATCH",
                data : {
                    
                    userPwd : this.state.pwd1
                    
                },
                async: false,
                beforeSend : (xhr)=>{
                    xhr.setRequestHeader("Authorization",'Basic '+ token);
                },
                statusCode : {
                    200 : (res)=>{
                        this.setState({
                            result : 200
                        })
                    },
                    400: ()=>{
                        this.setState({
                            result : 400
                        })
                    },
                    404: ()=>{
                        this.setState({
                            result : 404
                        })
                    },
                    500 : ()=>{
                        alert('일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
                    }
                }
            })
        }
    }

    render(){
        const {onChangeHandler, submit} = this;
        if(this.state.result === 400 || this.state.result ===404)
            return <InvalidEmailCode/>
        else if(this.state.result ===200){
            return <Complete/>
        }
        else{
            return(
                <Fragment>
                    <Helmet>
                        <title> 비밀번호 재설정 | 스마트 시티</title>                  
                    </Helmet>
                    <div className="join__wrap">
                        <div className="join__inner">
                        <header className="join__header">
                            <span className="join__title--top">CITY DATA HUB</span>
                            <h1 id="changePwdTitle" className="join__title">비밀번호 재설정</h1>
                            <br/>
                            <h3>비밀번호를 15분내로 설정해주세요.</h3>
                        </header>
                        <main className="join__main">
                            {/* <div> */}
                                <div className="join__row">
                                    <label className="join__label" style={{marginTop:'15px'}}> 변경할 비밀번호
                                        <input className="join__input input" type="password" name="password1" ref='password' onChange={onChangeHandler} required/>
                                    </label>
                                    <div className="warning_msg" ref="pwdMsg1" style={{display: 'none'}}/>
                                </div>
                                <div className="join__row">
                                    <label className="join__label" style={{marginTop:'15px'}}> 비밀번호 재입력
                                        <input className="join__input input" type="password" name="password2" onChange={onChangeHandler} required/>
                                    </label>
                                    <div className="warning_msg" ref="pwdMsg2" style={{display: 'none'}}/>   
                                </div>
                            {/* </div> */}
                            {/* <div id="changePwdResult" style={{display: 'none'}}> 별도의 페이지로 
                                <p id="changeUserPwdResult" className="join__result-text"><span className="join__result-text--emphasis">비밀번호가 성공적으로 <br/>변경되었습니다.</span></p>
                            </div> */}
                            <div className="join__bottom">
                                <a id="changePwdConfirm" className="button button__primary" onClick={submit} href="#">확인</a>
                                <a id="cancel" className="button button__outline--primary"  href="/">취소</a>
                            </div>
                            
                            <Footer/>
                        </main>
                        </div>
                    </div>
                </Fragment>
            )
        }
    }
}
export default changeUserPassword;