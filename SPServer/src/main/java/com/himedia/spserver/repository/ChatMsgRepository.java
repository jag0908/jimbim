package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMsgRepository extends JpaRepository<ChatRoom_Msg, Integer> {
}
