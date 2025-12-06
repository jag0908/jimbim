package com.himedia.spserver.entity;

import com.himedia.spserver.dto.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 알림 받는 사람 */
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member receiver;

    /** 알림 보낸 사람 (누가 좋아요/댓글/팔로우 했는지) */
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private Member sender;

    /** 알림 타입 */
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    /** STYLE_post / C_post 등 알림이 연결된 게시글 ID */
    private Integer postId;

    /** 댓글 알림일 경우 연결된 댓글 ID */
    private Integer replyId;

    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
    private String linkUrl;

}

