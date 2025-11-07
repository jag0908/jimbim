package com.himedia.spserver.repository;

import com.himedia.spserver.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address,String> {
}
