import React, { Component, Fragment } from 'react';
import {Redirect} from 'react-router-dom';
import Footer from './footer';
import Bottom from './bottomMenu';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';

import {Helmet} from "react-helmet";


class main extends Component{
  
  constructor(props){
    super(props);
    this.state={
      userId:'',
      error:false
    };
    
  
    
  }
  
  login(e){
    const expires=new Date()
    expires.setDate(expires.getDate()+18);
   
    const data={
      grant_type:'password',
      username: document.getElementById('loginId').value,
      password: document.getElementById('loginPwd').value
      
    }
    $.ajax({
      type:'POST',
      url:'/oauth2.0/token',
      data:data,
      headers:{
        Authorization:'Basic '+'M2VSb2Zocmw2d1BXYXVYMnUwR1Q6eUZ1OXN2amVKdkNZM1BMa2twRllGMUN2V283TWNMN0Y='
        
      },
      async:false,
      success: function(result){
        cookie.save('chaut',result.access_token,{expires,maxAge:3000});
        cookie.save('userId',data.username);
        cookie.save('refresh',result.refresh_token);
        return (<Redirect to ='/index'/>)
        
      },
      error : function(err)
      {
        alert("로그인에 실패하였습니다");
        this.setState(
          {
            error:true
          }
        )
        
      }
    })
    
    
  }
 
    
  render(){
    
    if(cookie.load('chaut')){
      return (
      <Redirect to={{pathname:'/index'}}/>)
      
    }
    else{
    return(
    
    <Fragment>
      <Helmet>
        <title>Smart City</title>
      </Helmet>
        <div className="login__wrap">
          <main className="login">
            <h1 className="login__title">City Data Hub<small className="login__title--small"> 아이디/비밀번호를 입력하세요.</small></h1>
            {/* <LoginForm/> */}
            <form className="login__form">
                <fieldset className="login__fieldset">
                 <legend>로그인 정보 입력</legend> 
                    <label className="label__lgoin"><span className="hidden">아이디</span><input className="input__login" id="loginId" type="text" autoCapitalize="off" autoComplete="off" placeholder="아이디" autoFocus required/></label>
                    <label className="label__lgoin"><span className="hidden">비밀번호</span><input className="input__login" id="loginPwd" type="password" autoCapitalize="off" placeholder="비밀번호" autoComplete="off" required/></label> 
                                    
                    <button className="button__login"  onClick={this.login}>로그인</button>
                    {(this.state.error)? <div>로그인에 실패했습니다.</div>:<div></div>}
                    
                
                </fieldset>
            </form>
            <Bottom/>
            <Footer/>
            </main>
           
        </div>
    </Fragment>
    
    
    );
    }
  }
}


export default main;
