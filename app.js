import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient ,Prisma} from '@prisma/client';
import { assert } from 'superstruct';
import { CreateUser , PatchUser } from './structs.js';


const prisma = new PrismaClient();

function asyncHandler (hander) {
  return async function (req ,res) {
    try {
       await hander(req, res);
    } catch (error) {
      // 유효성 검사 오류
      if(error.name === 'StructError' || error instanceof Prisma.PrismaClientValidationError){
        res.status(400).send({message : error.message})
      }else if(error instanceof Prisma.PrismaClientUnknownRequestError && error.code === 'P2025'){
        res.sendStatus(404);
      }else{
        res.status(500).send({message : error.message})
      }
    }
  }
}

const app = express();
app.use(express.json());

app.get('/users', asyncHandler(async (req, res) => {
  const { offset = 0 , limit = 10 , order = 'newest'} = req.query;
  let orderBy;
  switch(order) {
    case 'oldest':
      orderBy = { createdAt : 'asc'};
      break;
    case 'newest':
      default : orderBy = {createdAt : 'desc'};
  }
  const users = await prisma.user.findMany({
    orderBy,
    // offset => skip
    skip : parseInt(offset),
    // limit => take
    take: parseInt(limit),
  });
  res.send(users);
}));

app.get('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  res.send(user);
}));

app.post('/users', asyncHandler(async (req, res) => {
  assert(req.body , CreateUser);
  // 리퀘스트 바디 내용으로 유저 생성
  const user = await prisma.user.create({
    data : req.body,
  });
  res.status(201).send(user);
}));

app.patch('/users/:id', asyncHandler(async (req, res) => {
  assert(req.body , PatchUser);
  const { id } = req.params;
  // 리퀘스트 바디 내용으로 id에 해당하는 유저 수정
  const user = await prisma.user.update({
    where : { id },
    data : req.body,
  })
  res.send(user);
}));

app.delete('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  // id에 해당하는 유저 삭제
  await prisma.user.delete({
    where :  { id },
  })
  res.sendStatus(204);
}));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));