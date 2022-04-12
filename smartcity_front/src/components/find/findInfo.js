import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import notFound from '../error/notFound';
import searchUserId from './searchUserId';
import searchUserPassword from './searchUserPassword';
import verifyEmailCode from './verifyEmailCode';
import searchUserIdResult from './searchUserIdResult';
import index from '../signup/joinAgreement';
//import registerAppRes from './registerAppResult';

const findInfo = ({match})=>{
    console.log(match.url);
    return(
        <Router >
            <Switch>
                <Route exact path={match.url} component={notFound}/>
                <Route path={`${match.url}/searchUserId`} component={searchUserId}/>
                <Route path={`${match.url}/searchUserPassword`} component={searchUserPassword}/>
                <Route path={`${match.url}/verifyEmailCode`} component={verifyEmailCode}/>
                <Route path={`${match.url}/searchUserIdResult/:userId`} component={searchUserIdResult}/>
                
            </Switch>
        </Router>
    )
}
export default findInfo;