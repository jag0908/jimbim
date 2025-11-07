package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class STYLE_Reply {
    @Id
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
}
