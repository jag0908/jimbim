package com.himedia.spserver.repository;

import com.himedia.spserver.entity.SHOP.SHOP_Product;
import com.himedia.spserver.entity.SHOP.SHOP_ProductOption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ShopProductOptionRepository extends JpaRepository<SHOP_ProductOption, Long> {
    @Query("select o from SHOP_ProductOption o where o.product.productId=:productId") // @JsonIgnore 어노테이션 때문에 쿼리문을 직접썼음
    List<SHOP_ProductOption> findByProduct_ProductId(@Param("productId") Long productId);
    @Query("select o from SHOP_ProductOption o where o.product.productId=:productId")
    Page<SHOP_ProductOption> findByProduct_ProductId(@Param("productId") Long productId, Pageable pageable);

    void deleteByProduct_ProductId(Long productId);     // 어드민 페이지 상품 삭제전 옵션의 삭제가 먼저 필요
}
