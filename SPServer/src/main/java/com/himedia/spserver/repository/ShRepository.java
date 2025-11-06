package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;

public interface ShRepository extends JpaRepository<SH_post, Integer
        > {
    ArrayList<SH_post> findAllByPost_id();
}
