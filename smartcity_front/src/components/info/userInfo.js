import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer';
import cookie from 'react-cookies';
import $ from 'jquery';
import reg from '../../regExp';
import {Link,Redirect} from 'react-router-dom';
//import _ from 'lodash';
//import container from './userInfoContainer';
//import { Throttle } from 'react-throttle';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';

class userInfo extends Component{
    constructor(props){
        super(props);
        this.state={
            inspect : {
                nickname : false,
                password : false,
                email : false,
                phone : false
            }
        };
        this.requester = this.requester.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.checkNickname = this.checkNickname.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkEmail = this.checkEmail.bind(this);
        this.checkPhone = this.checkPhone.bind(this);
        this.submit = this.submit.bind(this);
    }
    getUserInfo = ()=>{
        //토큰 없으면 튕구기
        let token = cookie.load('chaut');
        
        $.ajax({
            url : '/security/user',
            type : 'GET',
            beforeSend : (xhr)=>{
                xhr.setRequestHeader("Authorization",'Basic '+ token);
            },
            async:false,
            success : (res)=>{
                this.setState({
                    user : res, //original use object
                    nickname : res.nickname,
                    email : res.email,
                    phone : res.phone
                })
               
            },
            error : (res)=>{
                alert('오류가 발생했습니다 잠시 후 시도해주세요.');
            }
        })
    }
    componentWillMount(){
        window.jQuery = $;
        
        if(!cookie.load('chaut')){
            console.log('refresh_token');
            $.ajax({
                type:'POST',
                url:'/oauth2.0/token',
                data:{
                    grant_type:"refresh_token",
                    refresh_token:cookie.load('refresh')
                },
                headers:{
                    Authorization:'Basic '+'M2VSb2Zocmw2d1BXYXVYMnUwR1Q6eUZ1OXN2amVKdkNZM1BMa2twRllGMUN2V283TWNMN0Y='
                },
                async:false,
                success:function(result){
                    cookie.save('chaut',result.access_token,{maxAge:3000});
                }
            })
        }
        this.getUserInfo();
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
    changeContent(e){
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    checkNickname(e){
        var input = e.target;
        var msg = this.refs.nicknameMsg;
        var style = this.refs.nicknameMsg.style;
        
        if(input.value ==''){
            this.setState({
                nickname : this.state.user.nickname,
                inspect : {
                    ...this.state.inspect,
                    nickname : false
                }
            })
            style.cssText='display:none';
        }
        else if(input.value == this.state.user.nickname){
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    nickname : false
                }
            })
            style.cssText='display:none';
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
        var input1 = this.refs.passwordInput1.value;
        var input2 = this.refs.passwordInput2.value;

        //둘다 빈칸이면 수락
        if(input1=='' && input2==''){ //빈칸이면 리퀘스트에서 뺴는걸로..
            this.refs.passwordMsg1.innerText = '비밀번호를 변경하지 않습니다.';
            this.refs.passwordMsg1.style.cssText='color:blue';
            this.refs.passwordMsg2.innerText = '비밀번호를 변경하지 않습니다.';
            this.refs.passwordMsg2.style.cssText='color:blue';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    password : false
                }
            });
        }
        else if(input1 != input2){
            this.refs.passwordMsg1.style.cssText='color:red';
            this.refs.passwordMsg1.innerText = '비밀번호가 일치하지 않습니다.';
            this.refs.passwordMsg2.style.cssText='color:red';
            this.refs.passwordMsg2.innerText = '비밀번호가 일치하지 않습니다.';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    password : false
                }
            });
        }
        else{
            if(reg.userPwdReg.test(input1)){
                this.refs.passwordMsg1.style.cssText='display: none';
                this.refs.passwordMsg2.style.cssText='display: none';
                this.setState({
                    password : input1,
                    inspect : {
                        ...this.state.inspect,
                        password : true
                    }
                });
            }
            else {
                this.refs.passwordMsg1.style.cssText='color:red';
                this.refs.passwordMsg2.style.cssText='color:red';
                this.refs.passwordMsg1.innerText = '알파벳, 숫자 및 특수문자(!@#$%^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.';
                this.refs.passwordMsg2.innerText = '알파벳, 숫자 및 특수문자(!@#$%^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.';
                this.setState({
                    inspect : {
                        ...this.state.inspect,
                        password : false
                    }
                });
            }
        }
    }
   
    checkEmail(e){
        var input = e.target;
        var msg = this.refs.emailMsg;
        var style = this.refs.emailMsg.style;

        if(input.value == this.state.user.email){
            style.cssText='display:none';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    email : false
                }
            });
        }
        else if(input.value==''){
            style.cssText='display:none';
            this.setState({
                email : this.state.user.email
            })
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
        this.setState({
            inspect : {
                ...this.state.inspect,
                phone : true
            }
        });
        
        if(input.value == this.state.user.phone){
            style.cssText='display:none';
            this.setState({
                inspect : {
                    ...this.state.inspect,
                    phone : false
                }
            });
        }
        else if(input.value ==''){
            this.setState({
                phone : this.state.user.phone
            })
            style.cssText='display:none';
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
        //0개이면 반응안하게하기 // 아이디키
        var v = this.state.inspect;
        var str ='';
        var obj = new Object;
        Object.keys(v).map((key)=>{
            if(v[key]){
                str += key+' ';
                obj[key] = this.state[key];
            }
        })
        console.log(obj);
        if(Object.keys(obj).length){
            str = str.replace('nickname','닉네임').replace('password','비밀번호').replace('email','이메일').replace('phone','전화번호');
            
            if(window.confirm('다음과 같은 정보를 수정하시겠습니까?\n'+ str)){
                var token=cookie.load('chaut');
                $.ajax({
                    url:"/security/users/"+this.state.user.userId,
                    type:"PATCH",
                    data : obj,
                    beforeSend : (xhr)=>{
                        xhr.setRequestHeader("Authorization",'Basic '+ token);
                    },
                    statusCode : {
                        200 : (res)=>{
                            alert('정보를 성공적으로 수정했습니다');
                            window.location.href='/index';
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
        else{
            alert('수정된 정보가 없습니다.');
        }
        //정보 수정 창에 맨 밑에 멘트 추가하하기
    }
    render(){
        const {changeContent, checkNickname, checkPassword, checkEmail, checkPhone, submit } = this;
        return(
            <Fragment>
                <Helmet>
                <title>내 정보 - 내 정보 | 스마트 시티</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"/>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"/>
                </Helmet>
                    <div className="join__wrap">
                        <div className="join__inner">
                        {/* <input type="hidden" id="userNicknameOriginal" value={this.state.user.nickname}/>
                        <input type="hidden" id="userEmailOriginal" value={this.state.user.email}/>
                        <input type="hidden" id="userPhoneOriginal" value={this.state.user.phone}/> */}
                        <header className="join__header">
                            <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>내 정보 보기</h1>
                        </header>
                        <main className="join__main">
                            <h2 className="hidden">내 정보 보기 본문</h2>
                            <fieldset>
                                <legend>내 정보 보기 서식</legend>
                                <div className="join__row">
                                    <p className="join__label">아이디</p>
                                    <p id="userId" className="join__input input" type="input" name="userId" style={{fontSize: '20px'}} required>{this.state.user.userId}</p>
                                </div>
                                <div className="join__row">
                                    <p className="join__label">닉네임</p>
                                    <input id="userNickname" className="join__input input" type="text" name="nickname" style={{fontSize: '20px'}} value={this.state.nickname} onChange={changeContent} onBlur={checkNickname} required/>
                                    <p style={{fontSize:'15px'}}><div className="warning_msg" id="userNicknameMsg" ref='nicknameMsg' style={{display:'none'}}></div></p>
                                </div>
                                <div className="join__row">
                                    <p className="join__label">비밀번호 (비밀번호 변경시 재로그인이 필요합니다.)</p>
                                    <Link to={`/changePwd/${this.state.user.userId}`}>

                                    
                                    <button className="button button__password">비밀번호 변경</button>
                                    </Link>
                                   
                                    <div className="pwdMsg" id="userPwdMsg" ref='passwordMsg1' style={{display:'none'}}> 비밀번호가 일치하지 않습니다. </div>
                                </div>
                               
                                <div className="join__row">
                                    <p className="join__label">이름</p>
                                    <p id="userName" className="join__input input" type="input" name="name" style={{fontSize: '20px'}} required>{this.state.user.name}</p>
                                </div>
                                <div className="join__row">
                                    <p className="join__label">이메일</p>
                                    <input id="userEmail" className="join__input input" style={{fontSize: '20px'}} type="email" name="email" value={this.state.email} onChange={changeContent} onBlur={checkEmail} required/>
                               
                                    <div className="warning_msg" id="userEmailMsg" ref='emailMsg' style={{display:'none'}}></div>
                                </div>
                                <div className="join__row">
                                    <p className="join__label">휴대폰 번호</p>
                                    <input id="userPhone" className="join__input input" type="text" name="phone" style={{fontSize: '20px'}} value={this.state.phone} onChange={changeContent} onBlur={checkPhone} required/>
                                    <div className="warning_msg" id="userPhoneMsg" ref='phoneMsg' style={{display:'none'}}></div>
                                </div>
                                <div className="join__bottom">
                                    <a id="changeMyInfoConfirm" className="button button__primary" onClick={submit} href="#">변경하기</a>
                                    <a className="button button__outline--primary" href="/index">취소</a>
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

export default userInfo;