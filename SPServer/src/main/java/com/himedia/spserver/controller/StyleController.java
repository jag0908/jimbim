package com.himedia.spserver.controller;


import com.himedia.spserver.dto.StylePostDTO;
import com.himedia.spserver.service.StyleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/style")
@RequiredArgsConstructor
public class StyleController {

    private final StyleService styleService;

    @GetMapping("/posts")
    public List<StylePostDTO> getAllPosts(){
        return styleService.getAllPosts();
    }

    @GetMapping("/post/{id}")
    public StylePostDTO getPost(@PathVariable Integer id){
        return styleService.getPostDetail(id);
    }


}
