package com.himedia.spserver.service;

import com.himedia.spserver.dto.*;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.AlramZzim;
import com.himedia.spserver.entity.SH.ChatRoom;
import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AlramService {

    private final ShMemberRepository smr;
    private final ShPostRepository spr;
    private final AlramZzimRepository azr;
    private final ChatRepository crr;
    private final ChatMsgRepository cmr;


    //정진
    public void insertAlramZzim(ShZzimDto shzzimdto) {
        Optional<Member> startMemberEntity = smr.findById(shzzimdto.getMemberId());
        Optional<SH_post> postEntity = spr.findById(shzzimdto.getPostId());

        AlramZzim alramZzimEntity = new AlramZzim();
        // 찜한사람의 id
        alramZzimEntity.setStartUserId(startMemberEntity.get().getUserid());
        alramZzimEntity.setStartUserProfileImg(startMemberEntity.get().getProfileImg());

        alramZzimEntity.setEndUserId(postEntity.get().getMember().getMember_id());

        alramZzimEntity.setTargetType("SH_POST");
        alramZzimEntity.setPostId(postEntity.get().getPostId());
        alramZzimEntity.setPostTitle(postEntity.get().getTitle());
        azr.save(alramZzimEntity);
    }

//    public  List<ChatMsgDto> getUnreadMessages(Integer id) {
//        List<ChatMsgDto> result = new ArrayList<>();
//        List<ChatRoom> sellerChats = crr.findAllBySellerId(id);
//        for(ChatRoom sellerChat : sellerChats) {
//            for( ChatRoom_Msg chatMsg : sellerChat.getChatMsg()) {
//                ChatMsgDto msgdto = new ChatMsgDto();
//                msgdto.setMessageId(chatMsg.getMessage_id());
//                msgdto.setContent(chatMsg.getContent());
//                msgdto.setSenderId(chatMsg.getSenderId());
//                msgdto.setIndate(chatMsg.getIndate());
//
//                msgdto.setSellerReadMsg(chatMsg.getSellerReadMsg());
//                msgdto.setBuyerReadMsg(chatMsg.getBuyerReadMsg());
//
//                msgdto.setSellerId(sellerChat.getSellerId());
//                msgdto.setSellerName(sellerChat.getSellerName());
//                msgdto.setSellerProfileImg(sellerChat.getSellerProfileImg());
//                msgdto.setBuyerId(sellerChat.getBuyerId());
//                msgdto.setBuyerName(sellerChat.getBuyerName());
//                msgdto.setBuyerProfileImg(sellerChat.getBuyerProfileImg());
//                msgdto.setPostId(sellerChat.getPostId());
//                msgdto.setPostTitle(sellerChat.getPostTitle());
//                msgdto.setChatRoomId(sellerChat.getChatRoomId());
//
//                msgdto.getShortContent();
//
//                result.add(msgdto);
//            }
//        }
//        result.sort((a, b) -> b.getIndate().compareTo(a.getIndate()));
//        return result;
//    }

    public List<ChatRoomUnreadDto> getUnreadMessages(Integer id) {
        List<ChatRoomUnreadDto> sellerChats = crr.findRoomsWithUnreadCount(id);

        System.out.println(sellerChats);
        return sellerChats;
    }

    public List<ChatRoomUnreadDto> getUnreadMyMessages(Integer id) {
        List<ChatRoomUnreadDto> buyerChats = crr.findRoomsWithUnreadCountByBuyer(id);

        System.out.println(buyerChats);
        return buyerChats;
    }

    public List<AlramZzimResDto> getMyPostZzim(Integer id) {
        List<AlramZzimResDto> result =  new ArrayList<>();
        List<AlramZzim> zzims = azr.findAllByEndUserIdOrderByIndateDesc(id);
        for(AlramZzim zzim : zzims) {
            AlramZzimResDto resDto = new AlramZzimResDto();
            resDto.setId(zzim.getId());
            resDto.setStartUserId(zzim.getStartUserId());
            resDto.setStartUserProfileImg(zzim.getStartUserProfileImg());
            resDto.setEndUserId(zzim.getEndUserId());
            resDto.setPostId(zzim.getPostId());
            resDto.setPostTitle(zzim.getPostTitle());
            resDto.setTargetType(zzim.getTargetType());
            resDto.setIsRead(zzim.getIsRead());
            resDto.setIndate(zzim.getIndate());
            result.add(resDto);
        }
        return result;
    }

    public void myPostZzimRead(Long id) {
        AlramZzim targetZzim = azr.findById(id).orElseThrow(() -> new IllegalArgumentException("존재X"));;
        targetZzim.setIsRead(true);
    }



}
