package com.boot.lymateriallibview.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @PackageName: com.boot.lymateriallibview.controller
 * @ClassName: ProjectController
 * @Description: This is ProjectController class by Skwen.
 * @Author: Skwen
 * @Date: 2021-06-02 0:58
 */
@Controller
@RequestMapping("/project")
public class ProjectController {
    @RequestMapping("/listProject")
    public String listProject() {
        return "project/listProject";
    }
    @RequestMapping("/addProject")
    public String addProject() {
        return "project/addProject";
    }
}
