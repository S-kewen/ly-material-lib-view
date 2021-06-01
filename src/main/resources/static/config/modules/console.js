/** layuiAdmin.std-v1.2.1 LPPL License By http://www.layui.com/admin/ */ ;
var source_newUser=[0,0,0,0,0,0,0];
var source_newFeedback=[0,0,0,0,0,0,0];
$(document).ready(function() {
    $.ajax({
        url: ADMIN.API_GETCHARTINFO+"?nowDate="+getDay(0),
        type:"POST",
        dataType: "json",
        async: false,
        headers: {'Authorization': getCookie("token")},
        success:function(res){
            if(res.code==200){
                if(res.data.user!==null){
                    for(let i=0; i<res.data.user.length; i++){
                        if(res.data.user[i].days>=0 && res.data.user[i].days<=6){
                            source_newUser[6-res.data.user[i].days]=res.data.user[i].newUser;
                        }
                    }
                }  
                if(res.data.feedback!==null){
                    for(let i=0; i<res.data.feedback.length; i++){
                        if(res.data.feedback[i].days>=0 && res.data.feedback[i].days<=6){
                            source_newFeedback[6-res.data.feedback[i].days]=res.data.feedback[i].newFeedback;
                        }
                    }
                }
                console.log(source_newUser);
                console.log(source_newFeedback);
            }else{
                showTip(TIPS.ERROR);
            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg(TIPS.ERROR);
        }
    });
    layui.define(function(e) {
        layui.use(["admin", "carousel"], function() {
            var e = layui.$,
            t = (layui.admin, layui.carousel),
            a = layui.element,
            i = layui.device();
            e(".layadmin-carousel").each(function() {
                var a = e(this);
                t.render({
                    elem: this,
                    width: "100%",
                    arrow: "none",
                    interval: a.data("interval"),
                    autoplay: a.data("autoplay") === !0,
                    trigger: i.ios || i.android ? "click" : "hover",
                    anim: a.data("anim")
                })
            }), a.render("progress")
        }), layui.use(["admin", "carousel", "echarts"], function() {
            var e = layui.$,
            t = layui.admin,
            a = layui.carousel,
            i = layui.echarts,
            l = [],
            n = [{
                title: {
                    text: "New User & New Feedback",
                    x: "center",
                    textStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["", ""]
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: !1,
                    data: [ getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), getDayAndWeek(-1), getDayAndWeek(0)]
                }],
                yAxis: [{
                    type: "value"
                }],
                series: [{
                    name: "NewUser",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: source_newUser
                }, {
                    name: "newFeedback",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: source_newFeedback
                }]
            }],
            r = e("#LAY-index-dataview").children("div"),
            o = function(e) {
                l[e] = i.init(r[e], layui.echartsTheme), l[e].setOption(n[e]), t.resize(function() {
                    l[e].resize()
                })
            };
            if (r[0]) {
                o(0);
                var d = 0;
                a.on("change(LAY-index-dataview)", function(e) {
                    o(d = e.index)
                }), layui.admin.on("side", function() {
                    setTimeout(function() {
                        o(d)
                    }, 300)
                }), layui.admin.on("hash(tab)", function() {
                    layui.router().path.join("") || o(d)
                })
            }
        })
});
})
function getDay(day){
    var today = new Date();
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear+"-"+tMonth+"-"+tDate;
}
function getDayAndWeek(day){
    var a = ["日", "一", "二", "三", "四", "五", "六"];
    var today = new Date();
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tMonth+"-"+tDate;
}
function doHandleMonth(month){

    var m = month;

    if(month.toString().length == 1){

        m = "0" + month;

    }

    return m;

}