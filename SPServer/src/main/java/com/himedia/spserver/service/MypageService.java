package com.himedia.spserver.service;

import com.himedia.spserver.dto.Paging;
import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.Mypage.SHOP_Order;
import com.himedia.spserver.entity.Mypage.SHOP_Orderdetail;
import com.himedia.spserver.entity.Mypage.SH_Orderdetail;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SH.SH_zzim;
import com.himedia.spserver.entity.SHOP.SHOP_BuyOrder;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import com.himedia.spserver.entity.SHOP.SHOP_zzim;
import com.himedia.spserver.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
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
    private final ShopBuyOrderRepository buyOrderRepository; //이삭 수정

    public void insertAddress(Address address) {
        ar.save(address);
    }

    public HashMap<String, Object> getAddressList(String memberId, int page) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        int count=0;
        Paging paging = new Paging();

        while(true){
            paging.setPage(page);
            count = ar.findAllByMember(member).size();
            paging.setTotalCount(count);
            paging.calPaging();

            Pageable pageable = PageRequest.of( page-1 , paging.getDisplayRow() , Sort.by(Sort.Direction.DESC, "addressId"));
            Page<Address> pageObj = ar.findAllByMember(member, pageable);

            if(!pageObj.getContent().isEmpty() || page==1) {
                result.put("addressList", pageObj.getContent());
                result.put("paging", paging);
                return result;
            }
            else page--;
        }
    }

    public void updateAddress(Address address) {
        Address updateAddress = ar.findById(address.getAddressId()).get();
        updateAddress.setAddress_name(address.getAddress_name());
        updateAddress.setAddress_zipnum(address.getAddress_zipnum());
        updateAddress.setAddress_simple(address.getAddress_simple());
        updateAddress.setAddress_detail(address.getAddress_detail());
    }

    public void deleteAddress(Integer addressId) {
        ar.delete(ar.findById(addressId).get());
    }

    public List<SH_Orderdetail> getShBuyingList(String memberId) {
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        return shodr.findAllByMemberId(member);
    }

    //이삭 수정
    public List<SHOP_BuyOrder> getShopBuyingList(String memberId) {
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        return buyOrderRepository.findAllByBuyer(member);
    }

    public List<SH_post> getShSellingList(String memberId) {
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        return shpr.findAllByMember(member);
    }

    public List<SHOP_post> getShopSellingList(String memberId) {
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        return shoppr.findAllByMember(member);
    }

    public List<SH_zzim> getShZzimList(String memberId) {
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        return shzr.findAllByMember(member);
    }

    public List<SHOP_zzim> getShopZzimList(String memberId) {
        Member member = mr.findById(Integer.parseInt(memberId)).get();
        return shopzr.findAllByMember(member);
    }
}
