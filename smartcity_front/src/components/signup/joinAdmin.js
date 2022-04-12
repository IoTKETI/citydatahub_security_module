import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../footer';
import queryString from 'query-string';
import WrongAccess from '../error/wrongAccess';
import _ from 'lodash';
import cookie from 'react-cookies';
import reg from '../../regExp';
import $ from 'jquery';
import Complete from './joinAdminComplete';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';

class joinMember extends Component{
    constructor(props){
        super(props);
        this.state={
            roleList:[
                
                    
            ],
            inspect : {
                role:false,
                userId : false,
                nickname: false,
                password : false,
                name : false,
                email : false,
                phone : false
            },
            role:'',
            userId : '',
            nickname: '',
            password : '',
            name : '',
            email : '',
            phone : '',
            result : false
        };
        //this.changeContent = this.changeContent.bind(this);
        this.requester = this.requester.bind(this);
        
        this.checkUserId = _.debounce(this.checkUserId.bind(this),300);
        this.checkNickname = _.debounce(this.checkNickname.bind(this),300);
        this.checkPassword = _.debounce(this.checkPassword.bind(this),300);
        this.checkName = _.debounce(this.checkName.bind(this),300);
        this.checkEmail = _.debounce(this.checkEmail.bind(this),300);
        this.checkPhone = _.debounce(this.checkPhone.bind(this),300);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.submit = this.submit.bind(this);

    }
    componentWillMount(){
        var token = cookie.load('chaut');
        const termsServiceValue = queryString.parse(window.location.search).termsService =='on'? true : false;
        const termsPrivacyValue = queryString.parse(window.location.search).termsPrivacy =='on'? true : false;
        this.setState({
            termsService : termsServiceValue,
            termsPrivacy : termsPrivacyValue
        })
        $.ajax({
            url : '/accounts/roles',
            type : 'GET',
            beforeSend : (xhr)=>{
                xhr.setRequestHeader("Authorization",'Basic '+ token);
            },
            
            success : (res)=>{
                
                console.log(res.roles.rows);
                this.setState({
                    roleList : res.roles.rows
                })
               
            },
            error : (res)=>{
                alert('오류가 발생했습니다 잠시 후 시도해주세요.');
            }
        })
    }

    onChangeHandler(e){
        e.persist();
        if(e.target.name=='role'){
            this.checkRole(e);
        }
        if(e.target.name =='userId'){
            this.checkUserId(e);
        }
        else if(e.target.name =='nickname'){
            this.checkNickname(e);
        }
        else if(e.target.name =='password'){
            this.checkPassword(e);
        }
        else if(e.target.name =='passwordConfirm'){
            this.checkPassword(e);
        }
        else if(e.target.name =='name'){
            this.checkName(e);
        }
        else if(e.target.name =='email'){
            this.checkEmail(e);
        }
        else if(e.target.name =='phone'){
            this.checkPhone(e);
        }
    }

    requester(dataType, val, msg, style, cb){
        $.ajax({
            url:"/security/checkInfo",
            type:"GET",
            data : {
                type : dataType,
                value : val
            },
            statusCode : {
                200 : (res)=>{
                    if(!res){
                        style.cssText = 'display: none';
                        cb(null);
                    }
                    else {
                        msg.innerText = '이미 사용 중입니다.';
                        style.cssText = 'color: red';
                        cb(true);
                    }
                },
                400 : ()=>{
                    alert('잘못된 요청입니다.');
                    cb(true);
                },
                500 : ()=>{
                    alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                    cb(true);
                }
            },
        })
    }
    
