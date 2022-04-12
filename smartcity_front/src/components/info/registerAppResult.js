import React, {Component, Fragment} from 'react';
import {Helmet} from 'react-helmet';
import Footer from '../footer';

import '../../stylesheets/login.css';
import '../../stylesheets/dhsec.css';

class registerAppResult extends Component{
     
    render(){   
        return(
            <Fragment>
            <Helmet>
                <title>Smartcity Hub Registration Result</title>
            </Helmet>
            <div className="join__wrap">
                <div className="join__inner">
                    <header className="join__header">
                        <h1 className="join__title"><span className="join__title--top">CITY DATA HUB</span>어플리케이션 등록 완료</h1>
                    </header>
                    <main className="join__main">
                            <p className="join__result-text" style={{fontSize: '20px'}} ><span className="join__result-text--emphasis">Application ID : </span>
                                <br/>
                                <span style={{fontSize:'15px'}}>{this.props.appInfo.appId}</span>
                            </p>
                            <br/>
                            <p className="join__result-text" style={{fontSize: '20px'}} ><span className="join__result-text--emphasis">Application SECRET : </span>
                                <br/>
                                <span style={{fontSize:'15px'}}>{this.props.appInfo.appSec}</span>
                            </p>
                            <div className="join__bottom">
                                <a id="joinConfirm" className="button button__primary" href="/index">확인</a>
                            </div>
                    </main>
                    <Footer/>
                </div>
            </div>
            </Fragment>
        )
    }
}
export default registerAppResult;