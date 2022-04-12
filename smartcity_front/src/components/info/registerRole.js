import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../footer';
import reg from '../../regExp';
import cookie from 'react-cookies';
import $ from 'jquery';
import RegisterResult from './registerAppResult';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';


class registerApp extends Component{
    constructor(props){
        super(props)
        this.state={
            appName : '',
            uri : '',
            checkAppName : false,
            checkUri : false,
            requestResult : null,
            token :'',
            Role:''
        };
        this.checkAppName = this.checkAppName.bind(this);
        this.checkUri = this.checkUri.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentWillMount(){
        this.setState({token:cookie.load('chaut')});
    }

    checkAppName(e){
        var target = e.target;
        var msg = this.refs.appNameMsg;
        var style = this.refs.appNameMsg.style;
        // if(!reg.roleReg.test(target.value)){
        //     msg.innerText = '2~30자 이내의 완성형 한글 혹은 영문 소문자만 사용할 수 있습니다.';
        //     style.cssText = 'color:red';
        //     this.setState({checkAppName:false});
        // }
        // else{
        //     style.cssText = 'display:none';
        //     this.setState({
        //         appName : target.value,
        //         checkAppName:true
        //     });
        // }
    }
    checkUri(e){
        var target = e.target;
        var msg = this.refs.uriMsg;
        var style = this.refs.uriMsg.style;
        if(!reg.urlReg.test(target.value)){
            msg.innerText = '주소 형식이 유효하지 않습니다.';
            style.cssText = 'color:red';
            this.setState({checkUri:false});
        }
        else {
            style.cssText = 'display:none';
            //style.cssText='display:none';
            this.setState({
                uri : target.value,
                checkUri:true
            });
        }
    }
    checkRole(e){
        this.setState({
            Role:e.target.value
        })
    }
    submit(e){
        if(this.state.checkAppName && this.state.checkUri){
            if(!cookie.load('chaut')){
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
            let token = cookie.load('chaut');
            $.ajax({
                url : '/security/applications',
                type : 'POST',
                data : {
                    applicationName : this.state.appName,
                    redirectUri : this.state.uri
                },
                beforeSend : (xhr)=>{
                    xhr.setRequestHeader("Authorization",'Bearer '+token);
                },
                async:false,
                success : (res)=>{
                    console.log('success');
                    this.setState({
                        requestResult : res
                    })
                },
                error : (res)=>{
                    alert('어플리케이션 등록에 실패했습니다.');
                }
            })
        }
    }
    render(){
        const{checkAppName, checkUri, submit} = this;
        if(!this.state.requestResult){
            return(
                <Fragment>
                <Helmet>
                <title>Smartcity Hub Registration</title>
                </Helmet>
                <div className="join__wrap">
                    <div className="join__inner">
                        <header className="join__header">
                            <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>권한정보 추가</h1>
                        </header>
                        <main className="join__main">
                        <div className="join__row">
                                 <label htmlFor="role" >권한</label>
                                 <select value={this.state.Role} onChange={this.checkRole.bind(this)}  className="join__row">
                                  
                                 <option value="select">권한 타입 선택</option>
                                 
                                 <option value="admin">admin</option>
                                 <option value="general">general</option>
                                 <option value="system">system</option>
                                 
                                 </select>
                                 
                             </div>
                            <div className="join__form">
                                <fieldset>
                                    <div className="join__row">
                                        <label for="applicationName" className="join__label">권한 이름</label>
                                        <input id="applicationName" className="join__input input" type="text" name='applicationName' onBlur={checkAppName} required/>
                                        <div className="warning_msg" id="applicationNameMsg" ref='appNameMsg' style={{display:'none'}}></div>
                                    </div>
                                    <div className="join__row">
                                        <label for="redirectUri" className="join__label">권한 설명</label>
                                        <input id="redirectUri" className="join__input input" type="text" name='redirectUri'  required/>
                                        <div className="warning_msg" id="redirectUriMsg" ref='uriMsg' style={{display:'none'}}></div>
                                    </div>
                                    <div className="join__bottom">
                                        <a className="button button__primary" type="button" onClick={submit} href='#'>추가</a>
                                        <a className="button button__primary" type="button" style={{ backgroundColor: '#e52b50'}} href='/index'>취소</a>
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
        else{
            return(
            <RegisterResult appInfo={this.state.requestResult}/>
            
            )
        }
    }
}
export default registerApp;