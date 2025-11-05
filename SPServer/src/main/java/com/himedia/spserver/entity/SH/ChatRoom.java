package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chat_room_id;

    // 판매자
    @ManyToOne
    @JoinColumn(name = "post_id")
    private SH_post seller;

    // 구매자
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member buyer;
}
