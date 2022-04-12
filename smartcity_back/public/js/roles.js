let roleNameFlag = false;
let roleNameReg = /^[A-Za-z0-9_]{5,20}$/;

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

function checkRoleName(){
    roleNameFlag = false;
    if(!roleNameReg.test($('#roleName').val())){
        onMsg('#roleNameMsg','5~20자 이내의 영문 대소문자,숫자 및 특수문자(_)를 사용할 수 있습니다.','n');
    }
    else{
        roleNameFlag = true;
        onMsg('#roleNameMsg','','p');
    }
    
}

function loadRoleType(){
    $('#roleType').val($('#roleTypeOrigin').val());
}

function addRole(){
    let referrer =  document.referrer;
    if(roleNameFlag && $('#roleType').val()!=''){
        $('#addRoleMsg').hide();
        $.ajax({
            url:"/security/role",
            type:"POST",
            data : {
                roleType : $('#roleType').val(),
                roleName : $('#roleName').val(),
                roleDesc: $('#roleDesc').val()
            },
            statusCode : {
                200 : ()=>{
                    alert('역할정보가 등록되었습니다.');
                    location.href = referrer;
                },
                400 : ()=>{
                    $('#addRoleMsg').show();            
                },
                409 : ()=>{
                    alert('이미 해당 권한정보가 존재합니다.');
                    location.reload();
                },
                500 : ()=>{
                    alert('오류가 발생하였습니다. 나중에 다시 시도해주세요.');
                    location.reload();
                }
            }
        })
    }
}

function modifyRoleInfo(){
    let referrer =  document.referrer;
    $.ajax({
        url : '/security/role/'+$('#roleIdOrigin').val(),
        type : "PATCH",
        data : {
                roleType : $('#roleType').val(),
                roleName : $('#roleName').val(),
                roleDesc: $('#roleDesc').val()
        },
        statusCode : {
            200 : function(){
                alert('적용되었습니다.');
                location.href = referrer;
            },
            400 : function(){
                alert('오류가 발생했습니다. 다시 시도해주세요.');
                location.reload();
            },
            500 : function(){
                alert('오류가 발생했습니다. 다시 시도해주세요.');
                location.reload();
            }
        }
    });
}

function deleteRole(){
    function func(cb){
        let checkbox = $("input[name=checkBox]:checked");
        checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        let roleId = (td.eq(1).text()).trim();
        cb(roleId);
        })
    }

    func(function(roleId){
        $.ajax({
            url : '/security/role/'+roleId,
            type : "DELETE",
            statusCode : {
                200 : function(){
                    alert('적용되었습니다.');
                    location.reload();
                },
                500 : function(){
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                    location.reload();
                }
            }
        });
    });
}