import prisma from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";
import { getHuntDataById, sendLatestHuntDataToRoom } from "../lib/hunt";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";

export const registerHuntsRoutes = (
  instance: FastifyInstance,
  _opt: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) => {
  /** @ts-ignore */
  instance.addHook("preHandler", authMiddleware);

  //get hunts
  instance.get("/", async (req, reply) => {
    try {
      const hunts = await prisma.hunt.findMany({
        where: {
          userId: req.user.id,
        },
        select: {
          id: true,
          name: true,
          start: true,
          bonuses: true,
        },
      });

      return hunts || [];
    } catch (error) {
      console.error("Error retrieving user:", error);
      return reply.status(500).send("Internal Server Error");
    }
  });

  //delete hunt
  instance.delete(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        await prisma.hunt.delete({
          where: {
            id: req.params.id,
          },
        });

        sendLatestHuntDataToRoom(req.user.id);

        return "ok";
      } catch (error) {
        console.error("Error deleting hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  //create hunt
  instance.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            start: { type: "number" },
          },
          required: ["name", "start"],
        },
      },
    },
    async (
      req: FastifyRequest<{ Body: { name: string; start: number } }>,
      reply
    ) => {
      try {
        const newHunt = await prisma.hunt.create({
          data: {
            name: req.body.name,
            userId: req.user.id,
            start: req.body.start,
          },
        });

        sendLatestHuntDataToRoom(req.user.id);

        return newHunt;
      } catch (error) {
        console.error("Error creating hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  //update hunt
  instance.put(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            start: { type: "number" },
            hunt_id: { type: "string" },
          },
          required: ["name", "start", "hunt_id"],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: { start: number; hunt_id: string; name: string };
      }>,
      reply
    ) => {
      try {
        await prisma.hunt.update({
          where: {
            id: req.body.hunt_id,
          },
          data: {
            name: req.body.name,
            start: req.body.start,
          },
        });

        sendLatestHuntDataToRoom(req.user.id);

        return "ok";
      } catch (error) {
        console.error("Error updating bonus:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  //get hunt by id
  instance.get(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        return await getHuntDataById(req.params.id);
      } catch (error) {
        console.error("Error retrieving hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  //delete bonus
  instance.delete(
    "/bonus/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        await prisma.bonus.delete({
          where: {
            id: req.params.id,
          },
        });

        sendLatestHuntDataToRoom(req.user.id);

        return "ok";
      } catch (error) {
        console.error("Error retrieving hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  //add bonus
  instance.post(
    "/bonus",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            game: { type: "string" },
            bet: { type: "number" },
            hunt_id: { type: "string" },
          },
          required: ["game", "bet", "hunt_id"],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: { hunt_id: string; game: string; bet: number };
      }>,
      reply
    ) => {
      try {
        const newBonus = await prisma.bonus.create({
          data: {
            huntId: req.body.hunt_id,
            game: req.body.game,
            bet: req.body.bet,
          },
        });

        sendLatestHuntDataToRoom(req.user.id);

        return newBonus;
      } catch (error) {
        console.error("Error creating bonus:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  //update bonus
  instance.put(
    "/bonus",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            bet: { type: "number" },
            bonus_id: { type: "string" },
          },
          required: ["bet", "bonus_id"],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: { bet: number; bonus_id: string };
      }>,
      reply
    ) => {
      try {
        await prisma.bonus.update({
          where: {
            id: req.body.bonus_id,
          },
          data: {
            bet: req.body.bet,
          },
        });

        sendLatestHuntDataToRoom(req.user.id);

        return "ok";
      } catch (error) {
        console.error("Error updating bonus:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  done();
};
