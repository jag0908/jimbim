package com.himedia.spserver.entity.SH;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class ChatLast_Msg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true)
    private Integer chatRoomId;
    @Column(unique = true)
    private Long chatMsgId;
    private String content;
    @UpdateTimestamp
    private Timestamp updateDate;
}
