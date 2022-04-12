import React,{Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import $ from 'jquery'

//import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import '../stylesheets/login.css';


class loginForm extends Component{
    constructor(){
        super();
        this.state={
            nickname:'',
            redirect:false
        }
    }
    handleClickEvent=(event)=>{

        
        $.ajax({
            url : '/security/login',
            type: 'POST',
            data:{
                grant_type : "password",
                loginId: document.getElementById('loginId').value,
                loginPwd: document.getElementById('loginPwd').value
            },
            async:false,
        }).then(function(response){
            this.setState({nickname: response.user.nickname,redirect:true})
        })
        
    
    }   
    render(){
        
        return(
            <Router>
            <form className="login__form">
                <fieldset className="login__fieldset">
                 <legend>로그인 정보 입력</legend> 
                    <label className="label__lgoin"><span className="hidden">아이디</span><input className="input__login" id="loginId" type="text" autoCapitalize="off" autoComplete="off" placeholder="아이디" autoFocus required/></label>
                    <label className="label__lgoin"><span className="hidden">비밀번호</span><input className="input__login" id="loginPwd" type="password" autoCapitalize="off" placeholder="비밀번호" autoComplete="off" required/></label> 
                    

                   
                    <button className="button__login" type="submit" onClick={this.handleClickEvent}>로그인</button>
                    
                    <div>{this.state.nickname}</div>
                
                </fieldset>
            </form>
            </Router>
        )
}
}


export default loginForm;