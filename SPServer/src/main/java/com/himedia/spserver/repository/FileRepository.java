package com.himedia.spserver.repository;

import com.himedia.spserver.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

    public interface FileRepository extends JpaRepository<File,Integer> {
}
