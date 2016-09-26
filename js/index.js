//图片轮播
var swipers = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',/*分页器容器的css选择器或HTML标签。*/
    paginationClickable: true,/*此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换*/
    autoplay:2000,/*自动播放时间设定*/
    autoplayDisableOnInteraction:false/* 当设置为false时,用户操作之后(swipes,arrow以及pagination 点击)autoplay不会被禁掉*/
});
function init(){
    showCity();
    showCalendar();
    bindEvent();
}
//显示位置
function showCity(){
    var $dateIn=$("#date_in"),
        $dateOut=$("#date_out"),
        today=new Date();
    //判断地址栏是否有值
    var params=getParam();
    if(params){
        var cityId=params.city_id,
            cityName=params.city_name,
            dateIn=params.date_in?params.date_in:_getDates(),
            dateOut=params.date_out?params.date_out:_getDates(1),
            names;
           // names=params.name==="undefined"? "" : params.name;
        if(!params.name){
            names="";
        }else if(params.name=="undefined"){
            names="";
        }else{
            names=params.name;
        }

        //alert(params.name);
        //将解析出来的地址栏的值存储到本地存储
        ls.setItem("cityName",cityName);
        ls.setItem("cityId",cityId);
        $("#city_name").text(cityName);
        $("#city_id").val(cityId);
        $dateIn.val(dateIn);
        $dateOut.val(dateOut);
        $("#name").val(names)
    }else{
        //将默认的位置存储的本地
        ls.setItem("cityName","北京");
        ls.setItem("cityId",28);
        $("#city_name").text(ls.getItem("cityName"));
        $("#city_id").val(ls.getItem("cityId"));
        $dateIn.val(_getDates());
        $dateOut.val(_getDates(1));
    }
}
// 显示 入住和离店日期
function showCalendar(){
    //显示默认的入住和离店日期  入住为今天，离店为明天
    var $dateIn=$("#date_in"),
        $dateOut=$("#date_out"),
        today=new Date();
    showCity();

    //入住和离店在激活的时候，调用日历组件，显示日历
    $dateIn.on("focus",function(){
        var minDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()),
            maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
        //调用日历组件
        callCalendar($(this),minDate,maxDate);
    });

    $dateOut.on("focus",function(){
        var minDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()),
            maxDate=new Date(today.getFullYear(),today.getMonth(),today.getDate()+91);
        //调用日历组件
        callCalendar($(this),minDate,maxDate);
    });
}
function bindEvent(){
    $("#search").on("click",function(){
        var cityId=$("#city_id").val(),
            cityName=$("#city_name").text(),
            dateIn=$("#date_in").val(),
            dateOut=$("#date_out").val(),
            hotelName= $.trim($("#name").val()), //trim() 去除空格
            url='html/hotelList.html?city_id='+cityId+'&city_name='+encodeURI(cityName)+'&date_in='+dateIn+'&date_out='+dateOut+'&name='+encodeURI(hotelName);
        $(this).attr("href",url);
    });
}
//调用
init();