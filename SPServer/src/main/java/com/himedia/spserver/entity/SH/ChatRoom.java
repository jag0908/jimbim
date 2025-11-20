package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.repository.Query;

@Entity
@Data
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer chatRoomId;

    // 판매자
    @Column(nullable = false)
    private Integer sellerId;
    private String sellerName;
    private String sellerProfileImg;

    // 구매자
    @Column(nullable = false)
    private Integer buyerId;
    private String buyerName;
    private String buyerProfileImg;

    private Integer postId;
    private String postTitle;
}
