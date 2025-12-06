package com.himedia.spserver.entity.SHOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
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

    private String isAccept;    // 추가 : 요청 수락/거절 여부, 처음엔(관리자가 확인전에는) 빈값, 이후 Y 또는 N 으로 값이 들어가게됨

    @ManyToOne
    @JoinColumn(name = "member_id")
    //@JsonIgnore                   // 수정 : 어드민 페이지에서 요청자 정보를 불러올수가 없음,
    // 만약 JsonIgnore를 써야하는 상황이 있었더라도 JsonIgnore가 아닌 다른 방법을 써야 할것 같음
    private Member member;


    // 업로드된 파일 리스트
    @OneToMany(mappedBy = "suggest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SHOP_File> files;
}
