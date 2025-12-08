package com.himedia.spserver.init;

import com.himedia.spserver.entity.SHOP.SHOP_Category;
import com.himedia.spserver.repository.ShopCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInit_ShopCategory implements CommandLineRunner {

    private final ShopCategoryRepository sr;

    // 생성자 주입
    public DataInit_ShopCategory(ShopCategoryRepository sr) {
        this.sr = sr;
    }

    @Override
    public void run(String... args) throws Exception {
        // DB에 카테고리가 없으면 초기화
        if (sr.count() == 0) {
            initCategory();
        }
    }

    private void initCategory() {
        List<SHOP_Category> categories = List.of(
                new SHOP_Category(1L, "상의"),
                new SHOP_Category(2L, "아우터"),
                new SHOP_Category(3L, "바지"),
                new SHOP_Category(4L, "속옷"),
                new SHOP_Category(5L, "샌들/슬리퍼"),
                new SHOP_Category(6L, "스니커즈"),
                new SHOP_Category(7L, "부츠"),
                new SHOP_Category(8L, "목걸이/귀걸이"),
                new SHOP_Category(9L, "팔찌/반지"),
                new SHOP_Category(10L, "시계"),
                new SHOP_Category(11L, "모자"),
                new SHOP_Category(12L, "테크/전자"),
                new SHOP_Category(13L, "뷰티"),
                new SHOP_Category(14L, "가방"),
                new SHOP_Category(15L, "책"),
                new SHOP_Category(16L, "인형"),
                new SHOP_Category(17L, "캠핑"),
                new SHOP_Category(18L, "자동차"),
                new SHOP_Category(19L, "취미"),
                new SHOP_Category(20L, "기타")
        );

        sr.saveAll(categories);
    }
}
