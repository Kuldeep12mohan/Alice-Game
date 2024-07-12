import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { cors } from "hono/cors";
import { Calculate } from "./calculation";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
app.use(cors());
app.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  let room = await prisma.room.findFirst({});
  if (!room) {
    room = await prisma.room.create({
      data: {},
    });
  }
  console.log("room", room);
  const { name } = await c.req.json();
  console.log(name);
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        roomId: room.id,
      },
    });
    c.status(200);
    return c.json({
      message: "user created",
      user,
    });
  } catch (error) {
    c.status(401);
    return c.text("something wrong occur!!");
  }
});

app.post("/create-room", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const room = await prisma.room.create({
      data: {},
    });
    c.status(200);
    return c.json({
      message: "room created successfully",
      room,
    });
  } catch (error) {
    c.status(401);
    return c.text("something wrong in creating room");
  }
});

app.get("/get-users/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    const users = await prisma.room.findFirst({
      where: {
        id: id,
      },
      select: {
        members: true,
      },
    });
    c.status(200);
    return c.json({
      message: "user fetched successfully",
      users,
    });
  } catch (error) {
    c.status(401);
    return c.text("error in fetching user");
  }
});

app.post("/join-room", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const res = await prisma.user.update({
      where: {
        id: body.userId,
      },
      data: {
        roomId: body.roomId,
        ready: true,
      },
    });
    c.status(200);
    return c.json({
      message: "user joined successfully",
      res,
    });
  } catch (error) {
    c.status(401);
    return c.text("something went wrong in joining room");
  }
});

app.post("/send-num", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  body.number = Number.parseInt(body.number);
  console.log(body.number);
  console.log(typeof body.number);
  console.log(body);
  try {
    const user = await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        selectedNum: body.number,
      },
    });
    c.status(200);
    return c.json({ user });
  } catch (error) {
    c.status(401);
    return c.text("error in updating number");
  }
});
app.get("/return-user/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: id,
      },
      select: {
        members: true,
      },
    });

    if (!room) {
      c.status(404);
      return c.text("Room not found");
    }

    const { user, users } = Calculate({ Users: room.members });
    c.status(200);
    return c.json({ user, users });
  } catch (error) {
    c.status(500);
    return c.text("Error in fetching user");
  }
});
app.patch("/game-start/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const id = c.req.param("id");
  try {
    await prisma.room.update({
      where: {
        id: id,
      },
      data: {
        start: body.game,
      },
    });
    c.json(200);
    return c.json({
      message: "game start",
    });
  } catch (error) {
    c.status(402);
    return c.text("something wrong");
  }
});
app.get("/game-start/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");

  try {
    const gameStart = await prisma.room.findFirst({
      where: {
        id: id,
      },
      select: {
        start: true,
      },
    });
    c.status(200);
    return c.json({
      gameStart,
    });
  } catch (error) {
    c.status(403);
    return c.text("something wrong in game start");
  }
});

app.get("/get-user/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        score: true,
      },
    });
    c.status(200);
    return c.json(user);
  } catch (error) {
    c.status(402);
    return c.text("user fetching failed");
  }
});
app.patch("/update-score", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  const room = await prisma.room.findFirst({
    where: {
      id: body.roomId,
    },
    select: {
      members: true,
    },
  });

  if (!room) {
    c.status(404);
    return c.text("Room not found");
  }

  const { user, users } = Calculate({ Users: room.members });

  await Promise.all(
    room.members.map(async (member) => {
      if (!users.some((u) => u.id === member.id)) {
        await prisma.user.update({
          where: { id: member.id },
          data: { score: (member.score || 0) - 1 },
        });
      }
    })
  );
  return c.json({ message: "score updates successfully" });
});

app.post("/update-ready", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  await prisma.user.update({
    where: {
      id: body.id,
    },
    data: {
      ready: body.ready,
    },
  });
  return c.json({message:"success"})
});
app.get("/all-ready/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  const id = c.req.param("id");
  
  try {
    const room = await prisma.room.findFirst({
      where: {
        id: id,
      },
      select: {
        members: true,
      },
    });
    
    console.log("members", room?.members);

    if (room && room.members) {
      for (const member of room.members) {
        if (member.ready === false) {
          c.status(200);
          return c.json({ start: false });
        }
      }
      c.status(200);
      return c.json({ start: true });
    } else {
      c.status(404);
      return c.json({ error: "Room not found" });
    }
  } catch (error) {
    console.error(error);
    c.status(502);
    return c.text("hatt bhai");
  }
});


export default app;