    checkRole(e){
        this.setState({
            Role:e.target.value
        })
    }
    checkUserId(e){
        var input = e.target;
        var msg = this.refs.userIdMsg;
        var style = this.refs.userIdMsg.style;

        if(input.value ==''){
            msg.innerText = "필수 입력 정보 입니다.";
            style.cssText = "color:red";
        }
        else{
            if(reg.charCntReg.test(input.value)){
                msg.innerText = "같은 문자나 숫자를 3회 이상 반복하여 사용할 수 없습니다.";
                style.cssText = "color:red";
                this.setState({
                    inspect :{
                        ...this.state.inspect,
                        userId : false
                    }
                })
            }
            else if(!reg.userIdReg.test(input.value)){
                msg.innerText = '5~20자 이내의 영문 대소문자 및 숫자를 사용할 수 있습니다.';
                style.cssText = "color:red";
                this.setState({
                    inspect :{
                        ...this.state.inspect,
                        userId : false
                    }
                })
            }
            else{
                this.requester('userId', input.value,msg,style,(err)=>{
                    if(err){
                        this.setState({
                            inspect :{
                                ...this.state.inspect,
                                userId : false
                            }
                        })
                    }
                    else{
                        this.setState({
                            userId : input.value,
                            inspect :{
                                ...this.state.inspect,
                                userId : true
                            }
                        })
                    }
                })
            }
        }
    }

