# ✔ comazone (express / prisma <>  postgreSQL )

**2024-11-01  !**

[주요 prisma command’s](%E1%84%8C%E1%85%AE%E1%84%8B%E1%85%AD%20prisma%20command%E2%80%99s%20139b853ac11a80519941d1dc3960e6f3.md)

## 주요 사용 라이브러리 및 익스텐션

- `nodemon`: 코드에 변경 사항이 있으면 자동으로 서버를 재시작해 주는 라이브러리(개발 환경에만 필요)
    
- `prisma`: Prisma 관련 커맨드를 실행하는 데 필요한 라이브러리
- `@prisma/client`: Prisma 관련 코드를 실행하기 위해 필요한 라이브러리
- `express`: 자바스크립트로 API를 만들기 위한 라이브러리
- `superstruct`: 유효성 검사를 할 때 사용하는 라이브러리
- `is-email`: 값이 이메일 형식인지 확인할 때 사용하는 라이브러리
- `is-uuid`: 값이 UUID 형식인지 확인할 때 사용하는 라이브러리

[dotenv](dotenv%20139b853ac11a80e0baebfc5100d0fee4.md)

## 코마존 서비에스에 필요한 테이블을 prisma 로 정의

백엔드를 만들기 위해 가장 먼저 해야할 것은 코마존 서비스에 필요한

 **테이블 을 프리즈마로 정의 하는 것이다.**

우선 프리즈마와 데이터베이스를 초기화 해야한다.

npx prisma init - -datasource-provider postgresql 

**프리즈마 커멘드는 npx prisma로 항상 시작된다.**

실행하면 몇가지 파일이 과 폴더가 생긴다 .

**/.gitignore** 파일은 git 을 사용할 경우 무시할 파일들을 설정 할 수 있다.

/.env  파일은 환경변수를 설정하는 파일이다. 데이터베이스의 URL 을 설정한다.

<aside>
💡

**/prisma/schema.prisma 파일은 이파일에 필요한 테이블들의 구조를 정의한다.** 

</aside>

```jsx
DATABASE_URL="postgresql://postgres:1148412a%40@localhost:5432/comazone_dev?schema=public"
PORT = 3000
```

## schema.prisma MODEL 만들기

모델은 데이터베이스의 테이블을 나타낸다. 

모델에 제약조건 , 다양한 필드를 정의 한다. 후에 이모델이 실제 테이블로 매핑된다.

모델 객체안에 필드이름과 타입을 다음과 같이 정의해준다.

모델은 적어도 1개이상의  **uniqe 필드가 필요하다.**

**@id 는 @id 를 사용한 필드가 데이터를 식별하는 고유 id 를 갖는 필드라는것을 가리킨다.**

- 필드들은 기본적으로 갑을 비워둘 수 없다. 만약  값을 옵셔널하게 ⇒
    
    필드의 데이터타입 **뒤에 “?”** 를 붙여서 작성한다.
    
    - @default(uuid()) 설명은 CLICK!
        
        default 는 자동으로 값을 생성함을 나타낸다.
        
        uuid 는 값을 36자리의 값으로 사용한다를 나타낸다 (보안에 좋다)
        

@unique 어트리뷰트는 값이 중복될 수 없음을 나타낸다.

createdAt는 @default(now()) 으로 저장되는 시점을 자동생성으로 사용한다.

updatedAt 은 @updatedAt 사용한다.

```sql
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
필드명      필드타입   어트리뷰트("@"기호로 시작하며 필드에 대한 추가정보를 나타낸다.)
  id        String   @id @default(uuid())
  email     String   @unique
  firstName String
  lastName  String
  address   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### enum(enumerated type)

<aside>
💡

`enum`(enumerated type)은 값이 몇 가지 고정된 옵션 중 하나만 가질 수 있도록 제한하는 타입을 정의 할때 사용된다.

</aside>

예를 들어서 축구선수의 position 이라는 필드가 있는데 이필드의 타입에는 position의 해당하는 

타입 몇가중에 하나만 들어가야하는 제약이 있다.

그러면 다음과 같이 정의한다.

enum 값은 보통 **대문자를 사용**하고 필드의 타입을 “enum 이름” 으로 설정한다.

@default 어트리뷰트도 사용할 수 있으며 enum 은 서로 연관된 상수들의 집합이라고 보면된다.

```sql
model Player {
  // ...
  position PositionOption @default(DEFENDER)
}

