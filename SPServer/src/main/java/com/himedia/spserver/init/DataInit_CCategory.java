package com.himedia.spserver.init;


import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.SH.SH_Category;
import com.himedia.spserver.repository.CCategoryRepository;
import com.himedia.spserver.repository.CommunityListRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInit_CCategory implements CommandLineRunner {

    private final CCategoryRepository cr;

    public DataInit_CCategory(CCategoryRepository cr) {
        this.cr = cr;
    }

    @Override
    public void run(String... args) {
        if (cr.count() == 0) {
            initCategory();
        }
    }

    private void initCategory() {
        List<C_Category> categories = List.of(
                new C_Category(0, "전체게시판", 0),
                new C_Category(1, "자유게시판", 1),
                new C_Category(2, "질문게시판", 2),
                new C_Category(3, "살말" ,3),
                new C_Category(4, "팔말", 4),
                new C_Category(5, "시세", 5),
                new C_Category(6 ,"정품 감정", 6),
                new C_Category(7, "핫딜", 7)
        );

        cr.saveAll(categories);
    }


}