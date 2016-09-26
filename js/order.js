//解析地址栏参数
var param=getParam(),
    cityId=param.city_id,
    cityName=param.city_name,
    dateIn=param.date_in,
    dateOut=param.date_out,
    hotelID=param.hotel_id,
    hotelName=param.hotel_name,
    roomId=param.room_id,
    roomType=param.room_types,
    roomPrice=param.room_price,
    picImg=param.pics;

var postDate={
    cityId:cityId,
    cityName:cityName,
    dateIn:dateIn,
    dateOut:dateOut,
    hotelId:hotelID,
    hotelName:hotelName,
    roomId:roomId,
    roomType:roomType
};

//console.log(param);
/*
 city_id : "28"
 city_name : "北京"
 date_in : "2016-04-10"
 date_out : "2016-04-11"
 hotel_id : "1"
 hotel_name : "汉庭酒店"
 pics : "../img/01.jpg"
 room_id : "123"
 room_price : "165"
 room_types : "标准大床房"
 */

//显示入住和离店日期
showFromHotelDate();

//滑屏
var orderListSroll=new iScroll("orderbox",{
    onBeforeScrollStart:function(e){
        var ele= e.target.tagName;
        if(ele!="INPUT" && ele!="SELECT" && ele!="TEXTAREA" && ele!="A"){
            e.preventDefault();
        }
    }
});

$("#pics").attr("src",picImg);
$("#hotel_name").text(hotelName);
$("#type_name").text(roomType);
$("#book_price").text("￥"+roomPrice);
$("#tprice").text("￥"+roomPrice);
$("#rprice").val(roomPrice);

function init(){
    roomNum();
    bindEvent();
}

//房间数量
function roomNum(){
    var $sub=$("#sub"),
        $add=$("#add") ,
        $roomcount=$("#roomcount"),
        m= 1,
        $totalPrice=$("#tprice"),
        $total=$("#rprice");

    $sub.on("tap",function(){
        m--;
        if(m<1){
            m=1;
            common.warning("您不能删除订单！");
            $(this).addClass("no");
            return;
        }
        $roomcount.val(m);
        $add.removeClass("no");
        $totalPrice.text("￥"+roomPrice*m);
        $total.val(roomPrice*m);
        removeNode(m);
    });
    $add.tap(function(){
        m++;
        if(m>5){
            m=5;
            common.warning("您最多只能订5间房间！");
            $(this).addClass("no");
            return;
        }
        $roomcount.val(m);
        $sub.removeClass("no");
        $totalPrice.text("￥"+roomPrice*m);
        $total.val(roomPrice*m);
        appendNode(m);
    });

}
//添加入住人信息
function appendNode(m){
    var html='<div class="userInfo" id="userInfo'+m+'">'
                +'<ul class="infos">'
                    +'<li><i>姓名'+m+'</i><input type="text" placeholder="每间只需填写一个姓名" id="userName'+m+'" name="userName'+m+'"><span class="clear_input">x</span></li>'
                +'</ul>'
                +'<ul class="infos">'
                    +'<li><i>证件'+m+'</i><input type="text" placeholder="入住人身份证号/证件号" id="idcard'+m+'" name="idcard'+m+'"><span class="clear_input">x</span></li>'
                +'</ul>'
            +'</div>';
    $(html).appendTo($("#cantantIfo"));
    $("#userName"+m).showClearInput();
    $("#idcard"+m).showClearInput();
    $(".clear_input").clearInput();

    orderListSroll.refresh();
}
//删除入住人信息
function removeNode(m){
    m+=1;
    $("#userInfo"+m).remove();
    orderListSroll.refresh();
}

function bindEvent(){
    //点击立即预定
    $("#booknow").on("tap",function(){
        $("#cantantIfo input[type=text]").each(function(i){
            var v=$(this).val(),
                $input=$(this);
            if(!v){
                common.warning("请完善入住人信息");
                return;
            }
            //检测身份证
            if((i%2)!=0){
                if(!common.checkCard(v)){
                    var id=$(this).attr("id"),
                        len=id.length,
                        idNum=id.substr(len-1);
                    common.warning("证件"+idNum+"无效","","",function(){
                        $input.focus();
                        return;
                    });
                }
            }
        });
        //验证联系人信息
        var name= $.trim($("#name").val()),
            phone= $.trim($("#phone").val());
        if(!name){
            common.warning("请输入联系人","","",function(){
                $("#name").focus();
                return;
            });
        }
        if(!phone){
            common.warning("请输入联系人的联系方式","","",function(){
                $("#phone").focus();
                return;
            });
        }
        if(!common.checkPhone(phone)){
            common.warning("请输入有效的手机号","","",function(){
                $("#phone").focus();
                return;
            });
        }
        //
        var roomNum=parseInt($("#roomcount").val()),
            totalPrice=parseInt($("#rprice").val())*100;
        postDate.roomNum=roomNum;
        postDate.totalPrice=totalPrice;
        console.log(postDate);
        common.access_server("/shixun/baidawu/server/order.php",postDate,function(data){
            if(data.errcode==0){
                location.href='success.html?city_id='+cityId+'&city_name='+cityName+'&hotel_id='+hotelID+'&hotel_name='+hotelName+'&room_num='+roomNum+'&room_type='+roomType;
            }
        });

    });
}

init();


;(function($){
    $.extend($.fn,{
        showClearInput:function(){
            var $input=$(this);

            $input.on("input propertychange",function(){
                var $tip=$(this).next();
                if($(this).val()){
                    $tip.css("display","block");
                }else{
                    $tip.css("display","none");
                }
            });

        },
        clearInput:function(){
            $(this).on("click",function(){
                $(this).prev().val("").focus();
                $(this).hide();
            });
        }
    });
})(Zepto);


//在所有的文本框上调显示清空
$("#cantantIfo input[type=text]").each(function(){
    $(this).showClearInput();
});

$(".clear_input").each(function(){
    $(this).clearInput();
});