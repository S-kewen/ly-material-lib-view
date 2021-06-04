package com.boot.lymateriallibview.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @PackageName: com.boot.lymateriallibview.controller
 * @ClassName: FileController
 * @Description: This is FileController class by Skwen.
 * @Author: Skwen
 * @Date: 2021-06-02 5:58
 */
@Controller
@RequestMapping("/file")
public class FileController {
    @RequestMapping("/listFile")
    public String listFile() {
        return "file/listFile";
    }
    @RequestMapping("/uploadFile")
    public String uploadFile() {
        return "file/uploadFile";
    }
    @RequestMapping("/editFile")
    public String editFile() {
        return "file/editFile";
    }
}
