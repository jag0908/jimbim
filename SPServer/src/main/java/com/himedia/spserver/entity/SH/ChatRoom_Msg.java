package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class ChatRoom_Msg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long message_id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chat_room_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member sender;

    @Column(nullable = false)
    private String content;

    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
}
