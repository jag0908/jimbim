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
                new SHOP_Category(1, "상의"),
                new SHOP_Category(2, "아우터"),
                new SHOP_Category(3, "바지"),
                new SHOP_Category(4, "속옷"),
                new SHOP_Category(5, "샌들/슬리퍼"),
                new SHOP_Category(6, "스니커즈"),
                new SHOP_Category(7, "부츠"),
                new SHOP_Category(8, "목걸이/귀걸이"),
                new SHOP_Category(9, "팔찌/반지"),
                new SHOP_Category(10, "시계"),
                new SHOP_Category(11, "모자"),
                new SHOP_Category(12, "테크/전자"),
                new SHOP_Category(13, "뷰티"),
                new SHOP_Category(14, "가방"),
                new SHOP_Category(15, "책"),
                new SHOP_Category(16, "인형"),
                new SHOP_Category(17, "캠핑"),
                new SHOP_Category(18, "자동차"),
                new SHOP_Category(19, "취미"),
                new SHOP_Category(20, "기타")
        );

        sr.saveAll(categories);
    }
}
