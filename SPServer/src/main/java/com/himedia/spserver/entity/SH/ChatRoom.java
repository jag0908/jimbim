package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(
            mappedBy = "chatRoom",
            cascade = CascadeType.ALL,   // 저장/수정/삭제 모두 전이
            orphanRemoval = true,        // 관계 끊기면 자식도 삭제
            fetch = FetchType.LAZY       // 지연 로딩
    )
    private List<ChatRoom_Msg> chatMsg = new ArrayList<>();;

}
