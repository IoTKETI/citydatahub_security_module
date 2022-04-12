import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../../components/footer';

class changePasswordComplete extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Fragment>
                <Helmet>
                    <title> 비밀번호 재설정 | 스마트 시티</title>
                </Helmet>
                <div className="join__wrap">
                    <div className="join__inner">
                        <header className="join__header">
                            <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span> 비밀번호가 변경되었습니다.</h1>
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
}
export default changePasswordComplete;

