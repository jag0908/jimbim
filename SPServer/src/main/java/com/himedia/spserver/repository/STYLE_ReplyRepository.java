package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_Reply;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface STYLE_ReplyRepository extends JpaRepository<STYLE_Reply, Integer> {

    int countBySpost(STYLE_post post);
}
