package com.himedia.spserver.entity.Community;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class C_Reply {
    @Id
    private Integer reply_id;
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member_id;

    @ManyToOne
    @JoinColumn(name = "cpost_id")
    C_post cpost_id;
}
