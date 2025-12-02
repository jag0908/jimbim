//package com.himedia.spserver.config;
//
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import org.springframework.ai.document.Document;
//import org.springframework.ai.transformer.splitter.TextSplitter;
//import org.springframework.ai.transformer.splitter.TokenTextSplitter;
//import org.springframework.ai.vectorstore.VectorStore;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.DependsOn;
//import org.springframework.core.io.Resource;
//import org.springframework.dao.DataAccessException;
//import org.springframework.jdbc.core.simple.JdbcClient;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Configuration
//@RequiredArgsConstructor
//@DependsOn("vectorStore")
//public class ShopLoader {
//
//    private final VectorStore vectorStore;
//    @Qualifier("postgresJdbcClient")
//    private final JdbcClient jdbcClient;
//
//
//    @Value("classpath:contract2.txt")
//    Resource resource;
//
//    @PostConstruct
//    public void init() throws IOException, InterruptedException {
//        Integer count = 0;
//
//        // 최대 3번 시도 (총 2초 대기)
//        int maxAttempts = 3;
//        for (int attempt = 0; attempt < maxAttempts; attempt++) {
//            try {
//                // 1. 쿼리 시도
//                count = jdbcClient.sql("select count(*) from shop_vector")
//                        .query(Integer.class)
//                        .single();
//                // 성공하면 루프 탈출
//                break;
//
//            } catch (DataAccessException e) {
//                // 테이블이 없거나 DB 연결 문제 (BadSqlGrammarException)
//                if (attempt < maxAttempts - 1) {
//                    System.out.println("Vector store table 'shop_vector' not found (Attempt " + (attempt + 1) + "). Waiting 1 second for schema initialization...");
//                    // 1초 대기 후 재시도
//                    Thread.sleep(1000);
//                } else {
//                    // 최종 시도까지 실패하면 오류를 발생시키고 종료
//                    System.err.println("Failed to access 'shop_vector' after " + maxAttempts + " attempts. Check DB configuration and initialization.");
//                    throw e;
//                }
//            }
//        }
//
//        System.out.println("No of Records in the PG Vector Store=" + count);
//        if (count == 0) {
//            // ... (기존 데이터 로딩 로직 유지)
//            List<Document> documents = Files.lines(resource.getFile().toPath())
//                    .map(Document::new)
//                    .collect(Collectors.toList());
//            TextSplitter textSplitter = new TokenTextSplitter();
//            for(Document document : documents) {
//                List<Document> splitteddocs = textSplitter.split(document);
//                System.out.println("before adding document: " + document.getText());
//                vectorStore.add(splitteddocs); //임베딩
//                System.out.println("Added document: " + document.getText());
//                Thread.sleep(100);
//            }
//            System.out.println("Application is ready to Serve the Requests");
//        }
//    }
//}
