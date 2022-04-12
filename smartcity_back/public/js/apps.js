let appplicationNameFlag = false;
let redirectUriFlag = false;

let charCntReg = /(\w)\1\1\1/;
let appNameReg = /^[a-z가-힣1-9]{2,30}$/;
let urlReg = /^(http|https):\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/;

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

function checkAppName(){
    appplicationNameFlag = false;
    if($('#applicationName').val()==''){
        onMsg('#applicationNameMsg','필수 입력 정보 입니다.','n');
    }
    else{
        if(charCntReg.test($('#applicationName').val())){
            onMsg('#applicationNameMsg','같은 문자나 숫자를 4회 이상 반복하여 사용할 수 없습니다.','n');
        }
        else if(!appNameReg.test($('#applicationName').val())){
            onMsg('#applicationNameMsg','2~10자 이내의 완성형 한글 혹은 영문 소문자를 사용할 수 있습니다.','n');
        }
        else{
            appplicationNameFlag = true;
            onMsg('#applicationNameMsg','','p');
        }
    }
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

function registerApp(){
    if(redirectUriFlag && appplicationNameFlag){
        $.ajax({
            url : "/security/applications",
            type : "POST",
            data : {
                applicationName : $("#applicationName").val(),
                redirectUri : $("#redirectUri").val()
            },
            success : (res)=>{
                $("#appId").text(res.appId);
                $("#appSec").text(res.appSec);
                $("#inProgress").hide();
                $("#complete").show();
            },
            error : ()=>{
                alert('오류가 발생했습니다. 다시 시도해주세요.');
                location.reload();
            }
        })
    }
    else return;
}

function changeAppInfo(){
    let referrer =  document.referrer;
    let url = document.location.href;
    url = url.substring(url.lastIndexOf('/')+1,url.length);
    let body={};
    body.cType = $('#cType').val();

    if($('#appNameOrigin').val() != $('#applicationName').val() && appplicationNameFlag)
        body.applicationName = $("#applicationName").val();
    if($('#appUriOrigin').val() != $('#redirectUri').val() && redirectUriFlag)
        body.redirectUri = $("#redirectUri").val();
        
    if(Object.keys(body).length>0){
        $.ajax({
            url : "/security/applications/"+url,
            type : "PATCH",
            data : body,
            success : (res)=>{
                alert('어플리케이션 정보가 변경되었습니다.');
                location.href = referrer;
            },
            error : ()=>{
                alert('오류가 발생했습니다. 다시 시도해주세요.');
                location.reload();
            }
        })
    }
    else alert('변경된 정보가 없습니다.');
}

function deleteApp(){
    function func(cb){
        let checkbox = $("input[name=checkBox]:checked");
        checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        let appId = (td.eq(2).text()).trim();
        cb(appId);
        })
    }

    func(function(appId){
        $.ajax({
            url : '/security/applications/'+appId,
            type : "DELETE",
            statusCode : {
                200 : function(){
                    alert('적용되었습니다.');
                    location.href= '/';
                },
                500 : function(){
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                    location.reload();
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