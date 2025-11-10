package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Integer> {
    List<Address> findAllByMember(Member member);
}
