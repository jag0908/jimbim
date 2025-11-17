package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class STYLE_Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reply_id;
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member memberid;

    @ManyToOne
    @JoinColumn(name = "spost_id")
    STYLE_post spost;

    // 부모 댓글
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private STYLE_Reply parent;

    // 대댓글 가져오기
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<STYLE_Reply> children = new ArrayList<>();
}
