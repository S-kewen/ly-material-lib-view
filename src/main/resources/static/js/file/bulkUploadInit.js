$.ajax({
    url: URL.API_HOST + "/project/listProject",
    type: "post",
    dataType: "json",
    data: "pageNumber=1&pageSize=10000000&state=1",
    headers: {
        'Authorization': getCookie("token")
    },
    success: function (res) {
        if (res.code === 200) {
            if (res.data.list !== undefined) {
                for (var j = 0; j < res.data.list.length; j++) {
                    console.log(getUrlValue("pid"));
                    if (res.data.list[j].id == getUrlValue("pid")) {
                        console.log(res.data.list[j]);
                        $("#projectRemark").text(res.data.list[j].remark);
                    }
                }
            }
        } else {
            showTip(res.tip)
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        showErrorMsg(TIPS.ERROR)
    }
});