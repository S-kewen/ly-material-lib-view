layui.config({
    base: 'https://static.iskwen.com/lymateriallib/config/'
}).extend({
    index: 'lib/index'
}).use('index');

var task_checkToken = window.setInterval('checkToken()', 30000);
$(document).ready(function () {
    browserRedirect();
    $.ajax({
        url: URL.API_HOST + "/user/checkToken",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (res) {
            if (res.code == 200) {
                console.log(res.data)
            } else {
                top.location.href = '/';
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg(TIPS.ERROR);
        }
    });
    $.ajax({
        url: URL.API_HOST + "/user/getUserInfo",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (res) {
            if (res.code == 200) {
                $("#usernameByCite").html(res.data.username);
            } else {
                showTip(res.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg(TIPS.ERROR);
        }
    });
})

function logout() {
    layer.confirm("您确定要退出登录吗？", {
        icon: 3,
        title: '温馨提示'
    }, function () {
        top.location.href = 'logout';
    });
}

function refresh() {
    $.ajax({
        url: URL.API_HOST + "/user/checkToken",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (res) {
            if (res.code != 200) {
                top.location.href = 'logout';
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg(TIPS.ERROR);
        }
    });
}

function checkToken() {
    $.ajax({
        url: URL.API_HOST + "/user/checkToken",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (res) {
            if (res.code == 200) {
                console.log(res.data)
            } else {
                clearInterval(task_checkToken);
                layer.confirm("登录信息已过期，是否重新登录？", {
                    icon: 3,
                    title: '温馨提示'
                }, function () {
                    top.location.href = 'logout';
                });

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg(TIPS.ERROR);
        }
    });
}

function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    // alert(sUserAgent);
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
        //移动端
    } else {//PC
        $("#versionMsg").removeAttr("href");
        $('#versionMsg').attr('layadmin-event', 'about');
    }
}