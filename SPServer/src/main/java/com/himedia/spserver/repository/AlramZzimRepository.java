package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.AlramZzim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlramZzimRepository extends JpaRepository<AlramZzim, Long> {

    List<AlramZzim> findAllByEndUserIdOrderByIndateDesc(Integer id);
}
