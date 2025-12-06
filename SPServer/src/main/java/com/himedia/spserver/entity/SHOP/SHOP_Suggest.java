package com.himedia.spserver.entity.SHOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

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
    private Integer price;           // 가격, 수정 : 자료형 바꿈

    //@Column(columnDefinition = "DATETIME default now()")
    @CreationTimestamp              // 수정 : 날짜 기본값 안들어가는 오류 때문에 넣음
    private Timestamp indate;

    @ManyToOne
    @JoinColumn(name = "member_id")
    @JsonIgnore
    private Member member;


    // 업로드된 파일 리스트
    @OneToMany(mappedBy = "suggest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SHOP_File> files;
}
