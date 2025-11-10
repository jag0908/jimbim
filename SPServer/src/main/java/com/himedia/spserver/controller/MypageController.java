package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.service.MypageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/mypage")
public class MypageController {

    @Autowired
    MypageService mys;

    @PostMapping("/insertAddress")
    public HashMap<String, Object> insertAddress(@RequestBody Address address) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("insertAddress : "+address);
        mys.insertAddress( address );
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/updateAddress")
    public HashMap<String, Object> updateAddress(@RequestBody Address address) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("updateAddress : "+address);
        mys.updateAddress( address );
        result.put("msg", "ok");
        return result;
    }

    @GetMapping("/getAddressList")
    public HashMap<String, Object> getAddressList(@RequestParam("member_id") String member_id) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("getAddress : "+ mys.getAddressList( member_id ));
        result.put("addressList", mys.getAddressList( member_id ));
        return result;
    }

    @DeleteMapping("/deleteAddress")
    public HashMap<String, Object> deleteAddress(@RequestParam("address_id") Integer address_id) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("deleteAddress : "+ address_id);
        mys.deleteAddress( address_id );
        result.put("msg", "ok");
        return result;
    }
}
