//解析地址栏参数
var params=getParam(),
    cityId=params.city_id,
    cityName=params.city_name,
    dateIn=params.date_in,
    dateOut=params.date_out,
    name=params.name;
//给后台的参数   common 中的 data
var DATE_POST={
    cityId:cityId,
    dateIn:dateIn,
    dateOut:dateOut
};
if(name) DATE_POST["name"]=name;


//显示入住和离店日期
showFromHotelDate();

//滑屏
var listSroll=new iScroll("hotel_scroll",{
    onBeforeScrollStart:function(e){
        var ele= e.target.tagName;
        if(ele!="INPUT" && ele!="SELECT" && ele!="TEXTAREA"  && ele!="A"){
            e.preventDefault();
        }
    }
});

function init(){
    getDateFromHotelList();
    touchShowHideNav();
    bindEvent();
}
//渲染酒店列表
function getDateFromHotelList(action){
    common.access_server("../server/hotel.php",DATE_POST,function(resu){
        //console.log(resu.result);
        createCalentList(resu,action);
    });
}

//动态创建酒店列表 拼接字符串
function createCalentList(resu,action){
    console.log(resu);
    var $tipbox=$("#tipbox");
    if(action) $("#hotel_list").empty();
    if(resu.errcode==1){
        $tipbox.css("display","block");
    }else{
        $tipbox.css("display","none");
        var arr=resu.result.hotel_list;
        //console.log(arr);
        var html="",
            starsArr=["","","二星/经济型","三星","四星","五星"];
        $.each(arr,function(i,obj){
            html+='<div class="rows">'
                    +'<a href="../html/detail.html?city_id='+cityId+'&city_name='+cityName+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'&hotel_id='+obj.hotel_id+'">'
                        +'<dl>'
                            +'<dt><img src="'+obj.image+'"/></dt>'
                            +'<dd>'
                                +'<h2>'+obj.name+'</h2>'
                                +'<p class="tip"><span>4.5分</span><em>礼</em><em>促</em><em>返</em></p>'
                                +'<p class="stars">'+starsArr[obj.stars]+'</p>'
                                +'<p class="dizhi">'+obj.addr+'</p>'
                            +'</dd>'
                        +'</dl>'
                    +'</a>'
                    +'<aside class="aside">'
                        +'<p class="price">￥<span>'+obj.low_price/100+'</span>起</p>'
                        +'<p class="distance"><span>0.8</span>k</p>'
                    +'</aside>'
            +'</div>';
        });
        $(html).appendTo($("#hotel_list"));
        listSroll.refresh();
    }

}
//滑动屏幕，显示和隐藏底部导航
function touchShowHideNav(){
    var $footnav=$("#footnav"),
        $hotelList=$("#hotel_list"),
        startY= 0,
        offsetY=0;

    $hotelList.on("touchstart",function(e){
        e.preventDefault();
        offsetY=0;
        startY= e.touches[0].clientY;
    });
    $hotelList.on("touchmove",function(e){
        e.preventDefault();
        offsetY= e.touches[0].clientY-startY;
    });
    $hotelList.on("touchend",function(e){
        e.preventDefault();
        //console.log(offsetY);
        if(offsetY<0){
            $footnav.css({
                "height":"3rem",
                "-webkit-transition":"height 0.5s ease-in-out"
            });
        }else{
            $footnav.css({
                "height":"1rem",
                "-webkit-transition":"height 0.5s ease-in-out"
            });
        }
    });
}


//绑定事件
function bindEvent(){
    //点击返回，返回主页面
    $("#backIndex").click(function(){
        var inDate=$("#date_in").val(),
            outDate=$("#date_out").val(),
            hotelName=name ? name : "";

        var url='../index.html?date_in='+inDate+'&date_out='+outDate+'&city_id='+cityId+'&city_name='+cityName+'&name='+hotelName;
        $(this).attr("href",url);
    });

    //点击底部导航
    var $layer=$("#item_layer"),
        $items=$layer.children("div");
    $("#footnav").on("click","a",function(){
        var indx=$(this).index();
        $(this).addClass("cur_item").siblings().removeClass("cur_item");
        common.showMark();
        $layer.css({
            "height":"20rem",
            "-webkit-transition":"height 0.5s linear"
        });
        $items.eq(indx).addClass("cur_layer").siblings().removeClass("cur_layer");
    });
}

//渲染筛选

