import React, { Fragment } from 'react';
import {Helmet} from "react-helmet";
import Footer from '../../components/footer';
import '../../stylesheets/login.css'
import '../../stylesheets/dhsec.css'

function invalidEmailCode(){
    return(
        <Fragment>
        <Helmet>
            <title>유효하지 않은 인증코드 | 스마트 시티</title>
        </Helmet>
            <div className="join__wrap">
                <div className="join__inner">
                    <header className="join__header">
                        <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>유효하지 않은 인증코드입니다.</h1>
                    </header>
                    <main>
                        <div className="join__bottom">
                            <a id="joinConfirm" className="button button__primary" onClick={()=>{window.close()}} href="/">닫기</a>
                        </div>
                    <Footer/>
                    </main>
                </div>
            </div>
        </Fragment>
    )
}
export default invalidEmailCode;