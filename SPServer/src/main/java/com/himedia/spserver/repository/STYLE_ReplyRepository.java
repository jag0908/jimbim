package com.himedia.spserver.repository;

import com.himedia.spserver.entity.STYLE.STYLE_Reply;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface STYLE_ReplyRepository extends JpaRepository<STYLE_Reply, Integer> {

    List<STYLE_Reply> findBySpost(STYLE_post post);

    int countBySpost(STYLE_post post);

    List<STYLE_Reply> findBySpost_SpostIdIn(List<Integer> spostIds);
}
