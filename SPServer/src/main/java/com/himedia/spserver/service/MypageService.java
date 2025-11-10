package com.himedia.spserver.service;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.repository.AddressRepository;
import com.himedia.spserver.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MypageService {

    private final AddressRepository ar;
    private final MemberRepository mr;

    public void insertAddress(Address address) {
        ar.save(address);
    }

    public List<Address> getAddressList(String memberId) {
        Member member = mr.findById(memberId).get();
        return ar.findAllByMember(member);
    }

    public void updateAddress(Address address) {
        Address updateAddress = ar.findById(address.getAddress_id()).get();
        updateAddress.setAddress_name(address.getAddress_name());
        updateAddress.setAddress_zipnum(address.getAddress_zipnum());
        updateAddress.setAddress_simple(address.getAddress_simple());
        updateAddress.setAddress_detail(address.getAddress_detail());
    }

    public void deleteAddress(Integer addressId) {
        ar.delete(ar.findById(addressId).get());
    }
}
