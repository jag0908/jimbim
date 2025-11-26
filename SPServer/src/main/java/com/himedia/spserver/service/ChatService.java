package com.himedia.spserver.service;

import com.himedia.spserver.dto.ChatMsgDto;
import com.himedia.spserver.dto.ChatRoomDto;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.ChatLast_Msg;
import com.himedia.spserver.entity.SH.ChatRoom;
import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import com.himedia.spserver.repository.ChatRepository;
import com.himedia.spserver.repository.LastChatRepository;
import com.himedia.spserver.repository.MemberRepository;
import com.himedia.spserver.repository.MsgChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class ChatService {
    @Autowired
    private ChatRepository cr;
    @Autowired
    private MsgChatRepository mcr;
    @Autowired
    private MemberRepository mr;
    @Autowired
    private LastChatRepository lcr;

    public ChatRoomDto createChatRoom(ChatRoomDto reqDto) {

        // 1. 판매자+구매자 조합으로 기존 방 조회
        Optional<ChatRoom> chatRoomEntity =
                cr.findBySellerIdAndBuyerId(reqDto.getSellerId(), reqDto.getBuyerId());

        ChatRoomDto resDto = new ChatRoomDto();
        // 2. 이미 존재하면 그대로 반환
        if (chatRoomEntity.isPresent()) {
            ChatRoom room = chatRoomEntity.get();
            if(
                    !Objects.equals(room.getPostId(), reqDto.getPostId())  ||
                    !Objects.equals(room.getPostTitle(), reqDto.getPostTitle())
            ) {
                room.setPostId(reqDto.getPostId());
                room.setPostTitle(reqDto.getPostTitle());
                room.setSellerProfileImg(reqDto.getSellerProfileImg());
                room.setBuyerProfileImg(reqDto.getBuyerProfileImg());

                cr.save(room);
                resDto.setPostId(room.getPostId());
                resDto.setPostTitle(room.getPostTitle());
            }
            resDto.setChatRoomId(room.getChatRoomId());
            resDto.setBuyerId(room.getBuyerId());
            resDto.setBuyerName(room.getBuyerName());
            resDto.setBuyerProfileImg(room.getBuyerProfileImg());

            resDto.setSellerId(room.getSellerId());
            resDto.setSellerName(room.getSellerName());
            resDto.setSellerProfileImg(room.getSellerProfileImg());
            return resDto;
        }

        // 3. 없으면 새로 생성
        ChatRoom newRoom = new ChatRoom();
        newRoom.setBuyerId(reqDto.getBuyerId());
        newRoom.setBuyerName(reqDto.getBuyerName());
        newRoom.setBuyerProfileImg(reqDto.getBuyerProfileImg());
        newRoom.setSellerId(reqDto.getSellerId());
        newRoom.setSellerName(reqDto.getSellerName());
        newRoom.setSellerProfileImg(reqDto.getSellerProfileImg());
        newRoom.setPostId(reqDto.getPostId());
        newRoom.setPostTitle(reqDto.getPostTitle());


        ChatRoom savedRoom = cr.save(newRoom);

        // 4. 저장된 엔티티로 응답 구성
        resDto.setChatRoomId(savedRoom.getChatRoomId());
        resDto.setBuyerId(savedRoom.getBuyerId());
        resDto.setBuyerName(savedRoom.getBuyerName());
        resDto.setBuyerProfileImg(savedRoom.getBuyerProfileImg());
        resDto.setSellerId(savedRoom.getSellerId());
        resDto.setSellerName(savedRoom.getSellerName());
        resDto.setSellerProfileImg(savedRoom.getSellerProfileImg());
        resDto.setPostId(savedRoom.getPostId());
        resDto.setPostTitle(savedRoom.getPostTitle());

        // 5. 해당 채팅룸에 해당하는 라스트메시지 엔티티를 생성
        ChatLast_Msg lastMsgEntity = lcr.findByChatRoomId(resDto.getChatRoomId()).orElse(null);;
        if(lastMsgEntity == null) {
            ChatLast_Msg lastMsg = new ChatLast_Msg();
            lastMsg.setChatRoomId(resDto.getChatRoomId());
            lcr.save(lastMsg);
        }

        return resDto;
    }


    public ChatRoomDto detailChatRoom(ChatRoomDto reqDto) {
        ChatRoom viewChatRoomEntity = cr.findByChatRoomId(reqDto.getChatRoomId());
        if (viewChatRoomEntity == null) {
            throw new RuntimeException("존재하지 않는 채팅방입니다.");
        }

        Optional<Member> buyerInfo = mr.findById(viewChatRoomEntity.getBuyerId());
        Optional<Member> sellerInfo = mr.findById(viewChatRoomEntity.getSellerId());

        viewChatRoomEntity.setBuyerProfileImg(buyerInfo.get().getProfileImg());
        viewChatRoomEntity.setSellerProfileImg(sellerInfo.get().getProfileImg());

        ChatRoomDto resDto = new ChatRoomDto();
        resDto.setChatRoomId(viewChatRoomEntity.getChatRoomId());

        resDto.setBuyerId(viewChatRoomEntity.getBuyerId());
        resDto.setBuyerName(viewChatRoomEntity.getBuyerName());
        resDto.setBuyerProfileImg(viewChatRoomEntity.getBuyerProfileImg());

        resDto.setSellerId(viewChatRoomEntity.getSellerId());
        resDto.setSellerName(viewChatRoomEntity.getSellerName());
        resDto.setSellerProfileImg(viewChatRoomEntity.getSellerProfileImg());

        resDto.setPostId(viewChatRoomEntity.getPostId());
        resDto.setPostTitle(viewChatRoomEntity.getPostTitle());

        return  resDto;
    }


    public List<ChatRoomDto> getAllChatRoom(Map<String, Object> claims) {

        List<ChatRoomDto> result = new ArrayList<>();

        List<ChatRoom> chatRoomList = cr.findAllBySellerIdOrBuyerId((Integer) claims.get("member_id"), (Integer) claims.get("member_id"));

        for(ChatRoom chatRoom : chatRoomList) {
            Optional<Member> buyerInfo = mr.findById(chatRoom.getBuyerId());
            Optional<Member> sellerInfo = mr.findById(chatRoom.getSellerId());

            chatRoom.setBuyerProfileImg(buyerInfo.get().getProfileImg());
            chatRoom.setSellerProfileImg(sellerInfo.get().getProfileImg());

            ChatRoomDto resDto = new ChatRoomDto();
            resDto.setChatRoomId(chatRoom.getChatRoomId());
            resDto.setBuyerId(chatRoom.getBuyerId());
            resDto.setBuyerName(chatRoom.getBuyerName());
            resDto.setBuyerProfileImg(chatRoom.getBuyerProfileImg());
            resDto.setSellerId(chatRoom.getSellerId());
            resDto.setSellerName(chatRoom.getSellerName());
            resDto.setSellerProfileImg(chatRoom.getSellerProfileImg());
            resDto.setPostId(chatRoom.getPostId());
            resDto.setPostTitle(chatRoom.getPostTitle());

            // 라스트메시지
            ChatLast_Msg lastChatEntity = lcr.findByChatRoomId(chatRoom.getChatRoomId()).orElse(null);
            if(lastChatEntity != null) {
                resDto.setLastChatContent(lastChatEntity.getContent());
                resDto.setDate(lastChatEntity.getUpdateDate());
            }

            // 읽음 여부
            List<ChatRoom_Msg> sellers = mcr.findAllByChatRoom_ChatRoomIdAndSellerReadMsg(chatRoom.getChatRoomId(), 0);
            List<Integer> sellersArr =  new ArrayList<>();
            for(ChatRoom_Msg seller :sellers) {
                sellersArr.add(seller.getSellerReadMsg());
            }
            resDto.setSellerReadMsg(sellersArr);

            List<ChatRoom_Msg> buyers = mcr.findAllByChatRoom_ChatRoomIdAndBuyerReadMsg(chatRoom.getChatRoomId(), 0);
            List<Integer> buyersArr =  new ArrayList<>();
            for(ChatRoom_Msg buyer :buyers) {
                buyersArr.add(buyer.getBuyerReadMsg());
            }
            resDto.setBuyerReadMsg(buyersArr);

            result.add(resDto);
        }
        return result;
    }

    public ChatMsgDto insertMessage(Integer roomId, ChatMsgDto message) {
        ChatRoom room = cr.findById(roomId).orElseThrow(() -> new RuntimeException("방 없음"));

        ChatRoom_Msg chatEntity = new ChatRoom_Msg();
        chatEntity.setChatRoom(room);
        chatEntity.setContent(message.getContent());
        chatEntity.setSenderId(message.getSenderId());

        if(room.getSellerId().equals(message.getSenderId())) {
            chatEntity.setSellerReadMsg(1);
        }
        if(room.getBuyerId().equals(message.getSenderId())) {
            chatEntity.setBuyerReadMsg(1);
        }

        ChatRoom_Msg saved = mcr.save(chatEntity);

        // 3. 저장한 메시지 + 룸 정보 DTO 변환
        ChatMsgDto resDto = new ChatMsgDto();
        resDto.setChatRoomId(room.getChatRoomId());
        resDto.setContent(saved.getContent());
        resDto.setSenderId(saved.getSenderId());
        resDto.setIndate(saved.getIndate());
        resDto.setSellerReadMsg(saved.getSellerReadMsg());
        resDto.setBuyerReadMsg(saved.getBuyerReadMsg());

        // 룸 정보
        resDto.setSellerId(room.getSellerId());
        resDto.setSellerName(room.getSellerName());
        resDto.setSellerProfileImg(room.getSellerProfileImg());
        resDto.setBuyerId(room.getBuyerId());
        resDto.setBuyerName(room.getBuyerName());
        resDto.setBuyerProfileImg(room.getBuyerProfileImg());
        resDto.setPostId(room.getPostId());
        resDto.setPostTitle(room.getPostTitle());

        // 라스트 메세지의 룸id와 메시지id를 작성
        ChatLast_Msg last = lcr.findByChatRoomId(roomId).orElse(null);
        if (last != null) {
            last.setChatMsgId(saved.getMessage_id());
            last.setContent(saved.getContent());
            lcr.save(last);
        }



        return resDto;
    }

    public List<ChatMsgDto> getAllChatMessge(Integer roomId) {
        List<ChatMsgDto> result = new ArrayList<>();

        List<ChatRoom_Msg> msgWidthRooms = mcr.findByChatRoomIdWithRoom(roomId);

        for(ChatRoom_Msg msgWidthRoom: msgWidthRooms) {

            ChatRoom room = msgWidthRoom.getChatRoom();

            ChatMsgDto  resDto = new ChatMsgDto();

            resDto.setContent(msgWidthRoom.getContent());
            resDto.setSenderId(msgWidthRoom.getSenderId());
            resDto.setIndate(msgWidthRoom.getIndate());
            resDto.setSellerReadMsg(msgWidthRoom.getSellerReadMsg());
            resDto.setBuyerReadMsg(msgWidthRoom.getBuyerReadMsg());

            resDto.setChatRoomId(room.getChatRoomId());

            resDto.setSellerId(room.getSellerId());
            resDto.setSellerName(room.getSellerName());
            resDto.setSellerProfileImg(room.getSellerProfileImg());
            resDto.setBuyerId(room.getBuyerId());
            resDto.setBuyerName(room.getBuyerName());
            resDto.setBuyerProfileImg(room.getBuyerProfileImg());
            resDto.setPostId(room.getPostId());
            resDto.setPostTitle(room.getPostTitle());

            // 판매자가 보면 구매자가보낸 채팅들을 읽음
            if(resDto.getSenderId().equals(resDto.getSellerId())) {
                msgWidthRoom.setBuyerReadMsg(1);
                resDto.setBuyerReadMsg(1);
            }
            // 구매자가 보면 판매자가 보낸 채팅들을 읽음
            if(resDto.getSenderId().equals(resDto.getBuyerId())) {
                msgWidthRoom.setSellerReadMsg(1);
                resDto.setSellerReadMsg(1);
            }

            result.add(resDto);
        }

        return result;
    }

    public Integer getChatRoomCount(Integer postId) {
       List<ChatRoom> room = cr.findAllByPostId(postId);

        return room.size();
    }
}
