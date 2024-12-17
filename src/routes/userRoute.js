 import express from 'express'
 import { userLogin, userSession , userLogout , userSignUp , userDuplicatecheck } from '../controllers/userController.js';

 const router = express.Router()


// 유저 시점.


// user login 라우터
router.post('/login' , userLogin );
// user logout 라우터
router.post('/logout', userLogout );
// 현재 로그인 상태 확인 ( 세션 정보 확인 ) 라우터
router.get('/session' , userSession );
// user signUp 라우터
router.post('/signUp' , userSignUp ) ;
// user id 중복확인  라우터
router.get('/duplicatecheck' , userDuplicatecheck );




export default router;
