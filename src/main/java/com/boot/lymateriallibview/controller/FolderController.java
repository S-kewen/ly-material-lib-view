package com.boot.lymateriallibview.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @PackageName: com.boot.lymateriallibview.controller
 * @ClassName: FolderController
 * @Description: This is FolderController class by Skwen.
 * @Author: Skwen
 * @Date: 2021-06-19 22:02
 */
@Controller
@RequestMapping("/folder")
public class FolderController {
    @RequestMapping("/listFolderByPid")
    public String listFolderByPid() {
        return "folder/listFolderByPid";
    }

}
