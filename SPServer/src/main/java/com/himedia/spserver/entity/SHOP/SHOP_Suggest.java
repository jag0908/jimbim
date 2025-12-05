package com.himedia.spserver.entity.SHOP;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
public class SHOP_Suggest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suggest_id")
    private Integer suggestId;

    private String title;          // 제목
    private String content;        // 내용
    private String price;

    @Column(columnDefinition = "DATETIME default now()")
    private Timestamp indate;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member_id;

    // 업로드된 파일 리스트
    @OneToMany(mappedBy = "suggest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SHOP_File> files;
}
