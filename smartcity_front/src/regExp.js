module.exports = {
    urlReg : /^(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/,
    charCntReg : /(\w)\1\1/,
    userIdReg : /^[A-Za-z0-9]{5,20}$/,
    userNicknameReg : /^[A-za-z0-9가-힣]{3,20}$/,
    userPwdReg : /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,30}/,
    userNameReg : /^[a-z가-힣]{2,10}$/,
    userEmailReg : /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    userEmailNoAtReg : /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*$/i,
    userPhoneReg : /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})?[0-9]{3,4}?[0-9]{4}$/,
    appNameReg : /^[a-z가-힣1-9]{2,30}$/,
    roleReg:/^[A-Za-z [$@$!_%*?&]]{5,20}$/
}
