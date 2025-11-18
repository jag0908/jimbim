package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_zzim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SH_zzimRepository extends JpaRepository<SH_zzim,Integer> {
    List<SH_zzim> findAllByMember(Member member);
}
