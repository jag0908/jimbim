package com.himedia.spserver.entity.Community;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "c_reply_like") // 테이블명 명확히 지정
public class C_Reply_Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer likenum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reply_id", nullable = false)
    private C_Reply reply;
}
