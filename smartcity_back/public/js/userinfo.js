let userNicknameFlag = false;
let userPwdFlag = false;
let userEmailFlag = false;
let userPhoneFlag = false;
let userRoleList = [];

let charCntReg = /(\w)\1\1\1/; 
let userNicknameReg = /^[A-za-z0-9가-힣]{3,20}$/;
let userPwdReg = /^(?=.*\d{1,30})(?=.*[~`!@#$%\^&*()-+_=]{1,30})(?=.*[a-zA-Z]{2,30}).{8,30}$/;
let userEmailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
let userPhoneReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})?[0-9]{3,4}?[0-9]{4}$/;

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
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요. 1111');
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

function checkUserNickname(){
    userNicknameFlag = false;
    if($('#userNickname').val()=='' || $('#userNickname').val()== $('#userNicknameOrigin')){
        onMsg('#userNickname','',p);
        $('#userNickname').val($('#userNicknameOrigin'));
    }
    else{
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
        else {
            userPwdFlag = true;
            onMsg('.pwdMsg','','p');
        }
    }
}

function checkUserEmail(){
    userEmailFlag = false;
    if($('#userEmail').val()=='' || $('#userEmail').val() == $('#userEmailOrigin').val()){
        onMsg('#userEmail','',p);
        $('#userEmail').val($('#userEmailOrigin'));
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
    if($('#userPhone').val()=='' || $('#userPhone').val() == $('#userPhoneOrigin').val()){
        onMsg('#userPhone','',p);
        $('#userPhone').val($('#userPhoneOrigin'));
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

function changePwd(){
    window.location.href = '/users/'+$('#userId').text()+'/changePwd';
}

function closeWindow(){
    if(!opener)
        window.location.href = '/main';
    else
        window.close();
}

function changePwdSubmit(){
    if(userPwdFlag){
        $.ajax({
            url:'/security/users/'+$('#userIdOrigin').val(),
            type:"PATCH",
            data : {
                aType : $('#aType').val(),
                userPwd : $('#userPwd').val()
            },
            statusCode : {
                200 : (res)=>{
                    alert('정보를 성공적으로 수정했습니다.');
                    location.href="/";
                    //closeWindow();
                },
                400 : ()=>{
                    return;
                },
                500 : ()=>{
                    alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                    location.reload();
                }
            },
            error : ()=>{
                return;
            }
        })
    }
    else{
        onMsg('#userPwdMsg','비밀번호를 입력해주세요.','n');
    }
}

function changeUserInfo(){
    let info = new Object;
    info.aType = $('#aType').val();
    let userId = $('#userId').text();

    if(userNicknameFlag)
        info.userNickname = $('#userNickname').val(); 
    if(userEmailFlag)
        info.userEmail = $('#userEmail').val();
    if(userPhoneFlag)
        info.userPhone = $('#userPhone').val();

    for (let i=0; i<userRoleList.length; i++) {
        if($('#role').val() === userRoleList[i].roleid) {
            info.userRole = userRoleList[i].rolename;
        }
    }

    if(Object.keys(info).length<1)
        return;
    
    $.ajax({
        url:'/security/users/'+userId,
        type:"PATCH",
        data : info,
        statusCode : {
            200 : (res)=>{
                alert('정보를 성공적으로 수정했습니다.');
                location.href = '/main';
            },
            400 : ()=>{
                return;
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                location.reload();
            }
        },
        error : ()=>{
            return;
        }
    })
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
                for(let key=0; key<Object.keys(res).length; key++){
                    if(res[key].rolename == $('#userRoleOrigin').val()){
                        $('#role').append('<option value=\''+res[key].roleid+'\' selected>'+res[key].rolename+'</option>');
                        userRoleList.push({roleid :res[key].roleid, rolename : res[key].rolename});
                    }
                    else{ 
                        $('#role').append('<option value=\''+res[key].roleid+'\'>'+res[key].rolename+'</option>');
                        userRoleList.push({roleid :res[key].roleid, rolename : res[key].rolename});
                    }
                }
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
            }
        },
    })
}