enum PositionOption  {
  FORWORD
  MIDFILELD
  DEFENDER
  GOALKEEPER
}
```

### @@nuique

@@unique 는 @unique의 중첩 버전이라고 생각하면 된다.

다음코드를 보면 필드안에 **@@unique([name , email])**  라는 코드가 있다.

이코드는 해당필드의 필드명의 조합이 같을 수 없다는 제약이다.

예를들어 이름이 ‘홍길동’ 인 사람이 여럿일 수는 있지만 

‘홍길동’이라는 사람끼리 같은 이메일 주소는 **사용 할 수 없는 것이다.**

```sql
model User {
	name  String
	email String 
	
@@unique([name , email]) 
}

```

## 마이그레이션

<aside>
💡

모델코드를 데이터베이스에 반영하는 과정을 **‘마이그레이션’** 이라고 한다.

마이그레이션 파일은 데이터의 생성,변화를 순서에 맞게 파일로 계속 생성한다.

이는 데이터베이스의 그동안의 변화의 과정을 기록하고 있으니 지우지 않는것이 좋다.

</aside>

**데이터베이스가 schema와 동기화 !**

```sql
npx prisma migrate dev
```

/sql 파일 ⇒ 테이블을 생성하는 sql 문이 생성.

prisma 가 shema.prisma 에 있는 코드를 sql 문으로 바꾸고 실행을 해줬다.

 **User 모델이 User 테이블이 되고 모델안의 필드들이 테이블  colum 이 된다.**

schema 파일에 변화를 주면 ( 모델의 변화 등..)  **마이그레이션을 해줘야** 데이터베이스에 반영이된다.

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### npx prisma studio

<aside>
💡

데이터 베이스 둘러보기!

</aside>

prisma 에서 제공하는 **prisma studio** 라는 툴을 사용하면 

쉽게 데이터베이스를 살펴보고 관리 할 수 있다

**개발환경에서 mock 데이터가 필요하거나 특정 데이터 수정시 사용한다.**

### 테이블에 데이터가 있을때 필드 추가 , 삭제 마이그레이션 하기

- **Add**

기존에 없던 필드 추가하기 ⇒ 기본적으로 필드의 값은 **‘필수’** 이기때문에 

새로 필드를 추가하면 기존에 있던 데이터들은 필드의 값이 없기 때문에 **오류**가 발생한다.

그렇기 때문에 column 추가시에는 필드의 타입을 옵셔널로 설정을 해주고 ⇒ 

기존데이터들에 값을 입력해주고 필수로 설정하는 방법이 있다.

혹은 **@default 어트리뷰트**를 활용하는 방법도 있다.

- **Delete**

필드를 삭제하는 것은 큰 문제가 없다. 어려울 것도 없다

그리고 데이터가 손상될 위험이나 정말로 필드를 삭제 할것인지  prisma 가 한번 더 집어주기 때문에

좋다.

## 데이터베이스의 데이터활용 ⇒ API 만들기

환경변수에 접근하기 위해 **dotenv의 .config 함수를 사용해서 env 파일을 로드**

```jsx
import * as dotenv from 'dotenv';
dotenv.config()
```

`@prisma/client` 패키지에서 `PrismaClient`를 가져온다.

prismaclient 는 Prisma ORM 을 통해서 **데이터베이스와 상호작용하는 데 사용되는 객체**이다.

이를 통해 에이터베이스 쿼리르 쉽게 실행할 수 있다.

```jsx
import { PrismaClient } from '@prisma/client';
```

prisma client 를 인스턴스화.

 prisma 는 이후 **데이터베이스와의 상호작용을 담당하는객체가 된다**.  

prisma를 통해 findMany, findUnique 같은 메소드를 호출할 수 있다.

```jsx
const prisma = new PrismaClient();
```

<aside>
💡

**Prisma 쿼리 문법은 조건을 객체의 형태로 받는다 !**

</aside>

### Get !

인스턴스 prisma를 통해서 user 모델을 통해 데이터베이스에 접근해 조회할 수 있다.\

**findMany(); 함수를 사용해서 user 테이블의 모든 데이터를 조회 한다.**

**findMany 함수의 옵션중 몇가지…**

**`where`**: 조건에 맞게 필터링할 수 있다.
**`select`**: 특정 필드만 선택하여 조회
**`orderBy`**: 결과 정렬

`take`와 **`skip`**: 페이지네이션 ``

`take : 조회할 레코드의 개수, skip : 결과의 시작위치를 지정하여 페이지네이션을 구현할 때 유용하다.`

findUnique() 특정값 하나를 불러올때 where 과 select 두가지 옵션만 사용할 수 있다.

```jsx
 	const { id } = req.params;				
  const user = await prisma.user.findUnique({
    where: { id },
  });
