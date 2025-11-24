package com.himedia.spserver.controller;

import com.himedia.spserver.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    AdminService as;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getMemberList")
    public HashMap<String, Object> getMemberList(@RequestParam("page") int page,
                                                 @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getMemberList(page, key);
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getShList")
    public HashMap<String, Object> getShList(@RequestParam("page") int page,
                                                 @RequestParam(value="key", required = false, defaultValue = "") String key){
        HashMap<String, Object> result = as.getShList(page, key);
        return result;
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/changeRoleAdmin")
    public HashMap<String,Object> changeRoleAdmin( @RequestParam("userid") String userid ){
        HashMap<String, Object> result = new HashMap<>();
        as.changeRoleAdmin(userid);
        result.put("msg", "ok");
        return result;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/changeRoleUser")
    public HashMap<String,Object> changeRoleUser( @RequestParam("userid") String userid ){
        HashMap<String, Object> result = new HashMap<>();
        as.changeRoleUser(userid);
        result.put("msg", "ok");
        return result;
    }

}
