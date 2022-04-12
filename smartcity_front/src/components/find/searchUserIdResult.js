import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer';
import cookie from 'react-cookies';

class searchUserIdResult extends Component{
    constructor(props){
        super(props);
        if(props){
         this.state={
              result: this.props.match.params.userId
         }
        }
       
    }

    
    
    render(){
        return(
            <Fragment>
                <Helmet>
                    <title>정보 찾기 - 아이디 찾기 | 스마트 시티</title>
                </Helmet>
                <div className="join__wrap">
                    <div className="join__inner">
                        <header className="join__header">
                            <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>아이디 찾기 결과</h1>
                        </header>
                        <main className="login">
                                <p className="join__result-text">
                                <span className="join__result-text--emphasis">{this.state.result}</span>
                                </p>
                                <div className="join__bottom">
                                    <a id="joinConfirm" className="button button__primary" onClick={()=>{window.close()}} href="#">닫기</a>
                                </div>
                                {/* <li className="menu__item"><a className="menu__link" href="#none" onClick="showFindPwd();">비밀번호찾기</a></li> */}
                                <a style={{textAlign:'left', marginLeft:'-5px'}} className="menu__link" href="searchUserPassword">비밀번호 찾기</a>
                            <Footer/>
                        </main>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default searchUserIdResult;

