package com.himedia.spserver.dto;

import java.sql.Timestamp;

public class CommunityViewDTO {
    private Integer cpostId;
    private String title;
    private String content;
    private String cImage;
    private Integer readcount;
    private String categoryName;
    private String userid;
    private Timestamp indate;

    public CommunityViewDTO(Integer cpostId, String title, String content, String cImage,
                            Integer readcount, String categoryName, String userid, Timestamp indate) {
        this.cpostId = cpostId;
        this.title = title;
        this.content = content;
        this.cImage = cImage;
        this.readcount = readcount;
        this.categoryName = categoryName;
        this.userid = userid;
        this.indate = indate;
    }

    // getter, setter
    public Integer getCpostId() { return cpostId; }
    public void setCpostId(Integer cpostId) { this.cpostId = cpostId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getCImage() { return cImage; }
    public void setCImage(String cImage) { this.cImage = cImage; }
    public Integer getReadcount() { return readcount; }
    public void setReadcount(Integer readcount) { this.readcount = readcount; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getUserid() { return userid; }
    public void setUserid(String userid) { this.userid = userid; }
    public Timestamp getIndate() { return indate; }
    public void setIndate(Timestamp indate) { this.indate = indate; }
}
