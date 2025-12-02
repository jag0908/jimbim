//package com.himedia.spserver.config;
//
//import jakarta.persistence.EntityManagerFactory;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.jdbc.DataSourceBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.core.simple.JdbcClient;
//import org.springframework.orm.jpa.JpaTransactionManager;
//import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
//import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
//import org.springframework.transaction.PlatformTransactionManager;
//import org.springframework.transaction.annotation.EnableTransactionManagement;
//
//import javax.sql.DataSource;
//import java.util.HashMap;
//
//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        basePackages = "com.himedia.spserver.postgresrepository",      // ★ MySQL용 Repository 패키지
//        entityManagerFactoryRef = "postgresEntityManagerFactory",
//        transactionManagerRef = "postgresTransactionManager"
//)
//public class PostgresJpaConfig {
//
//    //@Primary
//    @Bean(name = "postgresDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource.postgres") // ★ application.yml 매핑
//    public DataSource postgresDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//
//    @Bean(name = "postgresEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean postgresEntityManagerFactory(
//            @Qualifier("postgresDataSource") DataSource dataSource
//    ) {
//        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
//        factory.setDataSource(dataSource);
//        factory.setPackagesToScan("com.himedia.spserver.postgresentity"); // Postgres 엔티티 패키지
//        factory.setPersistenceUnitName("postgresPU");
//        factory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
//
//        // Postgres 전용 Hibernate 속성
//        HashMap<String, Object> props = new HashMap<>();
//        props.put("hibernate.hbm2ddl.auto", "update");
//        props.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
//        factory.setJpaPropertyMap(props);
//
//        return factory;
//    }
//
//    // PostgreSQL 전용 JdbcTemplate (VectorStore가 필요로 함)
//    @Bean(name = "postgresJdbcTemplate")
//    public JdbcTemplate postgresJdbcTemplate(@Qualifier("postgresDataSource") DataSource dataSource) {
//        return new JdbcTemplate(dataSource);
//    }
//
//    // PostgreSQL 전용 JdbcClient (ShopLoader가 필요로 함)
//    @Bean(name = "postgresJdbcClient")
//    public JdbcClient postgresJdbcClient(@Qualifier("postgresDataSource") DataSource dataSource) {
//        return JdbcClient.create(dataSource);
//    }
//
//    @Bean(name = "postgresTransactionManager")
//    public PlatformTransactionManager postgresTransactionManager(
//            @Qualifier("postgresEntityManagerFactory") EntityManagerFactory emf
//    ) {
//        return new JpaTransactionManager(emf);
//    }
//}
