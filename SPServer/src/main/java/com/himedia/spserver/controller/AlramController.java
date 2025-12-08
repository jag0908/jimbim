package com.himedia.spserver.controller;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.AllAlram;
import com.himedia.spserver.entity.SH.AlramZzim;
import com.himedia.spserver.repository.AllAlramRepository;
import com.himedia.spserver.service.AlramService;
import com.himedia.spserver.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/alram")
@RequiredArgsConstructor
public class AlramController {

    private final AlramService alramService;
    private final NotificationService notificationService;

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

    @GetMapping("/myPostSuggest/{id}")
    public HashMap<String, Object> getMyPostSuggest(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            result.put("resDto", alramService.getMyPostSuggest(id));
        } catch (Exception e) {
            result.put("msg", "비정상적인 요청입니다.");
            return result;
        }
        return result;
    }

    @PostMapping("/myPostSuggest/{id}")
    public void myPostSuggest(@PathVariable Long id) {alramService.getNyPostSuggestRead(id);}


    private final AllAlramRepository allalramrepository;
    @GetMapping("/allAlram/{id}")
    public HashMap<String, Object> getMyAllAlram(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();
        List<UnifiedAlramDto> allList = new ArrayList<>();

        List<AlramZzimResDto> zzim_resdto = alramService.getMyPostZzim(id);
        for(AlramZzimResDto zzim :zzim_resdto) {allList.add(new UnifiedAlramDto("ZZIM", zzim.getId(), zzim.getStartUserId() + "님이 '" + zzim.getPostTitle() + "' 게시물에 찜 하셨습니다.", zzim.getStartUserProfileImg(), zzim.getEndUserId(), zzim.getIsRead(), zzim.getIndate(), "/sh-page/sh-view/" + zzim.getPostId()));}
        List<AlramShSuggestResDto> suggest_resdto = alramService.getMyPostSuggest(id);
        for(AlramShSuggestResDto suggest :suggest_resdto) {allList.add(new UnifiedAlramDto("SUGGEST", suggest.getId(), suggest.getStartUserId() + "님이 '" + suggest.getPostTitle() + "' 게시물에" + suggest.getPrice() + "원으로 가격제안 하셨습니다.", suggest.getStartUserProfileImg(), suggest.getEndUserId(), suggest.getIsRead(), suggest.getIndate(), "/sh-page/sh-view/" + suggest.getPostId()));}
        List<ChatRoomUnreadDto> chat_resdto = alramService.getUnreadMessages(id);
        for(ChatRoomUnreadDto chat :chat_resdto) {allList.add(new UnifiedAlramDto("CHAT", null, chat.getBuyerName(), chat.getBuyerProfileImg(), chat.getSellerId(), chat.getUnreadCount() > 0 ? false : true, chat.getLastTime(), "/sh-page/sh-view/" + chat.getPostId()));}
        List<ChatRoomUnreadDto> mychat_resdto = alramService.getUnreadMyMessages(id);
        for(ChatRoomUnreadDto mychat :mychat_resdto) {allList.add(new UnifiedAlramDto("MYCHAT", null, mychat.getSellerName(), mychat.getSellerProfileImg(), mychat.getBuyerId(), mychat.getUnreadCount() > 0 ? false : true, mychat.getLastTime(), "/sh-page/sh-view/" + mychat.getPostId()));}
        List<NotificationDTO> noti_resdto = notificationService.getNotifications(id);
        for(NotificationDTO noti :noti_resdto) {allList.add(new UnifiedAlramDto("NOTI", noti.getId(), noti.getMessage(), noti.getSenderProfileImg(), id, noti.isRead(), Timestamp.valueOf(noti.getTime()), noti.getLinkUrl()));}

        allList.sort(
                Comparator.comparing(UnifiedAlramDto::getIndate).reversed()
        );
        result.put("resDto", allList);

        return result;
    };

    @GetMapping("/allAlramCount/{id}")
    public HashMap<String, Object> allAlramCount(@PathVariable Integer id) {
        HashMap<String, Object> result = new HashMap<>();

        List<AlramZzimResDto> zzim_resdto = alramService.getMyPostZzim(id);
        List<AlramShSuggestResDto> suggest_resdto = alramService.getMyPostSuggest(id);
        List<ChatRoomUnreadDto> chat_resdto = alramService.getUnreadMessages(id);
        int chatCount = 0;
        for (ChatRoomUnreadDto z : chat_resdto) {
            if (z.getUnreadCount() > 0) {
                chatCount++;
            }
        }
        List<ChatRoomUnreadDto> mychat_resdto = alramService.getUnreadMyMessages(id);
        int mychatCount = 0;
        for (ChatRoomUnreadDto z : mychat_resdto) {
            if (z.getUnreadCount() > 0) {
                mychatCount++;
            }
        }
        List<NotificationDTO> noti_resdto = notificationService.getNotifications(id);

        result.put("alram", zzim_resdto.size() + suggest_resdto.size() + chatCount + mychatCount + noti_resdto.size());
        return result;
    }

}
