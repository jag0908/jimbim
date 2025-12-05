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
        Optional<Member> memberEntity = smr.findById(shzzimdto.getMemberId());
        Optional<SH_post> postEntity = spr.findById(shzzimdto.getPostId());

        AlramZzim alramZzimEntity = new AlramZzim();
        alramZzimEntity.setMember(memberEntity.get());
        alramZzimEntity.setEndUserId(postEntity.get().getMember().getUserid());
        alramZzimEntity.setTargetId(postEntity.get().getPostId());
        alramZzimEntity.setTargetType("SH_POST");
        azr.save(alramZzimEntity);
    }

    public  List<ChatMsgDto> getUnreadMessages(Integer id) throws IllegalAccessException {
        List<ChatMsgDto> result = new ArrayList<>();
        List<ChatRoom> sellerChats = crr.findAllBySellerId(id).orElseThrow(() -> new IllegalAccessException("안읽은 구매 글이없음"));
        for(ChatRoom sellerChat : sellerChats) {
            for( ChatRoom_Msg chatMsg : sellerChat.getChatMsg()) {
                ChatMsgDto msgdto = new ChatMsgDto();
                msgdto.setMessageId(chatMsg.getMessage_id());
                msgdto.setContent(chatMsg.getContent());
                msgdto.setSenderId(chatMsg.getSenderId());
                msgdto.setIndate(chatMsg.getIndate());

                msgdto.setSellerReadMsg(chatMsg.getSellerReadMsg());
                msgdto.setBuyerReadMsg(chatMsg.getBuyerReadMsg());

                msgdto.setSellerId(sellerChat.getSellerId());
                msgdto.setSellerName(sellerChat.getSellerName());
                msgdto.setSellerProfileImg(sellerChat.getSellerProfileImg());
                msgdto.setBuyerId(sellerChat.getBuyerId());
                msgdto.setBuyerName(sellerChat.getBuyerName());
                msgdto.setBuyerProfileImg(sellerChat.getBuyerProfileImg());
                msgdto.setPostId(sellerChat.getPostId());
                msgdto.setPostTitle(sellerChat.getPostTitle());
                msgdto.setChatRoomId(sellerChat.getChatRoomId());

                result.add(msgdto);
            }
        }
        return result;
    }
}
