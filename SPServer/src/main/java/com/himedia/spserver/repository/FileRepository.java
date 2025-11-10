package com.himedia.spserver.repository;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.SH.SH_post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File,Integer> {

    List<File> findByShPost(SH_post shPost);

}
