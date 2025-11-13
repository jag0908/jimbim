package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_Posthash;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface STYLE_PosthashRepository extends JpaRepository<STYLE_Posthash, Integer> {

    List<STYLE_Posthash> findByPostId(STYLE_post post);

    void deleteAllByPostId(STYLE_post post);
}
