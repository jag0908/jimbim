package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.AlramShSuggest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlramShSuggestRepository extends JpaRepository<AlramShSuggest, Long> {

    List<AlramShSuggest> findAllByEndUserIdAndIsReadOrderByIndateDesc(Integer id, boolean isRead);
}
