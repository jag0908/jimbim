package com.himedia.spserver.service;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MypageService {

    private final AddressRepository ar;

    public void insertAddress(Address address) {
        ar.save(address);
    }
}
