package com.himedia.spserver.controller;

import com.himedia.spserver.dto.ChatMsgDto;
import com.himedia.spserver.dto.ChatRoomDto;
import com.himedia.spserver.dto.ChatRoomUnreadDto;
import com.himedia.spserver.service.AlramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/alram")
@RequiredArgsConstructor
public class AlramController {

    private final AlramService alramService;

    @GetMapping("/chatMsg/{id}")
    public HashMap<String, Object> unreadMessages(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        List<ChatRoomUnreadDto> resdto = alramService.getUnreadMessages(id);
        result.put("resDto", resdto);
        return result;
    }

    @GetMapping("/chatMyMsg/{id}")
    public HashMap<String, Object> unreadMyMessages(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        List<ChatRoomUnreadDto> resdto = alramService.getUnreadMyMessages(id);
        result.put("resDto", resdto);
        return result;
    }

    @GetMapping("/myPostZzim/{id}")
    public HashMap<String, Object> getMyPostZzim(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            result.put("resDto", alramService.getMyPostZzim(id));
        } catch (Exception e) {
            result.put("msg", "비정상적인 요청입니다.");
            return result;
        }
        return result;
    }

    @PostMapping("/myPostZzimRead/{id}")
    public void myPostZzimRead(@PathVariable Long id) {
        alramService.myPostZzimRead(id);
    }

}
