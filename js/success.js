//解析地址栏参数
var param=getParam(),
    cityId=param.city_id,
    cityName=param.city_name,
    hotelID=param.hotel_id,
    hotelName=param.hotel_name,
    roomNum=param.room_num,
    roomType=param.room_type,
    mowdate=_getDates();

$("#bookIn").text(mowdate);
$("#city").text(cityName);
$("#hotel").text(hotelName);
$("#count").text(roomNum);
$("#room").text(roomType);





