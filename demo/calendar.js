/*
* 日历选择插件
*简单的一个日历选择，记录一下
* */
var calendar = {};
calendar.t =  60*60*24*1000;//一天的毫秒数
/*
*param
*{minDate:"2015-1-2",maxData:"2017-1-1"，selected:"2016-5-12"}
*/
calendar.init = function(param){
	
    var min = param.minDate.split("-");
    var max = param.maxDate.split("-");
    var seleced = param.selected.split("-");
    calendar.maxYear = max[0];
    calendar.maxMonth = max[1];
    calendar.maxDay = max[2];
    calendar.minYear = min[0];
    calendar.minMonth = min[1];
    calendar.minDay = min[2];

    calendar.selectedDay = seleced[2];
    calendar.selectedMonth = seleced[1];
    calendar.selectedYear = seleced[0];
}
//getFullMonthDays这个方法可以不对外暴露
calendar.getFullMonthDays=function(paramData){
    function testDate(b){
        var className = " ";
        var type = "";
        if(b.year==calendar.selectedYear&& b.showMonth==calendar.selectedMonth&& b.day ==calendar.selectedDay){
            className=" calendar-selected";
        }else if(b.year>calendar.maxYear){
            className=" calendar-disabled";
            type="disabled";
        }else if(b.year==calendar.maxYear &&b.showMonth>calendar.maxMonth){
            className=" calendar-disabled";
            type="disabled";
        }else if(b.year==calendar.maxYear &&b.showMonth==calendar.maxMonth&& b.day>calendar.maxDay){
            className=" calendar-disabled";
            type="disabled";
        }else if(b.year<calendar.minYear){
            className=" calendar-disabled";
            type="disabled";
        }else if(b.year==calendar.minYear &&b.showMonth<calendar.minMonth){
            className=" calendar-disabled";
            type="disabled";
        }else if(b.year==calendar.maxYear &&b.showMonth==calendar.minMonth&& b.day<calendar.minDay){
            className=" calendar-disabled";
            type="disabled";
        }
        b.className+=className;
        if(type){
            b.type = type;
        }
        return b;
    }
    var t = calendar.t;
    var date = new Date();
    date.setTime(paramData.getTime());
    var a = [];
    var day = date.setTime(date.getTime()-t*date.getDate()+t);//获取本月第一天时间戳;
    var showMonth = date.getMonth()+1;
    var month = date.getMonth();
    var showYear = date.getFullYear();
    while(date.getMonth()==month){
        var b = {};
        b.type = "show";
        b.className="calendar-show";
        b.month = date.getMonth();
        b.showMonth = date.getMonth()+1;
        b.day = date.getDate();
        b.weekDay = date.getDay();
        b.year = date.getFullYear();
        b.date= b.year+'-'+ b.showMonth+'-'+ b.day;
        b = testDate(b);
        a.push(b);
        date.setTime(date.getTime()+t);
    }//本月数据完成
    var prevMonth = [];
    var prev = a[0].weekDay-1;
    prev = prev==-1?6:prev;
    if(prev){
        var p =new Date();
        p.setTime(day-t*prev);
        for(var i = 0; i<prev;i++){
            var pp = {};
            pp.type="prev";
            pp.month = p.getMonth()+1;
            pp.showMonth = p.getMonth()+1;
            pp.weekDay = p.getDay();
            pp.year = p.getFullYear();
            pp.day = p.getDate();
            pp.className='calendar-prev';
            pp.date= pp.year+'-'+  pp.showMonth+'-'+ pp.day;
            pp = testDate(pp);
            prevMonth.push(pp);
            p.setTime(p.getTime()+t);
        }
    }//上月数据完成
    var nextMonth = [];
    var n = 6*7- a.length-prevMonth.length;
    if(n){
        for(var i = 0; i <n;i++){
            var nn = {};
            nn.type="next";
            nn.month = date.getMonth();
            nn.showMonth = date.getMonth()+1;
            nn.weekDay = date.getDay();
            nn.year =date.getFullYear();
            nn.day = date.getDate();
            nn.className='calendar-next';
            nn.date= nn.year+'-'+ nn.showMonth+'-'+ nn.day;
            nn = testDate(nn);
            nextMonth.push(nn);
            date.setTime(date.getTime()+t);
        }
    }
    return {"year":showYear,"month":showMonth,"data":prevMonth.concat(a,nextMonth)};
}
//对外方法
//date：2015-1-1,
//monthStep即date的月份步进,方面前后按钮的点击
calendar.getDateByIndex=function(date,monthStep){//根据日期和index获取对应的date
    var t = calendar.t;
    var d = new Date(date.replace(/-/g,"/"));
    d.setTime(d.getTime()-d.getDate()*t+t);
    d.setMonth(d.getMonth()+monthStep);
    console.log(d);
    return this.getFullMonthDays(d);
}
calendar.formatDate=function(dateList){
        var d = [];
        //按周拆日期，方便周选择
        var index = -1;
        for(var i = 0; i < dateList.length;i++){
            if(i%7===0){
                index++;
                d[index]=[];
            }
            d[index].push(dateList[i]);
        }
        return d;    
}
