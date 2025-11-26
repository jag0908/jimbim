package com.himedia.spserver.entity.Community;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.util.List;

import java.sql.Timestamp;

@Entity
@Data
public class C_Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가
    private Integer replyId;
    private String content;
    @CreationTimestamp
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    private Boolean anonymous = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    @JsonIgnore
    Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cpost_id")
    @JsonIgnore
    C_post cpost;

    // ★ 대댓글용: 부모 댓글
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_reply_id")
    private C_Reply parentReply;

    // ★ 대댓글용: 자식 댓글
    @OneToMany(mappedBy = "parentReply", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<C_Reply> childReplies;

}
