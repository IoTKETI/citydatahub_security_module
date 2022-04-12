function deleteUser(){
    function func(cb){
        let checkbox = $("input[name=checkBox]:checked");
        checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        let userId = (td.eq(1).text()).trim();
        cb(userId);
        })
    }

    func(function(userId){
        let q ='';
        if($('#aType').val()=='true')
            q = '?aType=true';
        
        $.ajax({
            url : '/security/users/'+userId+q,
            type : "DELETE",
            statusCode : {
                200 : function(){
                    alert('적용되었습니다.');
                    location.reload();
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
    });
}

function detailInfo(){

}