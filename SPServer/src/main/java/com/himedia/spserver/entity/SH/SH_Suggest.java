package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class SH_Suggest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer suggest_id;
    private Integer suggest_price;

    private Integer postId;
    private Integer memberId;
    private String userId;
    private String memberName;
    private String memberProfileImg;

    @CreationTimestamp
    private Timestamp indate;
    @UpdateTimestamp
    private Timestamp uptime;

    private Integer approved = 0;
}
