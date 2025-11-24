package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class STYLE_Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer like_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member memberid;

    @ManyToOne
    @JoinColumn(name = "spost_id")
    private STYLE_post spost;
}

