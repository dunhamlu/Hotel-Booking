;(function($){
    var logins=function(){
       var checkInput=function(){
           var $phone=$("#phone"),
               $pwd=$("#pwd"),
               $login=$("#login"),
               pNum= $.trim($phone.val()).replace(/\D/,'');
           $phone.val(pNum);
           if($phone.val().length>0 && $pwd.val().length>0){
               $login.addClass("activ");
           }else{
               $login.removeClass("activ");
           }

           },
           checkLogin=function(){
               if($(this).hasClass("activ")){
                   var phone=$.trim($("#phone").val()),
                       pwd=$.trim($("#pwd").val());
                   if(!common.checkPhone(phone)){
                       common.warning("手机号码格式有误","","确定",function(){
                           $("#phone").val("");
                       });

                       return;
                   }
                   if(!common.checkPwd(pwd)){
                       common.warning("请输入5-12位的密码","","确定",function(){
                           $("#pwd").val("");
                       });
                       return;
                   }
                   common.access_server("../server/checkuser.php",{"phone":phone,"pwd":pwd},function(data){
                       if(data.code==1){
                           common.warning(data.msg,"","立即注册",function(){
                               location.href="/shixun/baidawu/html/register.html";
                           })
                       }else if(data.code==2){
                           common.warning(data.msg,"","确定",function(){
                               $("#pwd").val("");
                           })
                       }else{
                           location.href=sessionStorage.getItem("url");
                       }
                   })
               }
           },
           bindEvent=function(){
               $("#phone").on("propertychange input",checkInput);
               $("#pwd").on("propertychange input",checkInput);
               $("#login").on('click',checkLogin);
           };
       return {
           userLogin:function(){
               bindEvent();
           }
       }

    }();
    window.logins=logins;

})(Zepto);



