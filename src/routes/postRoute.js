import express from "express";
import { getPostList , getPost, postWrite, PostAll } from "../controllers/postController.js";

const router = express.Router();


router.get('/All',PostAll);
// 게시판  : 공지사항 , 구단뉴스 , .utd 기자단 , 응원마당 데이터 불러오기
router.get('/List' , getPostList );
// 게시판 : 디페일 페이지
router.get('/:id' , getPost );
// 게시판 : 응원마당 user 게시글 작성
router.post('/write',postWrite);

export default router;