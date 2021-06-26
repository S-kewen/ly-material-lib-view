$(document).on('change', '#upload',
    function () {
        let files = document.getElementById('upload').files;
        for (i = 0; i < files.length; i++) {
            console.log(files[i]);
            uploadFile(insertItem("<tr><td>" + files[i].name + "</td><td>" + getSize(files[i].size) + "</td><td>0</td><td>0%</td><td>初始化</td></tr>"), files[i]);
        }
    });

function getSuffix(filename) {
    if (!filename || typeof filename != 'string') {
        return false
    }
    ;
    let a = filename.split('').reverse().join('');
    let b = a.substring(0, a.search(/\./)).split('').reverse().join('');
    return b
};

function getSize(length) {
    if (length >= 1024 * 1024 * 1024 * 1024) {
        return (length / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB";
    } else if (length >= 1024 * 1024 * 1024) {
        return (length / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    } else if (length >= 1024 * 1024) {
        return (length / (1024 * 1024)).toFixed(2) + "MB";
    } else if (length >= 1024) {
        return (length / 1024).toFixed(2) + "KB";
    } else {
        return (length).toFixed(2) + "B";
    }
}


function getFileType(str) {
    return str.substr(str.lastIndexOf(".") + 1);
}

function getFileName(str) {
    const end = str.substr(str.lastIndexOf(".") + 1);
    if (end != "" && end != undefined && end != null && str.indexOf(".") != -1) {
        return (new Date()).valueOf() + "." + end;
    } else {
        return (new Date()).valueOf();
    }
}

function uploadFile(index, file) {
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
                let formData = new FormData();
                formData.append("policy", res.data.policy);
                formData.append("authorization", res.data.sign);
                formData.append("file", file);
                updateItem(index, 4, "上传中");
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
                                updateItem(index, 3, progressRate.toFixed(2) + "%");
                            });
                        return xhr;
                    },
                    beforeSend: function (request) {
                        console.log(index);
                    },
                    success: function (res) {
                        if (res.code === 200) {
                            updateItem(index, 4, "处理中");
                            if (getFileType(file.name) === "mp4") {
                                let audio = new Audio(url + res.url);
                                audio.addEventListener("loadedmetadata", function (e) {
                                    console.log(e);
                                    updateItem(index, 2, audio.duration + "S");
                                    $.ajax({
                                        url: URL.API_HOST + "/file/addFile",
                                        type: "post",
                                        dataType: "json",
                                        data: "pid=" + getUrlValue("pid") + "&fid=" + getUrlValue("fid") + "&name=" + file.name + "&keyword=" + getUrlValue("keyword") + "&priority=" + getUrlValue("priority") + "&url=" + url + res.url + "&videoLength=" + parseInt(audio.duration) + "&remark=" + getUrlValue("remark"),
                                        headers: {
                                            'Authorization': getCookie("token")
                                        },
                                        success: function (res) {
                                            if (res.code === 200) {
                                                updateItem(index, 4, "处理完毕");
                                            } else {
                                                updateItem(index, 4, res.msg);
                                            }
                                        },
                                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                                            updateItem(index, 4, TIPS.ERROR);
                                        }
                                    });
                                });
                            } else {
                                $.ajax({
                                    url: URL.API_HOST + "/file/addFile",
                                    type: "post",
                                    dataType: "json",
                                    data: "pid=" + getUrlValue("pid") + "&fid=" + getUrlValue("fid") + "&name=" + file.name + "&keyword=" + getUrlValue("keyword") + "&priority=" + getUrlValue("priority") + "&url=" + url + res.url + "&videoLength=0&remark=" + getUrlValue("remark"),
                                    headers: {
                                        'Authorization': getCookie("token")
                                    },
                                    success: function (res) {
                                        if (res.code === 200) {
                                            updateItem(index, 4, "处理完毕");
                                        } else {
                                            updateItem(index, 4, res.msg);
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        updateItem(index, 4, TIPS.ERROR);
                                    }
                                });
                            }
                        } else {
                            updateItem(index, 4, res.message);
                        }
                    },
                    error: function (res) {
                        console.log(res);
                        updateItem(index, 4, res.responseText);
                    }
                })
            } else {
                updateItem(index, 4, res.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            updateItem(index, 4, TIPS.ERROR);
        }
    });
}
function insertItem(trHtml) {
    let $tr = $("#filesTable tr").eq(-1);
    console.log($tr.after(trHtml));
    console.log($tr);
    return $tr.prevObject.length;
}

function updateItem(index, field, val) {
    $("#filesTable tr:eq(" + index + ")").children('td').eq(field).text(val);
}