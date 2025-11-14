package com.himedia.spserver.entity.Community;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class C_Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer like_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @ManyToOne
    @JoinColumn(name = "cpost_id")
    C_post cpost;
}
