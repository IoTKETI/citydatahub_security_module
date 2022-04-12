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
            appId:this.props.match.params.application_id_pk
        };
        this.checkAppName = this.checkAppName.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.checkUri = this.checkUri.bind(this);
        this.submit = this.submit.bind(this);
    }
    
    getAppInfo = ()=>{
        let token = cookie.load('chaut');

        $.ajax({
            url : '../../security/applications/'+ this.state.appId,
            type:'GET',
            beforeSend : (xhr)=>{
                xhr.setRequestHeader("Authorization",'Basic '+ token);
            },
            async:false,
            success : (res)=>{
                this.setState({
                    appName:res.applicationName,
                    uri: res.redirectUri
                })
            },
            error:(res)=>{
                alert('오류가 발생했습니다. 잠시 후 시도해주세요.');
            }
        })
    }
    componentWillMount(){
        this.setState({token:cookie.load('chaut')});
        this.getAppInfo();
    }
    
    checkAppName(e){
        var target = e.target;
        var msg = this.refs.appNameMsg;
        var style = this.refs.appNameMsg.style;
        if(!reg.appNameReg.test(target.value)){
            msg.innerText = '2~30자 이내의 완성형 한글 혹은 영문 소문자만 사용할 수 있습니다.';
            style.cssText = 'color:red';
            this.setState({checkAppName:false});
        }
        else{
            style.cssText = 'display:none';
            this.setState({
                appName : target.value,
                checkAppName:true
            });
        }
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
    changeContent(e){
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    submit(e){
        if(this.state.checkAppName || this.state.checkUri){
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
                url : '../..//security/applications/'+this.state.appId,
                type : 'PATCH',
                data : {
                    applicationName : this.state.appName,
                    redirectUri : this.state.uri
                },
                beforeSend : (xhr)=>{
                    xhr.setRequestHeader("Authorization",'Bearer '+token);
                },
                async:false,
                success : (res)=>{
                    alert('어플리케이션의 정보를 수정하였습니다.')
                },
                error : (res)=>{
                    alert('어플리케이션 수정에 실패했습니다.');
                }
            })
        }
        else{
            alert('형식이 유효하지 않습니다.')
        }
    }
    render(){
        const{changeContent,checkAppName, checkUri, submit} = this;
        if(!this.state.requestResult){
            return(
                <Fragment>
                <Helmet>
                <title>Smartcity Hub Registration</title>
                </Helmet>
                <div className="join__wrap">
                    <div className="join__inner">
                        <header className="join__header">
                            <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>어플리케이션 수정</h1>
                        </header>
                        <main className="join__main">
                            <div className="join__form">
                                <fieldset>
                                    <div className="join__row">
                                        <label for="applicationName" className="join__label">어플리케이션 이름</label>
                                        <input id="applicationName" className="join__input input" type="text" name='appName'  value={this.state.appName} onChange ={changeContent} onBlur={checkAppName} required/>
                                        <div className="warning_msg" id="applicationNameMsg" ref='appNameMsg' style={{display:'none'}}></div>
                                    </div>
                                    <div className="join__row">
                                        <label for="redirectUri" className="join__label">리다이렉션 URI</label>
                                        <input id="redirectUri" className="join__input input" type="text" name='uri' value={this.state.uri} onChange ={changeContent} onBlur={checkUri} required/>
                                        <div className="warning_msg" id="redirectUriMsg" ref='uriMsg' style={{display:'none'}}></div>
                                    </div>
                                    <div className="join__bottom">
                                        <a className="button button__primary" type="button" onClick={submit} href='/'>변경하기</a>
                                        <a className="button button__primary" type="button" style={{ backgroundColor: '#e52b50'}} href='/index'>돌아가기</a>
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