```

```jsx

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.send(user);
});
```

## POST!

prisma를 활용해서 데이터를 데이터베이스에 보낼때 

**create()** 함수를 활용한다. 

prisma.user.create() 프리즈마 + 모델명 + 데이터 생성함수.

create () 함수의 아규먼트로 

**data : 프로퍼티에 req.body** ( 전달할 데이터 값) 을 넘겨준다.

```jsx
app.post('/users', async (req, res) => {
  // 리퀘스트 바디 내용으로 유저 생성
  const user = await prisma.user.create({
    data : req.body,
  });
  res.status(201).send(user);
});
```

## PATCH!

prisma를 활용해서 데이터베이스의 특정데이터의 값을 변경할때

**update()** 함수를 활용한다.

prisma.user.update() 프리즈마 + 모델명 + 데이터 변경함수

update() 함수의 아규먼트로 

**where 프로퍼티에 [객체의 형태로 id] 를 넘겨준다.** 

**data 프로퍼티의 변경할 값을 req.body 를 전달한다.**

```jsx
app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  // 리퀘스트 바디 내용으로 id에 해당하는 유저 수정
  const user = await prisma.user.update({
    where : { id },
    data : req.body,
  })
  res.send(user);
});
```

## Delete!

prisma 를 활용해서 데이터베이스의 데이터 삭제하기.

**delete()** 함수를 활용한다.

prisma.user.delete() 프리즈마 + 모델명 + 삭제함수

delete 함수의 아규먼트로 

where 프로퍼티의 id 를 전달한다.

```jsx
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  // id에 해당하는 유저 삭제
  await prisma.user.delete({
    where : { id },
  })
  res.sendStatus(204);
});
```

## 데이터 시딩

파일에 담겨있는 데이터 전체를 시딩 하기!

데이터베이스를 초기화하고, 초기데이터 값을 넣어주는 코드이다.

초기데이터를 넣는 과정을 시딩이라고 하고 그 데이터는 시드 데이터라고 한다. 

prisma 를 통해 데이터베이스에 접근을 해야하기 때문에

const prisma 를 PrismaClient 로 인스턴스화 해준다.

prisma 의 메소드들은 쿼리를 return 하기 때문에 async 비동기 함수문을 사용한다.

**prisma + 접근하고자 하는 테이블 + 메소드 ()** 

**deleteMany 함수는 특정데이터가 아닌 조건에 맞는 범위의 데이터를 모두 삭제하는 기능.**

**아규먼트를 전달하지 않으면 모든 데이터가 삭제된다.**

그후 **createMany () 함수를 사용 createMany() 함수는 data 프로퍼티에 배열을 전달**하면 

모든 데이터가 생성된다.

```jsx
import { PrismaClient } from '@prisma/client';
import { USERS } from './mock.js'
const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  // 목 데이터 삽입
  await prisma.user.createMany({
    data:USERS,
    skipDuplicates:true,
  })
}
```

다음 함수는 데이터베이스와의 작업을 완료후 

prisma 와 데이터베이스의 연결을 안전하게 끊어주는 역할을 수행한다.

main  함수는 비동기 함수로 promise를 리턴한다.

실행이 성공적이면 fullfiled 상태라면 then 블록의 함수를 실행한다.

**$disconnection() 은 데이터베이스와의 연결을 종료하는 함수이다. ⇒** 

**이작업은 자원을 낭비하지 않게 관리하는 중요한 장면이다.**

**`process.exit(1)`**: 에러가 발생했을 때 프로세스를 종료

 `1`은 오류 상태를 나타내는 코드입니다. 만약 `process.exit(0)`이면 정상 종료를 의미

```jsx
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

## GET 엔드포인트의 쿼리스트링 처리하기

req.qurey 프로퍼티에 접근해서 http url 의 쿼리스트링에 접근 ⇒ 

그 **값을 구조분해 할당으로** 

**offset , limit , order 에 각각 할당 , 해당 값이 없을 때를 고려해 기본값 할당.**

**기본값을 offset = 0 , limit = 10 , order = ‘newest’** 

order 는 조건에 따라서 orderBy 프로퍼티에 값을 객체로 내려줘야 하기 때문에

그전에 let orderBy 함수를 객체로 정의하고 쿼리를 진행

switch 문을 사용해 order 의 값을 받고 case문을 통해서 조건에 따라 orderBy에 값을 할당

prisma + 모델명 + 쿼리메소드 findMany() 함수실행

findMany() 의 아규먼트로 orderBy  , skip , take 를 각각 설정해서 전달한다.

**orderBy :  데이터의 조건 설정**

**skip : 데이터의 시작 index가 설정된다. ( 몇개를 건너뛰고 부터 데이터를 조회 할것인가?)**

