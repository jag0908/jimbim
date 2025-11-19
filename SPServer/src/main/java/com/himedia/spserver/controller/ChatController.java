package com.himedia.spserver.controller;

import com.amazonaws.Request;
import com.himedia.spserver.dto.ChatMsgDto;
import com.himedia.spserver.dto.ChatRoomDto;
import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import com.himedia.spserver.security.util.CustomJWTException;
import com.himedia.spserver.security.util.JWTUtil;
import com.himedia.spserver.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatService cs;

    @PostMapping("/chat/createChatRoom")
    public HashMap<String, Object>  createChatRoom(@RequestBody ChatRoomDto reqDto) {
        HashMap<String, Object> result = new HashMap<>();
        if(reqDto.getSellerId().equals(reqDto.getBuyerId())) {
            result.put("msg", "notOk");
            return result;
        }

        ChatRoomDto resDto = cs.createChatRoom(reqDto);

        result.put("msg", "ok");
        result.put("resDto", resDto);
        return result;
    }

    @GetMapping("/chat/detailChatRoom/{chatRoomId}")
    public HashMap<String, Object> detailChatRoom(@PathVariable("chatRoomId") Integer chatRoomId) {
        HashMap<String, Object> result = new HashMap<>();

        ChatRoomDto reqDto = new ChatRoomDto();
        reqDto.setChatRoomId(chatRoomId);
        ChatRoomDto resDto = cs.detailChatRoom(reqDto);

        result.put("msg", "ok");
        result.put("resDto", resDto);
        return result;
    }
    @GetMapping("/chat/chatRoomList")
    public HashMap<String, Object> chatRoomList(
            @RequestHeader("Authorization") String authHeader
    ) throws CustomJWTException {
        HashMap<String, Object> result = new HashMap<>();

        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);
        List<ChatRoomDto> resDto = cs.getAllChatRoom(claims);

        result.put("msg", "ok");
        result.put("resDto", resDto);
        return result;
    }

    @GetMapping("/chat/chatMessage")
    public HashMap<String, Object> chatMessage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("roomId") Integer roomId,
            @RequestParam("loginId") Integer loginId
    ) throws CustomJWTException {
        HashMap<String, Object> result = new HashMap<>();

        String token = authHeader.replace("Bearer ", "");
        Map<String, Object> claims = JWTUtil.validateToken(token);
        if(claims.get("member_id") != loginId) {
            result.put("msg", "notOk");
            return result;
        }

        List<ChatMsgDto> resDto = cs.getAllChatMessge(roomId);
        result.put("resDto", resDto);
        return result;
    }








    @MessageMapping("/send/{roomId}")
    //@MessageMapping으로 처리한 후 메서드의 반환값을 특정 목적지로 보내도록 지정합니다.
    @SendTo("/sub/messages/{roomId}")
    public ChatMsgDto sendMessage(@DestinationVariable Integer roomId, ChatMsgDto message) {
        System.out.println(
                "roomId:" + roomId +
                "message: " +  message.getContent() +
                "sender:" + message.getSenderId()
        );

        cs.insertMessage(roomId, message);

        return message;
    }
}
