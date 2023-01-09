import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";

import "../stylesheets/login.css";
import "../stylesheets/dhsec.css";
import { PROGRAM_TYPE } from "../config";

// function admin(props){
class admin extends Component {
  render() {
    const programType = PROGRAM_TYPE;
    const callURL =
      programType === "admin" ? "/accounts/sysUsers" : "/accounts/Users";
    return (
      <Fragment>
        {/* <div className="index__button">
                     <a className="button button__outline--primary" href=" ">관리자 계정 관리</a>
                 </div>
                 <div className="index__button">
                     <a className="button button__outline--primary" href=" ">일반 사용자 계정 관리</a>
                 </div>
                 <div className="index__button">
                     <a className="button button__outline--primary" href=" ">권한정보 관리</a>
                 </div>
                 <div className="index__button">
                     <a className="button button__outline--primary" href=" ">데이터 허브 어플리케이션 관리</a>
                 </div>
                              
                <button className="button__index" >일반 어플리케이션 관리</button> */}
        <Link to={callURL}>
          {programType === "admin" ? (
            <button className="button__index">관리자 계정 관리</button>
          ) : (
            <button className="button__index">사용자 계정 관리</button>
          )}
        </Link>
        {/* <Link to='/accounts/Users'>
                <button className="button__index" >일반 사용자 계정 관리</button>
                </Link>  */}

        <Link to="/accounts/roles">
          <button className="button__index">권한정보 관리</button>
        </Link>

        <Link to="/apps/sysClients">
          <button className="button__index">
            데이터 허브 어플리케이션 관리
          </button>
        </Link>
      </Fragment>
    );
  }
}

// }

export default admin;
