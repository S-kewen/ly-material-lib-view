var projectRemark = [];
var form = layui.form;
form.on('select(pid)',
    function (data) {
        $("#projectRemark").text(projectRemark[$('option:selected', '#pid').index() - 1])
    });
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
                var optionstring = "<option value='0' disabled>请先选择项目</option>";
                for (var j = 0; j < res.data.list.length; j++) {
                    optionstring += "<option value=\"" + res.data.list[j].id + "\" >" + res.data.list[j].name + " </option>";
                    projectRemark.push(res.data.list[j].remark)
                }
                if (res.data.list.length > 0 && projectRemark.length > 0) {
                    $("#projectRemark").text(projectRemark[0])
                }
                $("#pid").html(optionstring);
                form.render()
            }
        } else {
            showTip(res.tip)
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        showErrorMsg(TIPS.ERROR)
    }
});
$("#upload2").click(function () {
    $("#upload").trigger('click')
});
$(document).on('change', '#upload',
    function () {
        let file = document.getElementById('upload').files[0];
        $.ajax({
            url: URL.API_HOST + "/file/getSign",
            type: "post",
            dataType: "json",
            data: "length=" + file.size + "&saveKey=/" + getFileName(file.name),
            headers: {
                'Authorization': getCookie("token")
            },
            success: function (res) {
                if (res.code === 200) {
                    let url = res.data.url;
                    var formData = new FormData();
                    formData.append("policy", res.data.policy);
                    formData.append("authorization", res.data.sign);
                    formData.append("file", file);
                    var loading = layer.load(0, {
                        shade: false
                    });
                    $.ajax({
                        url: "http://v0.api.upyun.com" + res.data.uri,
                        type: "post",
                        data: formData,
                        dataType: "json",
                        processData: false,
                        contentType: false,
                        xhr: function () {
                            let xhr = new XMLHttpRequest();
                            xhr.upload.addEventListener('progress',
                                function (e) {
                                    console.log(e);
                                    let progressRate = (e.loaded / e.total) * 100;
                                    console.log(progressRate);
                                    if (progressRate >= 100) {
                                        $("#upload2").text("上传完毕")
                                    } else {
                                        $("#upload2").text("上传中(" + progressRate.toFixed(2) + "%)")
                                    }
                                });
                            return xhr
                        },
                        beforeSend: function (request) {
                        },
                        success: function (res) {
                            layer.close(loading);
                            if (res.code === 200) {
                                $("#fileName").val(file.name);
                                $("#url").val(url + res.url);
                                showMsg("上传成功")
                            } else {
                                showTip(res.message)
                            }
                        },
                        error: function (res) {
                            layer.close(loading);
                            console.log(res);
                            showTip(res.responseText)
                        }
                    })
                } else {
                    showTip(res.msg)
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showTip(TIPS.ERROR)
            }
        })
    });

function getFileName(str) {
    const end = str.substr(str.lastIndexOf(".") + 1);
    if (end != "" && end != undefined && end != null && str.indexOf(".") != -1) {
        return (new Date()).valueOf() + "." + end;
    } else {
        return (new Date()).valueOf();
    }

}