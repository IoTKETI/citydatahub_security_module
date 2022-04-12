import React, { Component,Fragment} from 'react';

import { Link} from 'react-router-dom';



import '../stylesheets/login.css';
import '../stylesheets/dhsec.css';




    class normal extends Component{
       
        render(){
        return(
            <Fragment>
                <Link to='/apps/regist'>
                <button className="button__index" >어플리케이션 등록</button>
                </Link>

                <Link to='/apps/list'>    
                <button className="button__index" >내 어플리케이션 관리</button>                
                </Link>
                           
            </Fragment>
        );
        }
    }
    


export default normal;