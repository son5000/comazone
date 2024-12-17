import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PostAll = async (req,res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).send(posts);
  }catch(error){
    console.log(error);
  }
}


// 게시물목록 데이터 제공

export const getPostList = async (req, res) => {
  const { offset, count, type } = req.query;  

  try {
    const totalPostCount = await prisma.post.count({
      where : {type}
    })
    const posts = await prisma.post.findMany({
      where: { type },  
      orderBy: {
        createdAt: 'desc',  
      },
      skip: parseInt(offset),  
      take: parseInt(count),  
    });
    if (posts.length === 0 || totalPostCount < 1) {
      return res.status(404).send({ message: '조회된 데이터가 없습니다.' });
    } else {
      return res.status(200).send({
        posts,
        totalPostCount
      }); 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: '서버 오류가 발생했습니다.' });
  }
};


// 특정 게시물 데이터 제공
export const getPost = async (req, res) => {
  const { id } = req.params;
  // 요청에서 게시물 ID를 파라미터로 받아옴
  try {

    // 특정 게시물 조회
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },  // 받은 ID를 숫자로 변환하여 해당 ID의 게시물 조회
    });

    // 만약 게시물이 없다면 404 상태 코드와 함께 오류 메시지 반환
    if (!post) {
      return res.status(404).send({ message: '조회된 데이터가 없습니다.' });
    }

    // 이전 게시물 조회: 현재 게시물보다 최신인 게시물 중 가장 오래된 것
    const previousPost = await prisma.post.findFirst({
      where: { createdAt: { gt: post.createdAt } },  // 현재 게시물보다 더 최신인 게시물
      orderBy: { createdAt: 'asc' },  // createdAt 기준으로 오름차순 정렬 (가장 오래된 것)
    });
    
    // 다음 게시물 조회: 현재 게시물보다 오래된 게시물 중 가장 최신 것
    const nextPost = await prisma.post.findFirst({
      where: { createdAt: { lt: post.createdAt } },  // 현재 게시물보다 더 오래된 게시물
      orderBy: { createdAt: 'desc' },  // createdAt 기준으로 내림차순 정렬 (가장 최신 것)
    });

    // 게시물, 이전 게시물, 다음 게시물을 함께 응답으로 반환
    return res.status(200).send({
      post,          // 현재 게시물
      previousPost,  // 이전 게시물
      nextPost,      // 다음 게시물
    });

  } catch (error) {
    // 코드 실행 중 오류가 발생하면 catch로 처리
    console.log(error);  // 오류를 콘솔에 출력
    return res.status(500).send({ message: '서버 오류가 발생했습니다.' });  // 500 서버 오류 응답
  }
};

// 로그인 상태 체크 및 게시글 작성
export const postWrite = async (req, res) => {
  const { title, content } = req.body;
  const author = req.session.user?.userId; // 안전하게 로그인 여부 확인
  console.log(req.session);

  if (!author) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  try {
    const newPost = await prisma.post.create({
      data: {
        type: 'cheeringGrounds',
        title,
        content,
        author,
        views: 0
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};


  