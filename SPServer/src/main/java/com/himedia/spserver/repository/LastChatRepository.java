package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.ChatLast_Msg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LastChatRepository extends JpaRepository<ChatLast_Msg, Integer> {


    Optional<ChatLast_Msg> findByChatRoomId(Integer roomId);
}
