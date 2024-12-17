import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

// 로그인 
export const adminLogin = async (req, res) => {
    const { adminId, adminPw } = req.body;
    console.log(req.body);
    try {
      const admin = await prisma.admin.findUnique({
        where: { adminId },
      });
      if (!admin) {
        return res.status(401).json({ message: '해당 아이디는 존재하지 않습니다.' });
      } 
      const isPasswordValid = await bcrypt.compare(adminPw, admin.adminPw);
  
      if (isPasswordValid) {
          // 세션에 사용자 정보 저장
          req.session.admin = { adminId: admin.adminId };  // 세션에 유저 아이디 저장
          console.log(req.session);
          return res.status(200).json({ adminId });
      } else {
          return res.status(401).json({ message: '비밀번호를 다시 확인해 주세요.' });
      }
    } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '서버 연결에 문제가 발생했습니다.' });
        }
  };
  

// mainPage 데이터 송신
export const usersData = async (req,res) => {
    try{
        const usersData = await prisma.user.findMany({select: {
            favoritPlayer : true,
            selectedJob : true ,
            singleOrMarried : true ,
            advertisement : true ,
            createdAt : true
        }})
        if(usersData.length === 0){
            return res.status(404).send({message : '조회된 데이터가 없습니다.'})
        }
        res.status(200).send(usersData);
    } catch(error){
        console.log(error);
        res.status(404).send({message : error.message})
    }

}


// 로그아웃 API
export const adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return  res.status(500).json({ error: 'Failed to logout' });
    }
     res.status(200).json({ message: 'Logout successful' });
  });
};

  // 모든 user 조회

  export const usersAll =  async (req , res) => {
    const userList = await prisma.user.findMany()
    res.send(userList);
  };

  // 특정 user 조회
  
  export const userUnique = async (req, res) => {
    try {
      const { userId } = req.body; 
      if (!userId) {
        return res.status(400).json({ message: 'User ID가 필요합니다.' });
      }
      console.log(`조회할 유저 ID: ${userId}`);
      const user = await prisma.user.findUnique({
        where: { userId }, 
      });
      if (!user) {
        return res.status(404).json({ message: '해당 유저를 찾을 수 없습니다.' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('유저 조회 오류:', error);
      res.status(500).json({ message: '서버에 오류가 발생했습니다.' });
    }
  };
  