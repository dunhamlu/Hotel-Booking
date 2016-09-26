;(function($){
    var register=function(){
        var testCode,
        //检测是否输入了
            checkInput=function(){
                var phone=$.trim($('#phone').val()),
                    pwd=$.trim($('#pwd').val()),
                    code=$.trim($('#code').val()),
                    isread=$.trim($('#readies').val()),
                    regs=phone.replace(/\D/,'');
                $('#phone').val(regs);
                if(phone.length>0 && pwd.length>0 && code.length>0 && isread==1){
                    $('#next').addClass('activ');
                }else{
                    $('#next').removeClass('activ');
                }
            },
        //阅读协议
            isRead=function(){
                var checkBtn=$(this).children('span');
                checkBtn.toggleClass('checks');
                if(checkBtn.hasClass('checks')){
                    $('#readies').val(1);
                }else{
                    $('#readies').val(0);
                }
                checkInput();
            },
        //点击密码按钮
            changeBtn=function(){
                var round=$(this).children('p');
                if($(this).hasClass('pwd-off')){
                    $(this).addClass('pwd-on').removeClass('pwd-off');
                    $(this).prev().attr('type','password');
                    round.css({
                        '-webkit-transform':'translate3d(49px,0,0)',
                        '-webkit-transition':'-webkit-transform .5s linear'
                    })
                }else{
                    $(this).addClass('pwd-off').removeClass('pwd-on');
                    $(this).prev().attr('type','text');
                    round.css({
                        '-webkit-transform':'translate3d(0,0,0)',
                        '-webkit-transition':'-webkit-transform .5s linear'
                    })

                }
            },
        // 获取验证码
            getCode=function(){
                var phone=$.trim($("#phone").val());
                if(!common.checkPhone(phone)) {
                    common.warning("请输入正确的手机号码","","确定",function(){
                        $("#phone").val("");
                    });
                    return;
                }
                var time=10,
                    timer=null,
                    $getCode=$("#get_code_btn");
                $getCode.off("click",getCode);

                // 倒计时
                timer=setInterval(function(){
                    time--;
                    if(time<=0){
                        clearInterval(timer);
                        $getCode.text('获取验证码');
                        $getCode.on('click',getCode);
                    }else{
                        $getCode.text(time+'秒后重试');
                    }
                },1000);
                common.access_server("../server/register.php",{"phone":phone},function(data){
                    var data=data.result;
                    if(data.errcode=="2"){
                        common.warning(data.risg,"","关闭");
                    }else if(data.errcode=="1"){
                        common.warning(data.risg,"","登录",function(){
                            location.href="/shixun/baidawu/html/login.html";
                        });
                    }else{
                        testCode=data.risg;
                    }
                });
            },
            checkAll=function(){
                if(!$(this).hasClass("activ")) return;
                var phone=$.trim($("#phone").val()),
                    pwd=$.trim($("#pwd").val()),
                    code=$.trim($("#code").val()),
                    isRead=$("#readies").val();
                if(!common.checkPhone(phone)){
                    common.warning("手机号码有误","","关闭",function(){
                        $("#phone").val("");
                    });
                    return;
                }
                if(!common.checkPwd(pwd)){
                    common.warning("密码在5-12位的字母数字下划线","","关闭",function(){
                        $("#pwd").val("");
                    });
                    return;
                }
                if(!common.checkCode(code)){
                    common.warning("验证码是4位数字","","关闭",function(){
                        $("#code").val("");
                    });
                    return;
                }
                if(code!=testCode){
                    common.warning("验证码有误","","关闭");
                    return;
                }
                common.access_server("../server/registersubmit.php",{"phone":phone,"password":pwd},function(data){
                    if(data.result.errcode==0){
                        location.href="../html/login.html";
                    }else{
                        common.warning("注册失败","","关闭");
                    }
                });

            },
            bindEvent=function(){
                $("#phone").on("propertychange input",checkInput);
                $("#pwd").on("propertychange input",checkInput);
                $("#code").on("propertychange input",checkInput);
                $('#read').on('click',isRead);
                $('#pwd_on_off').on('click',changeBtn);
                $("#get_code_btn").on('click',getCode);
                $("#next").on('click',checkAll);
            };
        return{
            userRegister:function(){
                bindEvent();
            }
        }

    }();
    window.register=register;

})(Zepto);























