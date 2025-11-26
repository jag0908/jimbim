package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SH.SH_zzim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShZzimRepository extends JpaRepository<SH_zzim, Integer> {


    Optional<SH_zzim> findByPostAndMember(SH_post postEntity, Member memberEntity);

    List<SH_zzim> findAllByPost(SH_post postEntity);

    Member post(SH_post post);

    List<SH_zzim> findAllByMember(Member member); //이삭 수정
}
