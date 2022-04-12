import $ from 'jquery';

var userIdFlag = false;
var userNicknameFlag = false;
var userPwdFlag = false;
var userNameFlag = false;
var userEmailFlag = false;
var userPhoneFlag = false;
var appplicationNameFlag = false;
var redirectUriFlag = false;

const urlReg = /^(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/;
const charCntReg = /(\w)\1\1/;
var userIdReg = /^[A-Za-z0-9]{5,20}$/;
const userNicknameReg = /^[A-za-z0-9가-힣]{3,20}$/;
const userPwdReg = /^[A-Za-z0-9!@#$%^&*()-_=+]{8,30}$/;
const userNameReg = /^[a-z가-힣]{2,10}$/;
const userEmailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const userEmailNoAtReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*$/i;
const userPhoneReg = /^\d{3}\d{3,4}\d{4}$/;

function test(){
    this.alert('helloya');
}
function loadImage() {
    var width = 100;
    var height = $('.join__wrap').height();
    var left = 0;
    var top = 0;   
    //top = ( $(window).height() - height ) / 2 + $(window).scrollTop();
    //left = ( $(window).width() - width ) / 2 + $(window).scrollLeft();

    if($("#loadImage").length != 0) {
           $("#loadImage").css({
                  "top": top+"px",
                  "left": left+"px",
                  
           });
           $("#loadImage").show();
    }
    else {
        $(".join__wrap").attr("style","filter: blur(4px);");
        $('body').append('<div id="loadImage" style="position:absolute; top:' + top + 'px; left:' + left + 'px; width:' + width + '%; height:' + height+
        'px; background: rgb(61,61,61); opacity:0.6; z-index:100; margin:auto; padding:0; "><img src="http://164.125.68.145:30000/images/spinner.gif"'+
        ' style="width:75px; height:75px; display: block; margin: 300px auto"></div>');
    }
}

function agreementConfirm(){
    var termsService = $('#joinAgree1').is(':checked');
    var termsPrivacy = $('#joinAgree2').is(':checked');
    if(termsService && termsPrivacy){
        //window.location.href = "/signup/joinMemberStep2?termsService=on&termsPrivacy=on";
        this.location.href = "/signup/joinMemberStep2?termsService=on&termsPrivacy=on";
    }
    else {
        $("#agreeMsg").attr('style','color:red');
    }
}
function requester(dataId, msg){
    $.ajax({
        url:"/security/checkUserInfo",
        type:"GET",
        data : {
            type : dataId,
            value : $('#'+dataId).val()
        },
        statusCode : {
            200 : (res)=>{
                if(!res){
                    eval(dataId+'Flag=true;');
                    onMsg('#'+dataId+'Msg','','p');
                }
                else 
                    onMsg('#'+dataId+'Msg','이미 사용중인 '+msg+'입니다.','n');
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        },
    })
}

function checkUserId(){
    userIdFlag = false;
    if($('#userId').val()==''){
        onMsg('#userIdMsg','필수 입력 정보 입니다.','n');
    }
    else{
        if(charCntReg.test($('#userId').val())){
            onMsg('#userIdMsg','같은 문자나 숫자를 3회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!userIdReg.test($('#userId').val())){
            onMsg('#userIdMsg','5~20자 이내의 영문 대소문자 및 숫자를 사용할 수 있습니다.','n');
        }
        else{
            requester('userId','아이디');
        }
    }
}

function checkUserNickname(){
    userNicknameFlag = false;
    if($('#userNickname').val()==''){
        onMsg('#userNicknameMsg','필수 입력 정보 입니다.','n');
    }
    else {
        if(charCntReg.test($('#userNickname').val())){
            onMsg('#userNicknameMsg','같은 문자나 숫자를 3회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!userNicknameReg.test($('#userNickname').val())){
            onMsg('#userNicknameMsg','3~20자 이내의 완성형 한글 혹은 영문 대소문자 및 숫자를 사용할 수 있습니다.','n');
        }
        else{
            requester('userNickname','닉네임');
        }
    }
}

function checkUserPwd(){
    userPwdFlag = false;
    if($('#userPwd').val()==''){
        onMsg('.pwdMsg','','b');
        onMsg('#userPwdMsg','필수 입력 정보입니다.','n');
    }
    else if($('#userPwd').val()!=$('#userPwdConfirm').val()){
        onMsg('.pwdMsg','비밀번호가 일치하지 않습니다.','n');
    }
    else{
        if(userPwdReg.test($('#userPwd').val())){
            userPwdFlag = true;
            onMsg('.pwdMsg','','b');
        }
        else onMsg('.pwdMsg','알파벳, 숫자 및 특수문자(!@#$%^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.','n');
    }
    
}
function checkUserName(){
    userNameFlag = false;
    if($('#userName').val()==''){
        onMsg('#userNameMsg','필수 입력 정보 입니다.','n');
    }
    else{
        if(charCntReg.test($('#userName').val())){
            onMsg('#userNameMsg','같은 문자나 숫자를 3회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!userNameReg.test($('#userName').val())){
            onMsg('#userNameMsg','2~10자 이내의 완성형 한글 혹은 영문 소문자를 사용할 수 있습니다.','n');
        }
        else{
            userNameFlag = true;
            onMsg('#userNameMsg','','b');
        }
    }
}
function splitEmailId(){
    if($('#emailAddress').val()!='select' && $('emailAddress').val()!=''){
        if(($('#userEmail').val()).indexOf('@')>-1)
            $('#userEmail').val(($('#userEmail').val()).substring(0,($('#userEmail').val()).indexOf('@')));
    }
}

function checkUserEmail(){
    userEmailFlag = false;
    var emailAddress = $('#emailAddress').val();
    if($('#userEmail').val()==''){
        onMsg('#userEmailMsg','필수 입력 정보 입니다.','n');
    }
    else if(emailAddress==''){
        onMsg('#userEmailMsg','이메일 입력 방식을 선택해주세요.','n');
    }
    else{
        if(($('#userEmail').val()).indexOf('@')>-1 && emailAddress != 'select' && emailAddress != ''){
            $('#userEmail').val(($('#userEmail').val()).substring(0,($('#userEmail').val()).indexOf('@')));
        }
        if(emailAddress != '')
            $('#userEmail').val($('#userEmail').val()+$('#'+emailAddress).text());

        if(emailAddress =='select'){
            if(!userEmailReg.test($('#userEmail').val())){
                onMsg('#userEmailMsg','이메일 형식에 맞지 않아 사용할 수 없는 이메일 주소입니다.','n');
            }
            else {
                requester('userEmail','이메일');
            }
        }
        else{
            if(userEmailNoAtReg.test($('#userEmail').val().substring(0,($('#userEmail').val()).indexOf('@')))){
                requester('userEmail','이메일');
            }
            else {
                onMsg('#userEmailMsg','이메일 아이디만 입력해주세요.','n');
            }
        }
    }
}

function checkUserPhone(){
    userPhoneFlag = false;
    if($('#userPhone').val()==''){
        onMsg('#userPhoneMsg','필수 입력 정보 입니다.','n');
    }
    else{
        if(!userPhoneReg.test($('#userPhone').val())){
            onMsg('#userPhoneMsg','-를 제외한 숫자 11자리를 입력해주세요.','n');
        }
        else{
            requester('userPhone','휴대전화 번호');
        }
    }
}

function onMsg(id,msg,type){
    if (type == 'n'){
        var color = 'color:red';
    }
    else if(type =='p'){
        var color = 'display:none';
    }
    $(id).text(msg);
    $(id).attr('style',color);
}

function joinUser(){
    if(userIdFlag && userNicknameFlag && userPwdFlag && userNameFlag && userEmailFlag && userPhoneFlag){
        $.ajax({
            url:"/security/users",
            type:"POST",
            data : {
                userId : $('#userId').val(),
                userPwd : $('#userPwd').val(),
                userNickname : $('#userNickname').val(),
                userName : $('#userName').val(),
                userPhone : $('#userPhone').val(),
                userEmail : $('#userEmail').val()
            },
            success : ()=>{
                //location.href = "/signup/joinMemberStep3";
                this.location.href = "/signup/joinMemberStep3";
            },
            statusCode : {
                409 : ()=>{
                    alert('해당 정보를 가진 사용자가 존재합니다. 회원가입 정보를 다시 입력해주세요.');
                    //location.reload();
                    this.location.reload();
                },
                500 : ()=>{
                    alert('오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                }
            }
        })
    }
    else{
        $('#joinUserMsg').text('입력하신 정보를 확인해주세요.');
    }
}
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function changeUserInfo(){
    var info = new Object;
    
    if(userNicknameFlag)
        info.userNickname = $('#userNickname').val(); 
    if(userPwdFlag)
        info.userPwd = $('#userPwdConfirm').val();
    if(userEmailFlag)
        info.userEmail = $('#userEmail').val();
    if(userPhoneFlag)
        info.userPhone = $('#userPhone').val();
    if(Object.keys(info).length<1)
        return;

    $.ajax({
        url:"/security/changeUserInfo",
        type:"POST",
        data : info,
        statusCode : {
            200 : (res)=>{
                alert('정보를 성공적으로 수정했습니다.');
                //location.href = res;
                this.location.href = res;
            },
            400 : ()=>{
                return;
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        }
        })
}

function showFindId(){
    if(!this.opener){ //opener
        var popupX = (window.screen.width / 2) - (685 / 2);
        var popupY= (window.screen.height / 2) - (730 / 2);
        window.open("/login/findUserId", "findId", "width=685, height=730, left="+popupX+", top="+popupY);
    }
    else {
        //window.location.href = '/login/findUserId';
        this.location.href = '/login/findUserId';
    }
}

function showFindPwd(){
    if(!this.opener){ // opener
        var popupX = (window.screen.width / 2) - (685 / 2);
        var popupY= (window.screen.height / 2) - (730 / 2);
        window.open("/login/findUserPwd", "findPwd", "width=685, height=730, left="+popupX+", top="+popupY);
    }
    else{
        //window.location.href = '/login/findUserPwd';
        this.location.href = '/login/findUserPwd';
    }
}

function findUserId(){
    if($('#findUserEmail').is(':checked')){ //이메일로 아이디를 찾는 경우
        var regEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            if(!regEmail.test($('#findUserEmailInput').val())){
                onMsg('#findUserEmailMsg','이메일 형식이 올바르지 않습니다.','n');
                return;
            }
        var method = 'userEmail';
        var input = $('#findUserEmailInput').val();
    }
    else { //휴대폰 번호로 아이디를 찾는 경우
        var regPhone = /^\d{3}\d{3,4}\d{4}$/;
        if(!regPhone.test($('#findUserPhoneInput').val())){
            onMsg('#findUserPhoneMsg','-를 제외한 숫자 11자리를 입력해주세요.','n');
            return;
        }
        var method = 'userPhone';
        var input = $('#findUserPhoneInput').val();
    }

    $.ajax({
        url:"/security/findUserId",
        type:"POST",
        data : {
            method : method,
            value : input
        },
        statusCode : {
            204 : ()=>{
                $("#findResult").attr('style','display: inline');
                $("#userIdResult").text('해당 아이디가 존재하지 않습니다.');
                $("#findIdConfirm").attr('onclick','self.close()');
            },
            400 : ()=>{
                alert('비정상적인 접근입니다.');
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        },
            success : (res)=>{
                $("#findIdTitle").text("아이디 찾기 결과");
                $("#findIdInput").attr('style','display: none');
                $("#findIdResult").attr('style','display: inline');
                $("#userIdResult").text(res);
                $("#findIdConfirm").attr('onclick','self.close()');
            },
            error : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        })
}

function findUserPwd(){
    var flag = false;
    var reg1 = /^[A-za-z0-9]{5,20}$/g;
    var reg2 = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if($('#findPwdIdInput').val()==''){
        flag = true;
        onMsg('#findPwdIdMsg','필수 입력 정보입니다.','n');
    }
    else if(!reg1.test($('#findPwdIdInput').val())){
        onMsg('#findPwdIdMsg','5~20자 이내의 영문 대소문자 및 숫자를 사용할 수 있습니다.','n');
    }
    else{
        onMsg('#findPwdIdMsg','','p');
    }
    
    if(!reg2.test($('#findPwdEmailInput').val())){
        flag = true;
        onMsg('#findPwdEmailMsg','올바른 이메일을 입력해주세요.','n');
    }
    else onMsg('#findPwdEmailMsg','','p');
    
    if(flag)
        return;

    $.ajax({
        url:"/security/findUserPwd",
        type:"POST",
        data : {
            userId : $("#findPwdIdInput").val(),
            userEmail : $("#findPwdEmailInput").val()
        },
        beforeSend : ()=>{
            loadImage();
        },
        statusCode : {
            204 : ()=>{
                $("#findPwdResult").attr('style','display: inline');
                $("#findPwdResult").text('해당 정보의 계정이 존재하지 않습니다.');
                $("#findPwdConfirm").attr('onclick','self.close()');
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        },
        success : ()=>{
            $("#findPwdInput").attr('style','display: none');
            $("#findPwdResult").attr('style','display: inline');
            $("#findPwdConfirm").attr('onclick','self.close()');
            $("#div_ajax_load_image").hide();

        },
        complete : ()=>{
            $(".join__wrap").removeAttr('style');
            $("#loadImage").hide();
        }
        })
}

function changeUserPwd(){
    var params = getUrlParams();
    //var reg = /^.*(?=^.{8,30}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()-_+=]).*$/;
    var reg = /^[A-Za-z0-9!@#$%^&*()-_=+]{8,30}$/g;
    
    if($("#changePwd1").val() != $("#changePwd2").val()){
        onMsg('#userChangePwdMsg','비밀번호가 일치하지 않습니다. 확인해주세요.','n');
    }
    else if(!reg.test($('#changePwd1').val())){
        onMsg('#userChangePwdMsg','알파벳, 숫자 및 특수문자(!@#$%^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.','n');
    }
    else {
        onMsg('#userChangePwdMsg','','p');
        $.ajax({
            url:"/security/changeUserPassword",
            type : "POST",
            data : {
                userPwd : $("#changePwd1").val(),
                userPwdConfirm : $("#changePwd2").val(),
                userEmail : params.email,
                verifyCode : params.verifyCode
            },
            statusCode : {
                400 : ()=>{
                    alert('비정상적인 접근입니다.');
                },
                404 : ()=>{
                    $("#changePwdInput").attr('style','display: none');
                    $("#changeUserPwdResult").html("링크가 만료되었습니다.");
                    $("#changePwdResult").attr('style','display: inline');
                    $("#changePwdConfirm").attr('onclick',"location.href='/'");
                },
                500 : ()=>{
                    alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                }
            },
            success : ()=>{
                $("#changePwdInput").attr('style','display: none');
                $("#changePwdResult").attr('style','display: inline');
                $("#changePwdConfirm").attr('onclick',"location.href='/'");
            }
        })
    }
}

function showInputBox(id){
    onMsg('.warning_msg','','p');
    $('.join__input, .input').attr('style','display : none');
    $("#"+id+"Input").attr('style','display : inline');
}

function getUrlParams() {
    var params = {};
    //window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    this.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}

function passwordAuth(url){
    if($('#userPwd').val() ==''){
        $(".warning_msg").text('비밀번호를 입력해주세요.');
        $(".warning_msg").attr('style','color: red');
    }
    else{
        $.ajax({
            url : url,
            type : "POST",
            data : {
                loginPwd : $("#userPwd").val()
            },
            success : (res)=>{
                $("body").html(res);
            },
            error : ()=>{
                $(".warning_msg").text('비밀번호가 일치하지 않습니다.');
                $(".warning_msg").attr('style','color: red');
            }
        })
    }
}

function deleteApp(){
    function func(cb){
        var checkbox = $("input[name=checkBox]:checked");
        if(!checkbox.length)
            return this.location.href = '/';
            //location.href = '/';
        var tdArray = new Array();
        checkbox.each(function(i){
            var tr = checkbox.parent().parent().eq(i);
            var td = tr.children();
            var appId = (td.eq(2).text()).trim();
            tdArray.push(appId);
        });
        cb(tdArray);
    }

    func(function(array){
        $.ajax({
            url : '/security/deleteApp',
            type : "POST",
            traditional : true,
            data : {
                data : array
            },
            statusCode : {
                200 : function(){
                    alert('적용되었습니다.');
                    //location.href= '/';
                    this.location.href= '/';
                },
                500 : function(){
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                    //location.reload();
                    this.location.reload();
                }
            }
        });
    });
    
}

function allCheckBoxController(){
    if($('#allCheck').prop("checked"))
        $("input[type=checkBox]").prop("checked",true);
    else
        $("input[type=checkBox]").prop("checked",false);
}

function checkUrl(){
    redirectUriFlag = false;
    if(!urlReg.test($('#redirectUri').val()))
        onMsg('#redirectUriMsg','주소 형식이 유효하지 않습니다.','n') 
    else{ 
        redirectUriFlag = true;
        onMsg('#redirectUriMsg','','p') 
    }
}

function checkAppName(){
    appplicationNameFlag = false;
    if($('#applicationName').val()==''){
        onMsg('#applicationNameMsg','필수 입력 정보 입니다.','n');
    }
    else{
        var reg1 = /(\w)\1\1/;
        var reg2 = /^[a-z가-힣1-9]{2,10}$/g;
        if(reg1.test($('#applicationName').val())){
            onMsg('#applicationNameMsg','같은 문자나 숫자를 3회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!reg2.test($('#applicationName').val())){
            onMsg('#applicationNameMsg','2~10자 이내의 완성형 한글 혹은 영문 소문자를 사용할 수 있습니다.','n');
        }
        else{
            appplicationNameFlag = true;
            onMsg('#applicationNameMsg','','b');
        }
    }
}

function registerApp(){
    if(redirectUriFlag && appplicationNameFlag){
        $.ajax({
            url : "/registration_client",
            type : "POST",
            data : {
                applicationName : $("#applicationName").val(),
                redirectUri : $("#redirectUri").val()
            },
            success : (res)=>{
                $("body").html(res);
            },
            error : ()=>{
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        })
    }
    else return;
}