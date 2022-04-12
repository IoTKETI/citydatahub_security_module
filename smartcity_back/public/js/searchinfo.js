let userPwdFlag = false;
let userIdReg = /^[A-Za-z0-9_.]{5,20}$/;
let userEmailReg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
let userPhoneReg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})?[0-9]{3,4}?[0-9]{4}$/;
let userPwdReg = /^(?=.*\d{1,30})(?=.*[~`!@#$%\^&*()-+_=]{1,30})(?=.*[a-zA-Z]{2,30}).{8,30}$/;

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

function showSearchId(){
    if(!opener){
        let popupX = (window.screen.width / 2) - (685 / 2);
        let popupY= (window.screen.height / 2) - (730 / 2);
        window.open("/accounts/searchId", "searchId", "width=685, height=730, left="+popupX+", top="+popupY);
    }
    else {
        window.location.href = '/accounts/searchId';
    }
}

function showSearchPwd(){
    if(!opener){
        let popupX = (window.screen.width / 2) - (685 / 2);
        let popupY= (window.screen.height / 2) - (730 / 2);
        window.open("/accounts/searchPwd", "searchPwd", "width=685, height=730, left="+popupX+", top="+popupY);
    }
    else{
        window.location.href = '/accounts/searchPwd';
    }
}

function showInputBox(id){
    onMsg('.warning_msg','','p');
    $('.join__input, .input').hide();
    $("#"+id+"Input").show();
}

function searchUserId(){
    let method;
    let input;
    if($('#searchUserEmail').is(':checked')){ //이메일로 아이디를 찾는 경우
        if(!userEmailReg.test($('#searchUserEmailInput').val())){
            onMsg('#searchUserEmailMsg','이메일 형식이 올바르지 않습니다.','n');
            return;
        }
        method = 'userEmail';
        input = $('#searchUserEmailInput').val();
    }
    else { //휴대폰 번호로 아이디를 찾는 경우
        if(!userPhoneReg.test($('#searchUserPhoneInput').val())){
            onMsg('#searchUserPhoneMsg','-를 제외한 숫자 11자리를 입력해주세요.','n');
            return;
        }
        method = 'userPhone';
        input = $('#searchUserPhoneInput').val();
    }

    $.ajax({
        url:"/accounts/searchId",
        type:"POST",
        data : {
            method : method,
            value : input
        },
        statusCode : {
            
            400 : ()=>{
                
                alert('비정상적인 접근입니다.');
                location.reload();
            },
            404 : ()=>{
                $("#searchIdInput").hide();
                $("#searchIdResult").show();
                $("#userIdResult").text('해당 아이디가 존재하지 않습니다.');
                $("#searchIdConfirm").attr('onclick','self.close()');
            },
            500 : ()=>{
                alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                location.reload();
            }
        },
        success : (res)=>{
            $("#searchIdTitle").text("아이디 찾기 결과");
            $("#searchIdInput").hide();
            $("#searchIdResult").show();
            $("#userIdResult").text(res);
            $("#searchIdConfirm").attr('onclick','self.close()');
        }
        })
}

function loadImage() {
    let width = 100;
    let height = $('.join__wrap').height();
    let left = 0;
    let top = 0;   

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
        'px; background: rgb(61,61,61); opacity:0.6; z-index:100; margin:auto; padding:0; "><img src="http://localhost:30000/images/spinner.gif"'+
        ' style="width:75px; height:75px; display: block; margin: 300px auto"></div>');
    }
}

function searchUserPwd(){
    let flag = true;

    if($('#searchPwdIdInput').val()==''){
        onMsg('#searchPwdIdMsg','필수 입력 정보입니다.','n');
    }
    else if(!userIdReg.test($('#searchPwdIdInput').val())){
        onMsg('#searchPwdIdMsg','5~20자 이내의 영문 대소문자 및 숫자를 사용할 수 있습니다.','n');
    }
    else{
        onMsg('#searchPwdIdMsg','','p');
        if(!userEmailReg.test($('#searchPwdEmailInput').val())){
            onMsg('#searchPwdEmailMsg','올바른 이메일을 입력해주세요.','n');
        }
        else{
            flag = false;
            onMsg('#searchPwdEmailMsg','','p');
        }
    }

    if(!flag){
        $.ajax({
            url:"/accounts/searchPwd",
            type:"POST",
            data : {
                userId : $("#searchPwdIdInput").val(),
                userEmail : $("#searchPwdEmailInput").val()
            },
            beforeSend : ()=>{
                loadImage();
            },
            statusCode : {
                404 : ()=>{
                    $("#searchPwdInput").hide();
                    $("#searchPwdResultView").show();
                    $("#searchPwdResult").text('해당 정보의 계정이 존재하지 않습니다.');
                    $("#searchPwdConfirm").attr('onclick','self.close()');
                },
                500 : ()=>{
                    alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                }
            },
            success : ()=>{
                $("#searchPwdInput").hide();
                $("#searchPwdResultView").show();
                $("#searchPwdConfirm").attr('onclick','self.close()');
                $("#div_ajax_load_image").hide();
            },
            complete : ()=>{
                $(".join__wrap").removeAttr('style');
                $("#loadImage").hide();
            }
            })
    }
    else return;
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

function getUrlParams() {
    let params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
}

function resetPwd(){
    let params = getUrlParams();
    
    if(userPwdFlag){
        $.ajax({
            url:"/accounts/resetPwd",
            type : "POST",
            data : {
                userPwd : $("#userPwd").val(),
                userPwdConfirm : $("#userPwdConfirm").val(),
                userEmail : params.email,
                verifyCode : params.verifyCode
            },
            statusCode : {
                400 : ()=>{
                    alert('비정상적인 접근입니다.');
                    location.reload();
                },
                404 : ()=>{
                    $("#resetPwdInput").hide();
                    $("#resetUserPwdResult").html("링크가 만료되었습니다.");
                    $("#resetPwdResult").show();
                    $("#resetPwdConfirm").attr('onclick',"location.href='/'");
                },
                500 : ()=>{
                    alert('일시적인 오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                    location.reload();
                }
            },
            success : ()=>{
                $("#resetPwdInput").hide();
                $("#resetPwdResult").show();
                $("#resetPwdConfirm").attr('onclick',"location.href='/'");
            }
        })
    }
}