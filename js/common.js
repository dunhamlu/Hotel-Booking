document.addEventListener("touchmove",function(e){e.preventDefault()});
//ajax请求构造函数
function Common(){

}
//get请求
Common.prototype.access_server=function(url,data,callback,errorcallback){
    var _this=this;
    var async=typeof(async)==="undefined"?true:async;
    //显示加载动画
    this.showLoading();
    $.ajax({
        url:url,
        type:"get",
        data:data,
        dataType:"json",
        async:async,
        success:function(result){
           _this.hideLoading();
            callback && callback(result);
        },
        error:function(){
            _this.hideLoading();
            errorcallback && errorcallback();
            _this.warning('请求失败，请<a href="location.reload()">刷新</a>/重试',"","",function(){})
        }
    });
};
//显示加载动画
Common.prototype.showLoading=function(){
    this.showMark();
    if($("#ui-id-loading").length==0){
        var $loading=$('<div class="ui-id-loading"><img></div>');
        $loading.attr("id","ui-id-loading");
        $loading.children("img").attr("src","../img/loading.gif");
        $loading.appendTo($("body"));
    }
};
//隐藏加载动画
Common.prototype.hideLoading=function(){
    this.hideMark();
    $("#ui-id-loading") && $("#ui-id-loading").remove();
};
//显示遮罩
Common.prototype.showMark=function(){
    if($("#ui-id-mark").length==0){
        $('<div class="ui-id-mark" id="ui-id-mark">').appendTo($("body"));
    }
};
//隐藏遮罩
Common.prototype.hideMark=function(){
    $("#ui-id-mark") && $("#ui-id-mark").remove();
};
//弹出提示框
Common.prototype.warning=function(msg,title,btn,callback){
    var _this=this;
    btn=btn?btn:"确定";
    title=title?title:"";
    this.showMark();
    if($("#ui-id-dialog").length==0){
        var dialog='<div class="ui-dialog" id="ui-id-dialog">'
                        +'<div class="tipcontainer">'
                            +'<h2>'+title+'</h2>'
                            +'<div class="content">'+msg+'</div>'
                            +'<p class="btns">'
                                +'<a href="javascript:;" id="done">'+btn+'</a>'
                            +'</p>'
                        +'</div>'
                    +'</div>';
        $(dialog).appendTo($("body"));
        $("#done").click(function(){
            _this.hideMark();
            $("#ui-id-dialog").remove();
            callback && callback();
        });
    }
};
//验证手机
Common.prototype.checkPhone=function(val){
    var reg=/^1[3578]\d{9}$/;
    if(reg.test(val)){
        return true;
    }
    return false;
};
//密码
Common.prototype.checkPwd=function(val){
    var reg=/^\w{5,12}$/;
    if(reg.test(val)){
        return true;
    }
    return false;
};
//身份证
Common.prototype.checkCard=function(val){
    var reg=/^\d{17}(X|[0-9])$/;
    if(reg.test(val)){
        return true;
    }
    return false;
};
//邮箱
Common.prototype.checkEmail=function(val){
    var reg=/^\w+\.?@[a-z0-9]+\.(com|cn|net|com.cn|org|edu)$/;
    if(reg.test(val)){
        return true;
    }
    return false;
};
//验证码
Common.prototype.checkCode=function(val){
    var reg=/^\d{4}$/;
    if(reg.test(val)){
        return true;
    }
    return false;
};


var common=new Common();
//common.access_server("server/hotCity.json",{},function(){});

//本地存储
var ls=window.localStorage;
//解析地址栏参数
function getParam(){
    var url=location.search.substr(1);//date_in=2016-03-23&date_out=2016-03-24
    if(url.length==0) return false;
    var arr=url.split("&"),//["date_in=2016-03-23","date_out=2016-03-24"]
        param={};
    for(var i=0;i<arr.length;i++){
        var str=arr[i].split("=");
        param[str[0]]=decodeURI(str[1]);
    }
    return param;
    //object {"date_in":2016-03-23,"date_out":2016-03-24}
}

