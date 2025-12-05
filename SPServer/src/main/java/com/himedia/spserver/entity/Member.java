package com.himedia.spserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
// soft delete를 구현하는 어노테이션 (DB에서 값이 삭제되지 않고 대신 deleteyn값만 바뀜)
@SQLDelete(sql = "UPDATE member SET deleteyn = 'Y' WHERE member_id = ?")
@Where(clause = "deleteyn = 'N'")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer member_id;
    @Column(nullable = false, unique = true)
    private String userid;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String pwd;
    @ColumnDefault("'https://jimbimb.s3.ap-northeast-2.amazonaws.com/user.png'")
    private String profileImg;
    private String profileMsg;
    @Column(nullable = false)
    private String phone;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String rrn; //주민번호

    //@Column(nullable = false)
    @ColumnDefault("'N'")
    private String terms_agree;

    //@Column(nullable = false)
    @ColumnDefault("'N'")
    private String personal_agree;

    @ColumnDefault("'N'")
    private String deleteyn;

    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    //@Column(nullable = false)
    @ColumnDefault("'0'")
    private Integer blacklist;
    // 4: red, 3: orange 2: yellow, 1: green, 0: gray

    @Column(length = 50)
    private String provider;


    // 테이블의 리스트가 아니라 단순데이터(String, Integer 등)이라고 MySQL 에 알려주는 어너테이션
    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();
}
