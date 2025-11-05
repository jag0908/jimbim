package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class SH_Suggest {
    @Id
    private Integer suggest_id;
    private Integer suggest_price;

    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SH_post post_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member_id;
}