//公共的方法
//将月份和天小于10的前边加0   3转为03
function addZero(num){
    if(num<10){
        return '0'+num;
    }else{
        return num;
    }
}
//将日期转成数字  2016-04-02  20160402
function changeToNum(str){
    return str.replace(/[-\/]/g,"");
}
//2016-04-02    2016,04,02
function changeToDate(str){
    return str.replace(/[-\/]/g,",");
}
//将日期转化为数组
function revertToArr(str){
    return str.split("-");
}
//生成日期
function _getDates(i,opt){
    //生成i天之后的毫秒数
    i=i?i*86400*1000:0;
    var today=opt ? new Date(opt.year,opt.month,opt.day): new Date(),
        times=today.getTime()+i,
        tempDate=new Date();
    tempDate.setTime(times);
    return tempDate.getFullYear()+'-'+addZero(tempDate.getMonth()+1)+'-'+addZero(tempDate.getDate());
}
//拆分  拼接月和日  2016-04-04   4月4日
function reverToDateStr(data){
    var arr=data.split("-"),
        mon=returnNum(arr[1]),
        day=returnNum(arr[2]);
    return mon+'月'+day+'日';
}
//将月和日的零去掉  04  4
function returnNum(num){
    if(num.charAt(0)==0){
        return num.charAt(1);
    }
    return num;
}

//调用日历组件
function callCalendar(ele,minDate,maxDate,action){
    ele.calendar({
        minDate:minDate,//最小日期
        maxDate:maxDate,//最大日期
        firstDay:0,//设置新的一周从星期几开始，星期天用0表示, 星期一用1表示,默认是1
        swipeable:true,//左右滑动切换
        //日历组件调用消失之后的回调函数
        hide:function(){
            changeDateOut(action);
        }
    }).calendar("show");

    $('.shadow').remove();
    $('.ui-slideup-wrap').addClass('calenderbox');
    var shadow=$('<span class="shadow"></span>');
    $('.calenderbox').append(shadow);
    $('.ui-slideup').addClass('calender');
}
//比较入住与离店日期
function changeDateOut(pageType){
    var dateIn=$("#date_in").val(),//入住日期
        inDateArr=revertToArr(dateIn),
        dateOut=$("#date_out").val(),//离店日期
        dateInNum=changeToNum(dateIn),
        dateOutNum=changeToNum(dateOut),
        nowDateOut=dateOut;
    //判断 如果入住日期大于等于离店日期  让离店日期显示入住日期的后一天
    if(dateInNum>=dateOutNum){
        nowDateOut=_getDates(1,{year:inDateArr[0],month:inDateArr[1]-1,day:inDateArr[2]});
    }
    $("#date_out").val(nowDateOut);
    if(!pageType) return;
    //如果是列表页和内容页
    $("#inText").text(reverToDateStr($("#date_in").val()));
    $("#outText").text(reverToDateStr($("#date_out").val()));



    //重新ajax请求
    //修改DATE_POST中的dateIn和dateOut
    DATE_POST.dateIn=dateIn;
    DATE_POST.dateOut=nowDateOut;
    if(pageType=="list"){
        getDateFromHotelList("reload");
    }
    if(pageType=="detail"){
        sendFormDetail("detail")
    }
}

//列表页和内容页的修改日历
function editCalendar(){
    $("#modify").click(function(){
        var $dateIn=$("#date_in"),
            $dateOut=$("#date_out"),
            today=new Date(),
            minDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()),
            maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
        callCalendar($dateIn,minDate,maxDate,$(this).attr("type"));
    });

}
editCalendar();


//列表页和内容页  显示入住和离店日期
function showFromHotelDate(){
    $("#date_in").val(dateIn);
    $("#date_out").val(dateOut);
    $("#inText").text(reverToDateStr(dateIn));
    $("#outText").text(reverToDateStr(dateOut));
}


// 判断用户是否登录
function if_logined(url){

    function checkLogin(data){
        // 如果没有登录
        if(data.if_logined=='1'){
            sessionStorage.setItem("url",url);
            common.warning("您还没有登录，请先登录！","","登录",function(){
                location.href='/shixun/baidawu/html/login.html';
            });
        }else{
            location.href=url;
        }
    }
    common.access_server('/shixun/baidawu/server/check.php',{},function(data){
        checkLogin(data);
    });
}

