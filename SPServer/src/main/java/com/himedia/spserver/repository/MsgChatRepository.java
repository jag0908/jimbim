package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.ChatRoom;
import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MsgChatRepository extends JpaRepository<ChatRoom_Msg, Long> {

    @Query("SELECT m FROM ChatRoom_Msg m " +
            "JOIN FETCH m.chatRoom r " +
            "WHERE r.chatRoomId = :roomId " +
            "ORDER BY m.indate ASC")
    List<ChatRoom_Msg> findByChatRoomIdWithRoom(@Param("roomId") Integer roomId);

    List<ChatRoom_Msg> findAllByChatRoom_ChatRoomIdAndSellerReadMsg(Integer chatRoomId, int i);

    List<ChatRoom_Msg> findAllByChatRoom_ChatRoomIdAndBuyerReadMsg(Integer chatRoomId, int i);
}