**take : 몇개를 돌려받을 것인가**

ex) 1

```jsx
app.get('/users', async (req, res) => {
  
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
	  // order => orderBy (정렬)
    orderBy,
    // offset => skip (시작지점)
    skip : parseInt(offset), 
    // limit => take (갯수)
    take: parseInt(limit),
  });
  res.send(users);
});
```

ex) 2

```jsx
app.get('/products', async (req, res) => {
  cosnt { order = 'newest', offset = 0 , limit = 10 , category} = req.query;
  
  const where = category ? { category } : {};
  
  let orderBy ;
  switch(order){
    case 'priceLowest' :
      orderOption = {price : 'asc' }
    case 'priceHeight' :
      orderOption = {price : 'desc'}
    case 'oldest' :
      orderOption = {createdAt : 'asc'}
    case 'newest' :
      default orderOption = {createdAt : 'desc' }
  }
 
  const products = await prisma.product.findMany({
    where ,
    orderBy ,
    skip : parseInt(offset);
    take : parseInt(limit),
  });
  res.send(products);
});
```

## 유효성 검사

**superstruct , is-eamil , is-uuid** 라이브러리 사용.

1. superstruct 로 예상하는 **데이터의 형식을 정의** 한다.
2. 정의한 데이터와 실제로 받은 데이터가 형식이 **일치하는지 판단**한다.

****struct.js file**

as 문 ‘s’ 라는 이름으로 “superstuct”의 모든 기능을 가져온다. ⇒ 

이후의 **s 로 묶인 기능들은 객체의 key 값으로 접근하듯이 모두 사용이 가능하다.**

### object () , size () , partial () ,defile () , string ()

post 상황에서의 데이터 유효성 검사이기 때문에 변수의 이름은 CreateUser 로 선언

superstruct 의 **object 함수**를

 사용해서 client가 요청을 보내야 할 때의 데이터의 **스키마를 객체의 형태로 정의한다.**

client는 다음과 같은 형태로 req.body 를 보내야한다.

object  함수의 인자로는 스키마를 객체의 형태로 전달하는데 각각의 필드를 보면 ⇒ 

email 필드는 **s.define('Email' ,isEmail)** 으로 email 형식이여야 한다는 **조건을 설정**

여기서 Email 은 커스텀타입의 이름을 나타내고 , isEmail 함수는 실제로 문자열을 전달받아 그값이 email 형식인지 boolean 값으로 return  해준다.

firstName , lastName 필드는 size 함수로 최소 입력 글자수와 최대입력글자수 , 입력 요소의 타입

의 조건을 걸어준다.  

size (  s.string() , 1 , 30 )

타입 , 최소 1글자 , 최대 30글자의 옵션. 설정 모습

```jsx
import * as s from 'superstruct';
import isEmail from 'is-email';

export const CreateUser = s.object({
    email: s.define('Email' ,isEmail),
    firstName: s.size(s.string(), 1 ,30),
    lastName: s.size(s.string(), 1 ,30),
    address: s.string(),
})

export const PatchUser = s.partial(CreateUser);
```

Patch user 는 CreatUser 를 기반으로 생성된 또 다른 스키마 이다.

**partial ()  함수**는 인자로 전달받은 객체의 필드를 **선택적**으로 만든다.

CreatUser 에서는 모든 필드가 필수값이 였지만 PatchUser 에서는 값이 

CreatUser 의 해당되는 필드기만 한다면

그값으로 업데이트를 시키기 위해 정의 된 스키마이다.

```jsx
export const PatchUser = s.partial(CreateUser);
```

**그밖에 superstruct 함수 몇가지 ⇒** 

 enums : 이미 정해진 몇가지 값중 하나를 꼭 선택 아규먼트로 배열을 받는다.

  min : 최소값 

integer : 정수값으로 변환

## 오류 처리하기

express 에서는 비동기코드에서 오류가 발생하면 서버가 죽는다.

그렇기 때문에 trycatch 문을 사용한다.

asyncHandler 라는 오류를 처리하는 함수를 만든다.

- `e.name === 'StructError'`: Superstruct 객체와 형식이 다를 경우 발생
- `e instanceof Prisma.PrismaClientValidationError`: 데이터를 저장할 때 모델에 정의된 형식과 다른 경우 발생 (Superstruct로 철저히 검사하면 이 상황은 잘 발생하지 않지만 안전성을 위해 둘 다 검사)
- `e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025'`: 객체를 찾을 수 없을 경우 발생

```jsx
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientValidationError ||
        e.name === 'StructError'
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

```
