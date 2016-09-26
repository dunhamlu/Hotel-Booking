//首字母
var fristWord=['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
//滑屏
var citySroll=new iScroll("container",{
    onBeforeScrollStart:function(e){
        var ele= e.target.tagName;
        if(ele!="INPUT" && ele!="SELECT" && ele!="TEXTAREA"){
            e.preventDefault();
        }
    }
});
function init(){
    //判断地址栏是否有值
    var param=getParam();
    if(param){
        $("#cur_city").text(param.cityName);//地址栏的城市名显示在当前位置
    }else{
        $("#cur_city").text(ls.getItem("cityName"));//把当前位置设置成本地存储的位置
    }
    getHotCity();
    renderWord();
    callBackTo();
}
//渲染热门城市
function getHotCity(){
    $.ajax({
        url:"../server/hotCity.json",
        type:"get",
        dataType:"json",
        success:function(data){
            rendarHotCity(data);
        }
    });
    citySroll.refresh();//进行页面刷新滑屏
}
//热门城市的添加
function rendarHotCity(data){
    var html="";
    $.each(data,function(key,name){
        html+='<li><a href="../index.html?city_id='+key+'&city_name='+encodeURI(name)+'">'+name+'</a></li>';
    });
    $(html).appendTo($("#hot_city"));
    citySroll.refresh();
}
//渲染首字母  并将首字母对应的城市英文名首字母一样的渲染到一个盒子
//有多少个字母就对应多少个城市英文名首字母一样的盒子
function renderWord(){
    var html="",
        baseHtml='';
    for(var i= 0,len=fristWord.length;i<len;i++){
        var f=fristWord[i];//首字母
        baseHtml+='<div id="city'+i+'">'
                    +'<p class="tipbg">'+f+'</p>'
                    +'<ul>';
        html+='<li><a href="#city'+i+'">'+f+'</a></li>';
        //遍历城市数据，将城市英文首字母对应字母的城市放到一个盒子
        $.each(CITIES,function(k,arr){
            var z=arr[1].charAt(0).toUpperCase();
            if(z==f){
                baseHtml+='<li><a href="../index.html?city_id='+k+'&city_name='+encodeURI(arr[0])+'">'+arr[0]+'</a></li>';
            }
        });
        baseHtml+='</ul></div>';
    }
    $(html).appendTo($("#more_list"));
    $(baseHtml).appendTo($("#city_box"));
    citySroll.refresh();
}
//点击返回跳转回首页并将本地存储的数据传到地址栏
function callBackTo(){
    $("#return").on("click",function(){
        var url='../index.html?city_id='+ls.getItem("cityId")+'&city_name='+encodeURI(ls.getItem("cityName"));
        $(this).attr("href",url);
    });
}

init();
