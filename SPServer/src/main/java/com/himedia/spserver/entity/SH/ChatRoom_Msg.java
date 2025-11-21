package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class ChatRoom_Msg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long message_id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    private String content;
    private Integer senderId;

    private Integer buyerReadMsg = 0;
    private Integer sellerReadMsg = 0;

    @CreationTimestamp
    private Timestamp indate;
}
