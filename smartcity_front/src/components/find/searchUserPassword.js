import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import Footer from "../../components/footer";
import reg from "../../regExp";
import _ from "lodash";
import $ from "jquery";

class searchUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      email: null,
      result: null,
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.debouncedHandler = _.debounce(this.debouncedHandler.bind(this), 200);
    this.submit = this.submit.bind(this);
  }

  debouncedHandler(t) {
    if (t.name === "id") {
      if (reg.charCntReg.test(t.value) || !reg.userIdReg.test(t.value)) {
        this.setState({ id: null });
        this.refs.idMsg.innerHTML = "잘못된 형식의 아이디입니다.";
        this.refs.idMsg.style.cssText = "color : red";
      } else {
        this.setState({ id: t.value });
        this.refs.idMsg.style.cssText = "display : none";
      }
    } else if (t.name === "email") {
      if (!reg.userEmailReg.test(t.value)) {
        this.setState({ email: null });
        this.refs.emailMsg.innerHTML = "잘못된 형식의 이메일입니다.";
        this.refs.emailMsg.style.cssText = "color : red";
      } else {
        this.setState({ email: t.value });
        this.refs.emailMsg.style.cssText = "display : none";
      }
    }
  }

  onChangeHandler(e) {
    this.debouncedHandler(e.target);
  }

  submit(e) {
    //e.preventDefault();
    if (this.state.id != null && this.state.email != null) {
      $.ajax({
        url: "/accounts/searchPwd",
        type: "POST",
        data: {
          userId: this.state.id,
          userEmail: this.state.email,
        },
        async: false,
        statusCode: {
          200: () => {
            alert("입력하신 이메일로 인증 메일이 발송되었습니다.");
            window.close();
          },
          400: () => {
            alert("잘못된 요청입니다.");
            window.location.reload();
          },
          404: () => {
            alert("입력한 정보의 회원이 존재하지 않습니다.");
            window.location.reload();
          },
          500: () => {
            alert("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
            window.location.reload();
          },
        },
      });
    }
  }
  render() {
    const { onChangeHandler, submit } = this;
    return (
      <Fragment>
        <Helmet>
          <title>정보 찾기 - 비밀번호 찾기 | 스마트 시티</title>
        </Helmet>
        <div className="join__wrap">
          <div className="join__inner">
            <header className="join__header">
              <span className="join__title--top">CITY DATA HUB</span>
              <h1 id="findPwdTitle" className="join__title">
                비밀번호 찾기
              </h1>
            </header>
            <main className="login" style={{ marginTop: "-70px" }}>
              <div id="findPwdInput" style={{ display: "inline" }}>
                <div className="join__row">
                  <label className="join__label">
                    <input type="radio" defaultChecked={true} /> 이메일로 찾기
                  </label>
                  <label className="join__label" style={{ marginTop: "15px" }}>
                    {" "}
                    아이디
                    <input
                      id="findPwdIdInput"
                      className="join__input input"
                      name="id"
                      placeholder=" 사용자 아이디"
                      onChange={onChangeHandler}
                      required
                    />
                  </label>
                  <div
                    className="warning_msg"
                    ref="idMsg"
                    style={{ display: "none" }}
                  />
                  <label className="join__label" style={{ marginTop: "10px" }}>
                    {" "}
                    이메일 주소
                    <input
                      id="findPwdEmailInput"
                      className="join__input input"
                      type="email"
                      name="email"
                      placeholder=" example@example.com"
                      onChange={onChangeHandler}
                      required
                    />
                  </label>
                  <div
                    className="warning_msg"
                    ref="emailMsg"
                    style={{ display: "none" }}
                  />
                </div>
                {/* sms를 통한 인증 미지원
                                <div className="join__row">
                                    <label for="findUserPhone" className="join__label">
                                        <input type="radio" id="findUserPhone" name="method" value="phone"/> 휴대폰으로 찾기
                                    </label>
                                    <input id="findUserPhoneInput" className="join__input input" type="text" name="phone" placeholder="-을 빼고 입력하세요 예)01012341234" required>
                                </div> */}
              </div>
              {/* <div id="findPwdResult" style={{display: 'none'}}>
                                <p id="findPwdResult" className="join__result-text"><span className="join__result-text--emphasis">인증 메일이 성공적으로 <br/>발송되었습니다.</span></p>
                            </div> */}
              <div className="join__bottom">
                <a
                  id="findPwdConfirm"
                  className="button button__primary"
                  onClick={submit}
                  href="#"
                >
                  확인
                </a>
              </div>
              {/* <li className="menu__item"><a className="menu__link" href="#none" onClick="showFindId();">아이디 찾기</a></li> */}
              <a
                style={{ textAlign: "left", marginLeft: "-5px" }}
                className="menu__link"
                href="searchUserId"
              >
                아이디 찾기
              </a>
              <Footer />
            </main>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default searchUserPassword;