//排序
var order={
    "all":"不限",
    "hot":"人气最高",
    "priceMin":"价格最低",
    "priceMax":"价格最高",
    "distance":"距离最近"
};
function renderOrder(){
    var htmlArr=['<ul>'],
        $sortBox=$("#sort");
    $.each(order,function(k,text){
        htmlArr.push('<li id="'+k+'">',
            '<a href="javascript:void(0)">',
            '<b>'+text+'</b>',
            '<span onclick="changeOrder(\''+k+'\')"></span>',
            '</a>',
            '</li>');
    });
    htmlArr.push('</ul>');
    $sortBox.html(htmlArr.join("")).find("li").eq(0).addClass("on");
}
function changeOrder(id){
    var $cur_li=$("#"+id);
    var vl=id==="all"?-1:id;
    $cur_li.addClass("on").siblings().removeClass("on");
    $("#order").val(vl);
    DATE_POST.sortType=vl;
    getDateFromHotelList("order");
    hideLayer();

}
renderOrder();

//价格   ??????要传给后台一个minPrice 和 一个maxPrice
var prices={
    "oll":["不限"],
    "yiji":["0-100",0,100],
    "erji":["101-300",101,300],
    "sanji":["301-500",301,500],
    "siji":["501-1000",501,1000],
    "wuji":["1000以上"]
};
function renderPrice(){
    var html='<ul>',
        $priceBox=$("#price");
    $.each(prices,function(k,arr){
        html+='<li id="'+k+'">'
                +'<a href="javascript:void(0)">'
                    +'<b>'+arr[0]+'</b>'
                    +'<span onclick="changePrice(\''+k+'\','+arr[1]+','+arr[2]+')"></span>'
                +'</a>'
            +'</li>';
    });
    html+='</ul>';
    //console.log(html);
    $priceBox.html(html).find("li").eq(0).addClass("on");
}
function changePrice(id,min,max){
    var $curli=$("#"+id);
    $curli.addClass("on").siblings().removeClass("on");
    if(id==="oll"){
        min=-1;
        max=-1;
    }else if(id==="wuji"){
        max=-1;
    }
    $("#minPrice").val(min*100);
    $("#maxPrice").val(max*100);
    DATE_POST.minPrice=min*100;
    DATE_POST.maxPrice=max*100;
    getDateFromHotelList("price");
    hideLayer();
}

renderPrice();

//品牌
var brands = {
    0:'不限',
    12:'喜来登',
    15:'如家',
    18:"万豪",
    35:"香格里拉",
    39:"速8",
    44:"莫泰168",
    48:"汉庭",
    49:"全季",
    50:"锦江之星",
    53:"里程",
    68:"桔子",
    110:"如家快捷",
    132:"7天",
    160:"布丁",
    168:"格林豪泰",
    286:"尚客优"
};
function renderBrands(){
    var html='<ul>',
        $brandsBox=$("#brands");
    $.each(brands,function(k,text){
        html+='<li id="b'+k+'">'
        +'<a href="javascript:void(0)">'
        +'<b>'+text+'</b>'
        +'<span onclick="changeBrand('+k+',\''+text+'\')"></span>'
        +'</a>'
        +'</li>';
    });
    html+='</ul>';
    $brandsBox.html(html).find("li").eq(0).addClass("on");
}
function changeBrand(k,t){
    var $curli=$("#b"+k);
    var vl=t==="不限"?-1:t;
    //console.log(vl);
    $curli.addClass("on").siblings().removeClass("on");
    $("#brand").val(vl);
    DATE_POST.brand=vl;
    getDateFromHotelList("brand");
    hideLayer();
}
renderBrands();

//星级
var stars={
    0:"不限",
    2:"二星以下/经济型",
    3:"三星",
    4:"四星",
    5:"五星"
};
function renderStar(){
    var html='<ul>',
        $starBox=$("#star");
    $.each(stars,function(k,sta){
        html+='<li id="s'+k+'">'
        +'<a href="javascript:void(0)">'
        +'<b>'+sta+'</b>'
        +'<span onclick="changeStar('+k+')"></span>'
        +'</a>'
        +'</li>';
    });
    html+='</ul>';
    $starBox.html(html).find("li").eq(0).addClass("on");
}
function changeStar(id){
    var $curLi=$("#s"+id);
    var vl=id===0?-1:id;
    $curLi.addClass("on").siblings().removeClass("on");
    $("#stars").val(vl);
    DATE_POST.stars=vl;
    getDateFromHotelList("star");
    hideLayer();
}
renderStar();
//隐藏遮罩层及筛选页
function hideLayer(){
    setTimeout(function(){
        common.hideMark();
        $("#item_layer").css({
            "height":"0rem",
            "-webkit-transition":"height 0.5s linear"
        });
    },300);
}


init();

