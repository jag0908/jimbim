package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<ChatRoom, Integer> {

    Optional<ChatRoom> findBySellerIdAndBuyerId(Integer sellerId, Integer buyerId);

    ChatRoom findByChatRoomId(Integer chatRoomId);

    List<ChatRoom> findAllBySellerId(Integer sellerId);
}
