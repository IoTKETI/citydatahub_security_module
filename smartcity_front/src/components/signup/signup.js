import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import agreement from './joinAgreement';
import joinMember from './joinMember';
import joinAdmin from './joinAdmin';
import notFound from '../error/notFound';
//import registerAppRes from './registerAppResult';

const signup = ({match})=>{
    console.log(match.url);
    return(
        <Router >
            <Switch>
                <Route exact path={match.url} component={notFound}/>
                <Route path={`${match.url}/joinMemberStep1`} component={agreement}/>
                <Route path={`${match.url}/joinMemberStep2`} component={joinMember}/>
                <Route path={`${match.url}/joinAdminStep1`} component={joinAdmin}/>
            </Switch>
        </Router>
    )
    
}
export default signup;