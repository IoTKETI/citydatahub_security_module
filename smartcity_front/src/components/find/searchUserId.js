import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer';
import {Redirect,Route} from 'react-router-dom';
import reg from '../../regExp';
import _ from 'lodash';
import $ from 'jquery';
import Result from './searchUserIdResult';
import cookie from 'react-cookies';

class searchUserId extends Component{
    constructor(props){
        super(props);
        this.state={
            method : 'email',
            input : '',
            inspect : false,
            result : null
        }
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.debouncedHandler = _.debounce(this.debouncedHandler.bind(this), 300);
        this.submit = this.submit.bind(this);
    }
    debouncedHandler(t){        
        if(t.name == 'email'){
            if(!reg.userEmailReg.test(t.value)){
                this.refs.emailMsg.innerHTML = '잘못된 형식의 이메일 주소입니다.';
                this.refs.emailMsg.style.cssText = 'color : red';
                this.setState({
                    inspect : false
                })
            }
            else {
                this.refs.emailMsg.style.cssText = 'display : none';
                this.setState({
                    inspect : true,
                    input : t.value
                })
            }
        }
        else if(t.name == 'phone'){
            if(!reg.userPhoneReg.test(t.value)){
                this.refs.phoneMsg.innerHTML = '잘못된 형식의 휴대폰 번호입니다.';
                this.refs.phoneMsg.style.cssText = 'color : red';
                this.setState({
                    inspect : false
                })
            }
            else {
                this.refs.phoneMsg.style.cssText = 'display : none';
                this.setState({
                    inspect : true,
                    input : t.value
                })
            }
        }
    }
    onClickHandler(e){
        this.setState({
            method : e.target.value,
            inspect : false
        })
    }
    onChangeHandler(e){
        this.debouncedHandler(e.target);
    }

    submit(){
        if(this.state.inspect){
            $.ajax({
                url:"/accounts/searchId",
                type:"POST",
                data : {
                    method : this.state.method,
                    value : this.state.input
                },
                async: false,
                statusCode : {
                    200 : (res)=>{
                        this.setState({
                            result : res
                        })
                        
                        //cookie.save
                        return(
                            // <Result result={res}/>
                            <Redirect to='../findInfo/searchUserIdResult' result={res}/>
                        )
                    },
                    404: ()=>{
                        alert('입력한 정보의 회원이 존재하지 않습니다.');
                        window.location.reload();
                    },
                    500 : ()=>{
                        alert('일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
                        window.location.reload();
                    }
                }
            })
        }
    }
    render(){
        const { onChangeHandler, onClickHandler, submit} = this;
        if(this.state.result){
            //  return <Result result={this.state.result}/>
            return <Redirect to={`../findInfo/searchUserIdResult/${this.state.result}`}/>
         }
         else{
            return(
                <Fragment>
                    <Helmet>
                        <title>정보 찾기 - 아이디 찾기 | 스마트 시티</title>
                    </Helmet>
                    <div className="join__wrap">
                        <div className="join__inner">
                            <header className="join__header">
                                <span className="join__title--top">CITY DATA HUB</span>
                                <h1 id="findIdTitle" className="join__title">아이디 찾기</h1>
                            </header>
                            <main className="login">
                                <div id="findIdInput" style={{display: 'inline'}}>
                                    <div className="join__row">
                                        <label htmlFor="findUserEmail" className="join__label">
                                            <input type="radio" id="findUserEmail" name="method" value="email" onChange={onClickHandler} defaultChecked={true}/> 이메일 주소로 찾기
                                        </label>
                                        {this.state.method == 'email'? 
                                        (<div style={{width: '100%'}}><input id="findUserEmailInput" className="join__input input" type="text" name="email" placeholder=" 예) example@example.com" onChange={onChangeHandler} required/>
                                        <div className="warning_msg" ref="emailMsg" style={{display:'none'}}></div></div>)
                                        : null}
                                    </div>
                                    <div className="join__row">
                                        <label htmlFor="findUserPhone" className="join__label">
                                            <input type="radio" id="findUserPhone" name="method" value="phone" onChange={onClickHandler}/> 휴대폰 번호로 찾기
                                        </label>
                                        {this.state.method == 'phone'?
                                        (<div style={{width: '100%'}}><input id="findUserPhoneInput" className="join__input input" type="text" name="phone" placeholder=" -을 빼고 입력하세요 예) 01012341234" onChange={onChangeHandler} required/>
                                        <div className="warning_msg" ref="phoneMsg" style={{display:'none'}}></div></div>)
                                        : null}
                                    </div>
                                </div>
                                <div id="findIdResult" style={{display: 'none'}}>
                                    <p id="userIdResult" className="join__result-text"><span className="join__result-text--emphasis"></span></p>
                                </div>
                                <div className="join__bottom">
                                    
                                    <a id="findIdConfirm" className="button button__primary" onClick={submit}>확인</a>
                                </div>
                                <a style={{textAlign:'left', marginLeft:'-5px'}} className="menu__link" >비밀번호 찾기</a>
                                <Footer/>
                            </main>
                        </div>
                    </div>
                </Fragment>
            )
             }
    }
}
export default searchUserId;