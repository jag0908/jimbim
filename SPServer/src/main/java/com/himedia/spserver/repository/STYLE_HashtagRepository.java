package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_Hashtag;
import com.himedia.spserver.entity.STYLE.STYLE_Posthash;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface STYLE_HashtagRepository extends JpaRepository<STYLE_Hashtag, Integer> {
    Optional<STYLE_Hashtag> findByWord(String word);


}

