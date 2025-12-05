package com.himedia.spserver.controller;

import com.himedia.spserver.dto.ChatMsgDto;
import com.himedia.spserver.dto.ChatRoomDto;
import com.himedia.spserver.service.AlramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/alram")
@RequiredArgsConstructor
public class AlramController {

    private final AlramService alramService;

    @GetMapping("/chatMsg/{id}")
    public HashMap<String, Object> unreadMessages(@PathVariable Integer id) throws IllegalAccessException {
        HashMap<String, Object> result = new HashMap<>();
        List<ChatMsgDto> resdto = alramService.getUnreadMessages(id);
        result.put("resDto", resdto);
        return result;
    }

    @GetMapping("/getMyPost")
    public HashMap<String, Object> getMyPost()  {
        HashMap<String, Object> result = new HashMap<>();

        return result;
    }

}
