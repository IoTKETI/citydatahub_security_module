let userIdFlag = false;
let userNicknameFlag = false;
let userPwdFlag = false;
let userNameFlag = false;
let userEmailFlag = false;
let userPhoneFlag = false;

let charCntReg = /(\w)\1\1\1/; 
let userIdReg = /^[A-Za-z0-9_.]{5,20}$/;
let userNicknameReg = /^[A-za-z0-9가-힣]{3,20}$/;
let userPwdReg = /^(?=.*\d{1,30})(?=.*[~`!@#$%\^&*()-+_=]{1,30})(?=.*[a-zA-Z]{2,30}).{8,30}$/;
let userNameReg = /^[A-Za-z가-힣]{2,20}$/;
let userEmailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
let userPhoneReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})?[0-9]{3,4}?[0-9]{4}$/;

function agreementConfirm(){
    let termsService = $('#joinAgree1').is(':checked');
    let termsPrivacy = $('#joinAgree2').is(':checked');
    if(termsService && termsPrivacy)
        window.location.href = "/accounts/signup/joinMemberStep2?termsService=on&termsPrivacy=on";
    else 
        $("#agreeMsg").show();
}

function requester(dataId, msg){
    $.ajax({
        url:"/security/checkInfo",
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

function onMsg(id,msg,type){
    let color;
    if (type == 'n'){
        color = 'color:red';
    }
    else if(type =='p'){
        color = 'display:none';
    }
    $(id).text(msg);
    $(id).attr('style',color);
}

function checkUserId(){
    userIdFlag = false;
    if($('#userId').val()==''){
        onMsg('#userIdMsg','필수 입력 정보 입니다.','n');
    }
    else{
        if(charCntReg.test($('#userId').val())){
            onMsg('#userIdMsg','같은 문자나 숫자를 4회 이상 반복하여 사용할 수 없습니다.','n');
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
            onMsg('#userNicknameMsg','같은 문자나 숫자를 4회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!userNicknameReg.test($('#userNickname').val())){
            onMsg('#userNicknameMsg','3~20자 이내의 완성형 한글 혹은 영문 대소문자 및 숫자를 사용할 수 있습니다.','n');
        }
        else{
            requester('userNickname','닉네임');
        }
    }
}

function checkUserPwd(input){
    userPwdFlag = false;
    
    if(!input){
        if($('#userPwd').val()==''){
            onMsg('#userPwdMsg','필수 입력 정보입니다.','n');
        }
        else if(userPwdReg.test($('#userPwd').val())){
            if($('#userPwd').val() == $('#userPwdConfirm').val()){
                userPwdFlag = true;
                onMsg('.pwdMsg','','p');
            }
            else if($('#userPwdConfirm').val()!='' && $('#userPwd').val() != $('#userPwdConfirm').val()){
                onMsg('#userPwdMsg','','p');
                onMsg('#userPwdConfirmMsg','비밀번호가 일치하지 않습니다.','n');
            }
            else{
                onMsg('#userPwdMsg','','p');
            }
        }
        else onMsg('#userPwdMsg','알파벳, 숫자 및 특수문자(!@#$%\^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.','n');
    }
    else{
        if($('#userPwdConfirm').val()==''){
            if($('#userPwd').val()=='')
                onMsg('#userPwdConfirmMsg','','p');
            else
                onMsg('#userPwdConfirmMsg','필수 입력 정보입니다.','n');
        }
        else if($('#userPwd').val() != $('#userPwdConfirm').val()){            
            onMsg('#userPwdConfirmMsg','비밀번호가 일치하지 않습니다.','n');
        }
        else if(!userPwdReg.test($('#userPwd').val())){
            onMsg('#userPwdMsg','알파벳, 숫자 및 특수문자(!@#$%\^&*()-_=+)를 사용하여 8~30자리의 비밀번호를 입력하세요.','n');
            onMsg('#userPwdConfirmMsg','비밀번호가 일치하지 않습니다.','n');
        }
        else {
            userPwdFlag = true;
            onMsg('.pwdMsg','','p');
        }
    }
}

function checkUserName(){
    userNameFlag = false;
    if($('#userName').val()==''){
        onMsg('#userNameMsg','필수 입력 정보 입니다.','n');
    }
    else{
        if(charCntReg.test($('#userName').val())){
            onMsg('#userNameMsg','같은 문자나 숫자를 4회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!userNameReg.test($('#userName').val())){
            onMsg('#userNameMsg','2~10자 이내의 완성형 한글 혹은 영문 소문자를 사용할 수 있습니다.','n');
        }
        else{
            userNameFlag = true;
            onMsg('#userNameMsg','','p');
        }
    }
}

function checkUserEmail(){
    userEmailFlag = false;
    if($('#userEmail').val()==''){
        onMsg('#userEmailMsg','필수 입력 정보 입니다.','n');
    }
    else if(!userEmailReg.test($('#userEmail').val())){
        onMsg('#userEmailMsg','이메일 형식에 맞지 않습니다.','n');
    }
    else{
        requester('userEmail','이메일');
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

function joinUser(){
    if(userIdFlag && userNicknameFlag && userPwdFlag && userNameFlag && userEmailFlag && userPhoneFlag){
        $('#joinUserMsg').hide();
        $.ajax({
            url:"/security/users",
            type:"POST",
            data : {
                userId : $('#userId').val(),
                userPwd : $('#userPwd').val(),
                userNickname : $('#userNickname').val(),
                userName : $('#userName').val(),
                userPhone : $('#userPhone').val(),
                userEmail : $('#userEmail').val(),
                userRole : $('#role').val()
            },
            success : ()=>{
                $('#progressStep2').attr('class','join__process-item');
                $('#progressStep3').attr('class','join__process-item is-current');
                $('#step2').hide();
                $('#step3').show();
            },
            statusCode : {
                500 : ()=>{
                    alert('오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                    location.reload();
                }
            }
        })
    }
    else {
        $('#joinUserMsg').show();
    }
}

function loadRole(){
    $.ajax({
        url:"/security/role",
        type:"GET",
        statusCode : {
            200 : (data)=>{
                let res = data;
                $('#role').empty();
                $('#role').append('<option value="">권한 선택</option>');
                for(let key=0; key<Object.keys(res).length; key++)
                    $('#role').append('<option value=\''+res[key].roleid+'\'>'+res[key].rolename+'</option>');
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        },
    })
}