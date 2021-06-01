package com.boot.lymateriallibview.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @PackageName: com.boot.lymateriallibview.controller
 * @ClassName: MainController
 * @Description: This is MainController class by Skwen.
 * @Author: Skwen
 * @Date: 2021-06-02 0:00
 */
@Controller
public class MainController {
    @RequestMapping("/")
    public String main() {
        return "main/login";
    }
    @RequestMapping("/login")
    public String login() {
        return "main/login";
    }
    @RequestMapping("/logout")
    public String logout() {
        return "main/logout";
    }
    @RequestMapping("/index")
    public String index() {
        return "main/index";
    }
}
