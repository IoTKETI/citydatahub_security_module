import React, { Component,Fragment} from 'react';
import {Helmet} from "react-helmet";
import {Link,Redirect} from 'react-router-dom';
import $ from 'jquery';
// import {observer, inject} from 'mobx-react';
import Admin from './admin';
import Normal from './normal';
import Footer from './footer';

import cookie from 'react-cookies';

import '../stylesheets/login.css';
import '../stylesheets/dhsec.css';



class Index extends Component{
    constructor(props){
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
        super(props);
        this.state={
            a_token:cookie.load('chaut'),
            r_token:cookie.load('refresh'),
            userId: cookie.load('userId'),
            userInfo:''
        }

    }
    
    componentWillMount(){
        
        
        
        if(!this.state.r_token){
            return(
            <Redirect to='/'/>
            )
        }
        if(cookie.load('chaut')){
        var user;
        $.ajax({
            type:'GET',
            url:'/security/users/'+this.state.userId,
            headers:{
              Authorization:'Bearer '+ this.state.a_token
            },
            async:false,
            success: function(result){
              
              user = result;
                            
            },
            error : function(err)
            {
              alert('failed');
            }
          })
          this.setState({userInfo:user});
        }
    }
   
//    function Index(props){
    logout(e){

        const data={
            userId : cookie.load('userId')
        }
        const header = cookie.load('chaut');
        $.ajax({
            type:'POST',
            url:'/security/logout',
            data:data,
            headers:{
                Authorization:'Bearer '+ header
            },
            async:false,
            
            success:function(result){
                cookie.remove('chaut');
                cookie.remove('refresh');
                cookie.remove('userId');
                return (<Redirect to ='/'/>)    
            },
            error : function(err)
            {
                
                alert('failed');
            }
            
        })
    }
    
    render(){
        return(
            <Fragment>
                <Helmet>
                    <title>Smartcity Hub</title>
                </Helmet>
                
                    <div className="join__wrap">
                        <div className="join__inner">
                            <header className="join__header">
                                <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>환영합니다</h1>
                            </header>
                            <main className="join__main">
                                <div className="join__result material-icons">
                                    <p className="join__result-text"><span className="join__result-text--emphasis">{this.state.userInfo.nickname}</span></p>
                                </div>
                                
                                {/* <div className="index__button">
                                        <a className="button button__outline--primary" href=" ">내 정보 보기</a>
                                </div> */}
                                <Link to ='/users'>
                                <button className="button__index"  onClick={this.myInfo}>내 정보 보기</button>
                                </Link>
                                {(this.state.userInfo.role==='System_Admin')? <Admin/>:<Normal/>}                                
                                <Link to ='/'>
                                <button className="button__index"  onClick={this.logout}>로그아웃</button>
                                </Link>
                                <Footer/>
                            </main>
                        </div>
                    </div>
            </Fragment>
        )
        
        // return(
        //     <Fragment>
        //         <Helmet>
        //             <title>Smartcity Hub</title>
        //         </Helmet>
                
        //             <div className="join__wrap">
        //                 <div className="join__inner">
        //                     <header className="join__header">
        //                         <h1 className="join__title"><span className="join__title--top">CITY HUB</span>환영합니다</h1>
        //                     </header>
        //                     <main className="join__main">
        //                         <div className="join__result material-icons">
        //                             <p className="join__result-text"><span className="join__result-text--emphasis">{this.state.userInfo.nickname}</span></p>
        //                         </div>
                                
        //                         <div className="index__button">
        //                                 <a className="button button__outline--primary" href=" ">내 정보 보기</a>
        //                         </div>
                                
        //                         <div className="index__button">
        //                             <a className="button button__outline--primary" href=" ">어플리케이션 등록</a>
        //                         </div>
        //                         {/* <button className="index__button">
        //                             <a className="button button__outline--primary" href="/ ">내 어플리케이션 정보 보기</a>
        //                         </button> */}
        //                         <button className="button__index"  onClick={this.ClickEvent}>내 어플리케이션 정보 보기</button>
        //                         {/* <div className="index__button">
                                    
        //                             <a className="button button__outline--primary"  >로그아웃</a>
                                    
        //                         </div> */}
        //                         <Link to ='/'>
        //                         <button className="button__index"  onClick={this.logout}>로그아웃</button>
        //                         </Link>
        //                     </main>
        //                 </div>
        //             </div>
        //     </Fragment>
        // )
    }
}

export default Index;