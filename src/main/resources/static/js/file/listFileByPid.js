var laydate = layui.laydate;
laydate.render({
    elem: '#selectTime',
    type: 'datetime',
    range: true,
    format: 'yyyy-MM-dd HH:mm:ss'
});
var grid = $("#tableView").bootstrapTable({
    url: URL.API_HOST + "/file/listFile",
    height: document.body.clientHeight * 0.821,
    method: "post",
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    pagination: true,
    pageList: [10, 20, 50, 100, 200, 500],
    sortable: false,
    sortName: "id",
    sortOrder: "desc",
    pageSize: 20,
    pageNumber: 1,
    queryParamsType: "undefined",
    striped: true,
    sidePagination: "server",
    ajaxOptions: {
        headers: {
            "Authorization": getCookie("token")
        }
    },
    columns: [{
        field: 'id',
        title: '编号',
        align: 'center',
        sortable: true,
        width: 50
    },
        {
            field: 'name',
            title: '文件名',
            align: 'center',
            width: 200,
            formatter: function (value, row, index) {
                return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
            }
        },
        {
            field: 'url',
            title: 'URL',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                return "<button class='btn btn-info btn-rounded btn-xs' name='urlCopy' data-clipboard-text='" + value + "'>预览</button>";
                // return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>复制</a>"
            }
        },
        {
            field: 'state',
            title: '状态',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button class='btn btn-primary btn-rounded btn-xs'>正常</a>";
                } else if (value == 2) {
                    return "<button class='btn btn-warning btn-rounded btn-xs'>停用</a>";
                } else {
                    return "<button class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        },
        {
            field: 'priority',
            title: '优先级',
            align: 'center',
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button class='btn btn-primary btn-rounded btn-xs'>低</a>";
                } else if (value == 2) {
                    return "<button class='btn btn-warning btn-rounded btn-xs'>中</a>";
                } else {
                    return "<button class='btn btn-danger btn-rounded btn-xs'>高</a>";
                }
            }
        },
        {
            field: 'keyword',
            title: '关键词',
            align: 'center',
            width: 150
            // formatter: function(value, row, index) {
            //     if (value === '' || value === undefined || value === null) {
            //         return "<button class='layui-btn layui-btn-xs layui-btn-radius layui-btn-disabled'>查看</button>"
            //     } else {
            //         return "<button onClick=\"layer.alert('" + value + "');\" class='btn btn-warning btn-rounded btn-xs'>查看</button>"
            //     }
            // }
        },
        {
            field: 'videoLength',
            title: '时长',
            align: 'center',
            width: 50
        },
        {
            field: 'remark',
            title: '备注',
            align: 'center',
            width: 200
        },
        {
            field: 'addTime',
            title: '创建时间',
            align: 'center',
            width: 180
        },
        {
            field: '',
            title: '操作',
            formatter: function (value, row, index) {
                let result = "";
                if (row.state === 1) {
                    result = result + "<button class='layui-btn layui-btn-xs layui-btn-primary' onClick='javascript:changeState(" + row.id + ",2)'>停用</button>";
                } else {
                    result = result + "<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState(" + row.id + ",1)'>启用</button>";
                }
                result += "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteOne(" + row.id + ")'>删除</button>";
                return result;
            }
        }],
    onLoadSuccess: function (res) {
        if (res.code != 200) {
            showTip(res.msg);
        }
    },
    onLoadError: function (status) {
        console.log(status);
        showErrorMsg(TIPS.ERROR);
    },
    responseHandler: function (res) {
        res.total = res.data.total;
        res.list = res.data.list;
        res.pageNum = res.data.pageNum;
        res.pageSize = res.data.pageSize;
        res.pages = res.data.pageSize;
        res.data.startRow = res.data.startRow;
        res.endRow = res.data.endRow;
        return res;
    },
    queryParams: queryParams
});

function reload() {
    grid.bootstrapTable('refresh');
}

