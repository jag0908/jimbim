package com.himedia.spserver.service;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.Mypage.SHOP_Order;
import com.himedia.spserver.entity.Mypage.SHOP_Orderdetail;
import com.himedia.spserver.entity.Mypage.SH_Orderdetail;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SH.SH_zzim;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import com.himedia.spserver.entity.SHOP.SHOP_zzim;
import com.himedia.spserver.repository.*;
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
    private final SH_OrderdetailRepository shodr;
    private final SHOP_OrderRepository shopor;
    private final SH_postRepository shpr;
    private final SHOP_postRepository shoppr;
    private final SH_zzimRepository shzr;
    private final SHOP_zzimRepository shopzr;

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

    public List<SH_Orderdetail> getShBuyingList(String memberId) {
        Member member = mr.findById(memberId).get();
        return shodr.findAllByMemberId(member);
    }

    public List<SHOP_Order> getShopBuyingList(String memberId) {
        Member member = mr.findById(memberId).get();
        return shopor.findAllByMemberId(member);
    }

    public List<SH_post> getShSellingList(String memberId) {
        Member member = mr.findById(memberId).get();
        return shpr.findAllByMember(member);
    }

    public List<SHOP_post> getShopSellingList(String memberId) {
        Member member = mr.findById(memberId).get();
        return shoppr.findAllByMember(member);
    }

    public List<SH_zzim> getShZzimList(String memberId) {
        Member member = mr.findById(memberId).get();
        return shzr.findAllByMember(member);
    }

    public List<SHOP_zzim> getShopZzimList(String memberId) {
        Member member = mr.findById(memberId).get();
        return shopzr.findAllByMember(member);
    }
}
