import React from "react";
import "../stylesheets/login.css";
import { PROGRAM_TYPE } from "../config";

const bottomMenu = () => {
  return (
    <ul className="menu__list">
      <li className="menu__item">
        <a
          className="menu__link"
          href="/"
          onClick={() => {
            // if(!opener){
            let popupX = window.screen.width / 2 - 685 / 2;
            let popupY = window.screen.height / 2 - 730 / 2;
            window.open(
              "findInfo/searchUserId",
              "findId",
              "width=685, height=730, left=" + popupX + ", top=" + popupY
            );
            // }
            //  else window.location.href = '/accounts/searchId';
          }}
        >
          아이디찾기
        </a>
      </li>

      <li className="menu__item">
        <a
          className="menu__link"
          href="/"
          onClick={() => {
            // if(!opener){
            let popupX = window.screen.width / 2 - 685 / 2;
            let popupY = window.screen.height / 2 - 730 / 2;
            window.open(
              "/findInfo/searchUserPassword",
              "findId",
              "width=685, height=730, left=" + popupX + ", top=" + popupY
            );
            // }
            // else window.location.href = '/findInfo/searchUserPassword';
          }}
        >
          비밀번호찾기
        </a>
      </li>

      {PROGRAM_TYPE === "admin" ? (
        ""
      ) : (
        <li className="menu__item">
          <a className="menu__link" href="/signup/joinMemberStep1">
            회원가입
          </a>
        </li>
      )}
    </ul>
  );
};
export default bottomMenu;