function queryParams(params) {
    var pid = getUrlValue("pid");
    if (pid != '') {
        params.pid = pid;
    }
    var name = $("#name").val();
    if (name != '') {
        params.name = name;
    }
    var keyword = $("#keyword").val();
    if (keyword != '') {
        params.keyword = keyword;
    }
    var selectTime = $("#selectTime").val();
    if (selectTime != '') {
        let times = selectTime.split(" - ");
        if (times.length === 2) {
            params.startTime = times[0];
            params.endTime = times[1];
        }
    }
    var state = $("#state").val();
    if (state != '') {
        params.state = state;
    } else {
        params.state = 0;
    }
    var priority = $("#priority").val();
    if (priority != '') {
        params.priority = priority;
    } else {
        params.priority = 0;
    }
    return params;
}

function resetSearch() {
    $("#name").val('');
    $("#keyword").val('');
    $("#selectTime").val('');
    $("#state").val(0);
    $("#priority").val(0);
    grid.bootstrapTable('resetFormSearch');
}

function deleteOne(id) {
    showConfirm("温馨提示", "您确定要删除该文件吗？",
        function (index) {
            $.ajax({
                url: URL.API_HOST + "/file/deleteFile",
                type: "post",
                dataType: "json",
                data: "id=" + id,
                headers: {
                    'Authorization': getCookie("token")
                },
                success: function (res) {
                    if (res.code == 200) {
                        showMsg("删除成功");
                        layer.close(index);
                        reload();
                    } else {
                        showTip(res.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showTip(TIPS.ERROR);
                }
            })
        })
}

function changeState(id, state) {
    $.ajax({
        url: URL.API_HOST + "/file/changeState",
        type: "post",
        dataType: "json",
        data: "id=" + id + "&state=" + state,
        headers: {
            'Authorization': getCookie("token")
        },
        success: function (res) {
            if (res.code == 200) {
                showMsg("修改状态成功");
                reload();
            } else {
                showTip(res.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showTip(TIPS.ERROR);
        }
    })
}

var clipboard = new ClipboardJS('.btn');
clipboard.on('success',
    function (e) {
        console.log(e);
        showMsg("复制成功");
        if (e.trigger.name === "urlCopy") {
            window.open(e.text);
        }
    });
clipboard.on('error',
    function (e) {
        showTip("复制失败");
    });

function uploadFile() {
    layer.open({
        type: 2,
        anim: 1,
        title: "上传文件",
        content: 'uploadFileByPid?pid=' + getUrlValue("pid"),
        btn: ['确定', '取消'],
        btnAlign: 'c',
        resize: false,
        scrollbar: false,
        area: ['900px', '570px'],
        yes: function (index, layero) {
            const body = layer.getChildFrame('#popupLayer', index);
            const pid = getUrlValue("pid");
            const fileName = body.find("input[id='fileName']").val();
            const keyword = body.find("input[id='keyword']").val();
            const priority = body.find("select[id='priority']").val();
            const url = body.find("input[id='url']").val();
            const videoLength = body.find("label[id='videoLength']").text();
            const remark = body.find("textarea[id='remark']").val();
            if (!(pid > 0)) {
                showTip("请先选择一个项目");
                return false;
            }
            if (fileName === '') {
                showTip("文件名称不能为空");
                return false;
            }
            if (fileName.length > 255) {
                showTip("文件名称长度不能大于255");
                return false;
            }
            if (priority <= 0) {
                showTip("请先选择文件优先级");
                return false;
            }
            if (keyword.length > 2550) {
                showTip("关键词长度不能大于2550");
                return false;
            }
            if (url === '') {
                showTip("请先上传文件");
                return false;
            }
            if (url.length > 2550) {
                showTip("url长度不能大于2550");
                return false;
            }
            if (videoLength === undefined || videoLength === "") {
                showTip("正在获取视频长度,请稍后再试");
                return false;
            }
            if (remark.length > 2550) {
                showTip("备注长度不能大于2550");
                return false;
            }
            $.ajax({
                url: URL.API_HOST + "/file/addFile",
                type: "post",
                dataType: "json",
                data: "pid=" + pid + "&name=" + fileName + "&keyword=" + keyword + "&priority=" + priority + "&url=" + url + "&videoLength=" + videoLength + "&remark=" + remark,
                headers: {
                    'Authorization': getCookie("token")
                },
                success: function (res) {
                    if (res.code === 200) {
                        showMsg("新增文件成功");
                        layer.close(index);
                        reload();
                    } else {
                        showTip(res.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showErrorMsg(TIPS.ERROR);
                }
            })
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    })
}

function previewUrl(url) {
    window.open(url);
}