/*
MIT License

Copyright (c) 2017 gwiazdorrr

     

Permission is hereby granted, free of charge, to any person obtaining a copy

of this software and associated documentation files (the "Software"), to deal

in the Software without restriction, including without limitation the rights

to use, copy, modify, merge, publish, distribute, sublicense, and/or sell

copies of the Software, and to permit persons to whom the Software is

furnished to do so, subject to the following conditions:

     

The above copyright notice and this permission notice shall be included in all

copies or substantial portions of the Software.

     

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR

IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE

AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER

LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,

OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE

SOFTWARE.
*/

import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'



import Main from './components/main';
import Index from './components/Index';
import Regist from './components/info/registerApp';
import Result from './components/info/registerAppResult'


import NotFound from './components/error/notFound';
import myAppList from './components/info/myAppList';
import sysUserList from './components/admin/Admin_list';
import normalUserlist from './components/admin/User_list';
import DatahubList from './components/admin/Datahub_list';
import Role from './components/admin/Role';
import SignUp from './components/signup/signup';
import FindInfo from './components/find/findInfo';
import addRole from './components/info/registerRole';
import appModify from './components/info/modifyApp';

import userInfo from './components/info/userInfo';
import changePassword from './components/find/changeUserPassword';



class App extends Component{
  render(){
    return(
    <Router>
      <Switch>
        <Route exact path='/' component={Main}/>
        <Route exact path='/index' component={Index}/>
        <Route path='/apps/regist' component={Regist}/>
        <Route path= '/apps/list' component={myAppList}/>
        <Route path='/apps/regist_result' component={Result}/>
        <Route path='/accounts/sysUsers' component= {sysUserList}/>
        <Route path='/accounts/Users' component={normalUserlist}/>
        <Route path='/accounts/roles' component={Role}/>
        <Route path='/accounts/roleRegistration' component={addRole}/>
        <Route path='/apps/sysClients' component={DatahubList}/>
        <Route path='/users' component={userInfo}/>
        <Route path='/changePwd/:userId' component={changePassword}/>
        <Route path='/apps/modify/:application_id_pk' component={appModify}/>
        <Route path='/findInfo' component={FindInfo}/>
        <Route path='/signup' component={SignUp}/>
        <Route path='*' to="/" component={NotFound}/>
      </Switch>
    </Router>
    );
  }
}


export default App;
