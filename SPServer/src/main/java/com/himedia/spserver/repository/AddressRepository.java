package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Integer> {
    List<Address> findAllByMember(Member member);

    Page<Address> findAllByMember(Member member, Pageable pageable);
}
