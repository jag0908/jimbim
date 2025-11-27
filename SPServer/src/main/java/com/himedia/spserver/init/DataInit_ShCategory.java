package com.himedia.spserver.init;


import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.repository.Sh_categoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInit_ShCategory implements CommandLineRunner {

    private final Sh_categoryRepository scr;

    public DataInit_ShCategory(Sh_categoryRepository scr) {
        this.scr = scr;
    }

    @Override
    public void run(String... args) {
        if (scr.count() == 0) {
            initCategory();
        }
    }

    private void initCategory() {
        List<SH_Category> categories = List.of(
                new SH_Category(1, "상의"),
                new SH_Category(2, "아우터"),
                new SH_Category(3, "바지"),
                new SH_Category(4, "속옷"),
                new SH_Category(5, "샌들/슬리퍼"),
                new SH_Category(6 ,"스니커즈"),
                new SH_Category(7, "부츠"),
                new SH_Category(8, "목걸이/귀걸이"),
                new SH_Category(9, "팔찌/반지"),
                new SH_Category(10, "시계"),
                new SH_Category(11, "모자"),
                new SH_Category(12, "테크/전자"),
                new SH_Category(13, "뷰티"),
                new SH_Category(14, "가방"),
                new SH_Category(15, "책"),
                new SH_Category(16, "인형"),
                new SH_Category(17, "캠핑"),
                new SH_Category(18, "자동차"),
                new SH_Category(19, "취미"),
                new SH_Category(20, "기타")
        );

        scr.saveAll(categories);
    }
}