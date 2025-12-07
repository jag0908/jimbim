package com.himedia.spserver.entity.SHOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer file_id;

    private String fileName;   // 서버에 저장된 파일명
    private String filePath;   // 경로

    @ManyToOne
    @JoinColumn(name = "suggest_id")
    @JsonIgnore // SHOP_Suggest에도 OneToMany가 둘다 있어서 suggest >> file >> suggest >> ... 순으로 계속찾는 무한루프 오류때문에 넣음
    // SHOP_File을 먼저 찾고 SHOP_Suggest를 외래키로 찾는 경우에서는 오류가 생길지는 모르겠으나 그럴일은 없다고 생각함
    private SHOP_Suggest suggest;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonIgnore //  추가
    private SHOP_post post;
}