    checkNickname(e){
        var input = e.target;
        var msg = this.refs.nicknameMsg;
        var style = this.refs.nicknameMsg.style;
        
        if(input.value ==''){
            msg.innerText = '필수 입력 정보 입니다.';
            style.cssText = 'color: red';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    nickname : false
                }
            });
        }
        else{
            if(reg.charCntReg.test(input.value)){
                msg.innerText = '같은 문자나 숫자를 3회 이상 반복하여 사용할 수 없습니다.';
                style.cssText = 'color: red';
                this.setState({
                    inspect : {
                        ...this.state.inspect,
                        nickname : false
                    }
                });
            }
            else if(!reg.userNicknameReg.test(input.value)){
                msg.innerText = '3~20자 이내의 완성형 한글 혹은 영문 대소문자 및 숫자를 사용하세요.';
                style.cssText = 'color: red';
                this.setState({
                    inspect : {
                        ...this.state.inspect,
                        nickname : false
                    }
                });
            }
            else this.requester('userNickname', input.value, msg, style,(err)=>{
                if(err){
                    this.setState({
                        inspect : {
                            ...this.state.inspect,
                            nickname : false
                        }
                    });
                }
                else{
                    this.setState({
                        nickname : input.value,
                        inspect : {
                            ...this.state.inspect,
                            nickname : true
                        }
                    });
                }
            });
        }
    }
    checkPassword(e){
        let t = e.target;
        if(t.name == 'password'){
            this.setState({
                    inspect : { 
                        ...this.state.inspect,
                        password : false
                    }
            });
            if(!t.value){
                //this.setState({pwd1:null});
                this.refs.pwdMsg1.innerHTML = '필수 정보입니다.';
                this.refs.pwdMsg1.style.cssText = 'color:red';
            }
            else if(!reg.userPwdReg.test(t.value)){
                //this.setState({pwd1:null});
                this.refs.pwdMsg1.innerHTML = '알파벳, 숫자 및 특수문자(!@#$%^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.';
                this.refs.pwdMsg1.style.cssText = 'color:red';
            }
            else {
                //this.setState({pwd1:t.value});
                this.setState({
                    password : t.value,
                    inspect : { 
                        ...this.state.inspect,
                        password : true
                    }
                });
                this.refs.pwdMsg1.style.cssText = 'display:none';
            }
        }
        else if(t.name == 'passwordConfirm'){
            this.setState({
                inspect : { 
                    ...this.state.inspect,
                    password : false
                }
            });
            if(!t.value){
                this.refs.pwdMsg2.innerHTML = '필수 정보입니다.';
                this.refs.pwdMsg2.style.cssText = 'color:red';
            }
            else if(t.value != this.refs.passwordInput1.value){
                this.refs.pwdMsg2.innerHTML = '비밀번호가 일치하지 않습니다.';
                this.refs.pwdMsg2.style.cssText = 'color:red';
            }
            else {
                this.refs.pwdMsg2.style.cssText = 'display:none';
                this.setState({
                    password : t.value,
                    inspect : { 
                        ...this.state.inspect,
                        password : true
                    }
                });
            }
        }

        
    }

    checkName(e){
        var input = e.target;
        var msg = this.refs.nameMsg;
        var style = this.refs.nameMsg.style;

        if(input.value==''){
            msg.innerText = '필수 입력 정보입니다.';
            style.cssText = 'color:red';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    name : false
                }
            });
        }
        else if(!reg.userNameReg.test(input.value)){
            msg.innerText = '2~10자 이내의 완성형 한글 혹은 영문 소문자를 사용할 수 있습니다.';
            style.cssText = 'color:red';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    name : false
                }
            });
        }
        else{
            style.cssText = 'display : none';
            this.setState({
                name : input.value,
                inspect : {
                    ...this.state.inspect,
                    name : true
                }
            });
        }
    }
    checkEmail(e){
        var input = e.target;
        var msg = this.refs.emailMsg;
        var style = this.refs.emailMsg.style;

        if(input.value==''){
            msg.innerText='필수 입력 정보입니다.'
            style.cssText='color:red';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    email : false
                }
            });
        }
        else{
            if(!reg.userEmailReg.test(input.value)){
                msg.innerText = '이메일 형식에 맞지 않아 사용할 수 없는 이메일 주소입니다.';
                style.cssText = 'color:red';
                this.setState({
                    inspect : {
                        ...this.state.inspect,
                        email : false
                    }
                });
            }
            else{
                this.requester('userEmail', input.value, msg, style,(err)=>{
                    if(err){
                        this.setState({
                            inspect : {
                                ...this.state.inspect,
                                email : false
                            }
                        });
                    }
                    else{
                        this.setState({
                            email : input.value,
                            inspect : {
                                ...this.state.inspect,
                                email : true
                            }
                        });
                    }

                })
            }
        }
    }
    checkPhone(e){
        var input = e.target;
        var msg = this.refs.phoneMsg;
        var style = this.refs.phoneMsg.style;
        
        if(input.value ==''){
            msg.innerText = '필수 입력 정보입니다.';
            style.cssText='color:red';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    phone : false
                }
            });
        }
        else{
            if(!reg.userPhoneReg.test(input.value)){
                msg.innerText = '-를 제외한 숫자 11자리를 입력해주세요.';
                style.cssText='color:red';
                this.setState({
                    inspect : {
                        ...this.state.inspect,
                        phone : false
                    }
                });
            }
            else{
                this.requester('userPhone', input.value, msg, style, (err)=>{
                    if(err){
                        this.setState({
                            inspect : {
                                ...this.state.inspect,
                                phone : false
                            }
                        });
                    }
                    else{
                        this.setState({
                            phone : input.value,
                            inspect : {
                                ...this.state.inspect,
                                phone : true
                            }
                        });
                    } 
                })
            }
        }
    }
    submit(){
        var v = this.state.inspect;
        if(v.userId && v.nickname && v.password & v.name & v.email & v.phone){
            $.ajax({
                url:"/security/Users",
                type:"POST",
                data : {
                    userId : this.state.userId,
                    userNickname : this.state.nickname,
                    userPwd : this.state.password,
                    userName : this.state.name,
                    userEmail : this.state.email,
                    userPhone : this.state.phone,
                    userRole: this.state.Role
                },
                statusCode : {
                    200 : (res)=>{

                        this.setState({
                            result : true
                        })
                    },
                    409 : ()=>{
                        alert('같은 정보를 가진 회원이 존재합니다. 잠시 후 다시 시도해주세요.');
                        window.location.reload();
                    },
                    500 : ()=>{
                        alert('일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
                        window.location.reload();
                    }
                },
            })
        }
    }
    render(){
        var rolelist = this.state.roleList;
        const {onChangeHandler, checkUserId, checkNickname, checkPassword, checkName, checkEmail, checkPhone, submit } = this;
        if(this.state.result){
            return <Complete/>
        }
        
            return(
                <Fragment>
                <Helmet>
                    <title>회원가입 - 개인정보입력 | 스마트 시티</title>
                </Helmet>

                <div className="join__wrap">
                    <div className="join__inner">
                    <header className="join__header">
                        <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>회원가입</h1>
                        <ul className="join__process-list">
                        
                        <li className="join__process-item is-current"><span className="join__process-text--step material-icons">step1</span><span className="join__process-text">개인정보입력</span></li>
                        <li className="join__process-item"><span className="join__process-text--step material-icons">step2</span><span className="join__process-text">가입완료</span></li>
                        </ul>
                    </header>
                    <main className="join__main">
                        <h2 className="hidden">회원가입 본문</h2>
                        <fieldset>
                            <legend>회원가입 서식</legend>
                            
                             <div className="join__row">

                                 <label htmlFor="role" className="join__label">권한</label>

                                 <select value={this.state.Role} onChange={this.checkRole.bind(this)}  className="join__row">

                                  

                                 <option value="select">권한 선택</option>

                                 {Object.keys(rolelist).map((key,i)=>{

                                     return(

                                     <option value = {rolelist[key].role_id_pk}>{rolelist[key].role_name}</option>

                                     )

                                 })}

                                

                                 </select>

                                 

                             </div>


                            <div className="join__row">
                                <label htmlFor="userId" className="join__label">아이디</label>
                                <input id="userId" className="join__input input" type="input" name="userId"  onChange={onChangeHandler} required/>
                                <div className="warning_msg" id="userIdMsg" ref='userIdMsg' style={{display:'none'}}></div>
                            </div>
                            <div className="join__row">
                                <label htmlFor="userNickname" className="join__label">닉네임</label>
                                <input id="userNickname" className="join__input input" type="text" name="nickname" onChange={onChangeHandler} required/>
                                <div className="warning_msg" id="userNicknameMsg" ref='nicknameMsg' style={{display:'none'}}></div>
                            </div>
                            <div className="join__row">
                                <label htmlFor="userPwd" className="join__label">패스워드</label>
                                <input id="userPwd" className="join__input input" type="password" ref='passwordInput1' name="password" onChange={onChangeHandler} required/>
                                <div className="pwdMsg" id="userPwdMsg" ref='pwdMsg1' style={{display:'none'}}></div>
                            </div>
                            <div className="join__row">
                                <label htmlFor="userPwdConfirm" className="join__label">패스워드 확인</label>
                                <input id="userPwdConfirm" className="join__input input" type="password" ref='passwordInput2' name="passwordConfirm" onChange={onChangeHandler} required/>
                                <div className="pwdMsg" ref='pwdMsg2' style={{display:'none'}}></div>
                            </div>
                            <div className="join__row">
                                <label htmlFor="userName" className="join__label">이름</label>
                                <input id="userName" className="join__input input" type="input" name="name" onChange={onChangeHandler} required/>
                                <div className="warning_msg" id="userNameMsg" ref='nameMsg' style={{display:'none'}}></div>
                            </div>
                            <div className="join__row">
                                <label htmlFor="userEmail" className="join__label">이메일</label>
                                <input id="userEmail" className="join__input input" type="email" name="email" onChange={onChangeHandler} required/>
                        
                                <div className="warning_msg" id="userEmailMsg" ref='emailMsg' style={{display:'none'}}></div>
                            </div>
                            <div className="join__row">
                                <label htmlFor="userPhone" className="join__label">휴대폰 번호</label>
                                <input id="userPhone" className="join__input input" type="text" name="phone" onChange={onChangeHandler} required/>
                                <div className="warning_msg" id="userPhoneMsg" ref='phoneMsg' style={{display:'none'}}></div>
                            </div>
                            <div className="warning_msg" id="joinUserMsg" style={{color: 'red', marginTop: '30px'}}></div>
                            <div className="join__bottom">
                                <button id="joinConfirm" className="button button__primary" onClick={submit}>회원가입</button>
                                <a className="button button__outline--primary" href="/">취소</a>
                                
                            </div>
                        </fieldset>
                        <Footer/>
                    </main>
                    </div>
                </div>
                </Fragment>
            )
        
        
    }
}
export default joinMember;
