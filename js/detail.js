
//解析地址栏参数
var param=getParam(),
    cityId=param.city_id,
    cityName=param.city_name,
    dateIn=param.date_in,
    dateOut=param.date_out,
    hotelID=param.hotel_id,
    starArr=["","","二星以下/经济型","三星","四星","五星"];
//给后台的参数   common 中的 data
var DATE_POST={
    cityId:cityId,
    cityName:cityName,
    dateIn:dateIn,
    dateOut:dateOut,
    hotelId:hotelID
};

//显示入住和离店日期
showFromHotelDate();

//滑屏
var detailListSroll=new iScroll("section",{
    onBeforeScrollStart:function(e){
        var ele= e.target.tagName;
        if(ele!="INPUT" && ele!="SELECT" && ele!="TEXTAREA" && ele!="A"){
            e.preventDefault();
        }
    }
});

function init(){
    sendFormDetail();
    bindEven();
}

//调用ajax请求
function sendFormDetail(action){
    common.access_server("../server/hotelDetail.json",DATE_POST,function(result){
        var data=result.result,
            url=data.images.split(";")[0],
            roomTypes=data.room_types;//房间类型
        //console.log(data);
        //图
        $("#hotel_img").children("img").attr("src","../"+url);
        //基本信息
        $("#hotelName").text(data.name);
        $("#hotel_name").val(data.name);
        $("#stars").text(starArr[data.star]+"级酒店");
        $("#phone").text(data.tel.replace(","," / "));
        $("#address").text(data.addr);
        //酒店介绍
        $("#description").text(data.desc);
        $("#sheshi").text(data.facilities);
        createRoomType(roomTypes,action);
    });
}
//渲染房间类型
function createRoomType(data,retu){
    //console.log(data);
    var html="",
        $content=$("#detail_list");
    if(retu) $content.empty();
    $.each(data,function(k,val){
        //console.log(val);
        var typeId=val.type_id,
            goods=val.goods;

        $.each(goods,function(i,obj){
            var price=Math.min.apply(null,obj.price)/100;
            //console.log(obj);
            if(obj.room_state==1){
                state='<b data-room="'+obj.room_id+'" data-type="'+typeId+'" data-roomtype="'+val.name+'" data-pics="'+val.smapic+'" data-price="'+price+'">预定</b>'
            }else if(obj.room_state==0){
                state='<b class="none">满房</b>'
            }
            html+='<div class="detail_rows">'
                +'<dl>'
                    +'<dt>'+val.name+'</dt>'
                    +'<dd><span>'+val.bed_type+'</span></dd>'
                +'</dl>'
                 +'<p>'
                    +'<em>￥'+price+'</em>'
                    +state
                +'</p>'
            +'</div>';
        });
    });
    $(html).appendTo($content);
    detailListSroll.refresh();


    //点击预定按钮
    $content.on("click","b",function(){
        if($(this).hasClass("none")) return;
        common.showMark();
        $("#orderRoom").css({
           "height":"28rem",
            "-webkit-transition":"height 0.5s linear"
        });

        var url='/shixun/baidawu/html/order.html?city_id='+cityId+'&city_name='+cityName+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'&room_id='+$(this).data("room")+'&room_types='+$(this).data("roomtype")+'&room_price='+$(this).data("price")+'&pics='+$(this).data("pics")+'&hotel_name='+$("#hotel_name").val()+'&hotel_id='+hotelID;

        //点击立即预定
        $("#btn").on("click","span",function(){
            common.hideMark();
            if_logined(url);
        });

        //点击X关闭
        $("#close").click(function(){
            common.hideMark();
            $("#orderRoom").css({
                "height":"0rem",
                "-webkit-transition":"height 0.5s linear"
            });
        });
    });

}



//绑定事件
function bindEven(){
    //点击返回，返回列表页
    $("#backTo").on("click",function(){
        var url='hotelList.html?city_id='+cityId+'&city_name='+cityName+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val();
        $(this).attr("href",url);
    });


    //点击基本信息和酒店介绍 切换
    $("#base_info").on("click","li",function(){
        var inds=$(this).index();
        $(this).addClass("on").siblings().removeClass("on");
        $("#content_wrap").children("div").eq(inds).addClass("cur_info").siblings().removeClass("cur_info");
    });
    //点击展开
    $(".hotel_btn").click(function(){
        if($(this).text()=="展开详情"){
            $(this).text("收起");
            $(this).prev().css("height","auto");
        }else{
            $(this).text("展开详情");
            $(this).prev().css("height","3.2rem");
        }
    });



}


//调用
init();