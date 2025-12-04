package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "style_reply_like")
public class STYLE_Reply_Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_id", nullable = false)
    private STYLE_Reply reply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
