package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.SH.SH_post;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class STYLE_Posthash {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    STYLE_post postId;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    STYLE_Hashtag tagId;
}
