import prisma from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";

export const registerHuntsRoutes = (
  instance: FastifyInstance,
  _opt: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) => {
  /** @ts-ignore */
  instance.addHook("preHandler", authMiddleware);

  instance.get("/", async (req, reply) => {
    try {
      const hunts = await prisma.hunt.findMany({
        where: {
          userId: req.user.id,
        },
      });

      return hunts || [];
    } catch (error) {
      console.error("Error retrieving user:", error);
      return reply.status(500).send("Internal Server Error");
    }
  });

  instance.delete(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        await prisma.hunt.delete({
          where: {
            id: +req.params.id,
          },
        });

        return "ok";
      } catch (error) {
        console.error("Error deleting hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

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
        await prisma.hunt.create({
          data: {
            ...req.body,
            userId: req.user.id,
          },
        });

        return "OK";
      } catch (error) {
        console.error("Error creating hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  instance.get(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        const hunt = await prisma.hunt.findUnique({
          where: {
            id: Number(req.params.id),
          },
          select: {
            id: true,
            name: true,
            bonuses: true,
          },
        });

        return hunt;
      } catch (error) {
        console.error("Error retrieving hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  instance.delete(
    "/bonus/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
      try {
        await prisma.bonus.delete({
          where: {
            id: +req.params.id,
          },
        });

        return "ok";
      } catch (error) {
        console.error("Error retrieving hunt:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  instance.post(
    "/bonus",
    async (
      req: FastifyRequest<{
        Body: { hunt_id: number; game: string; bet: number };
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

        return newBonus;
      } catch (error) {
        console.error("Error creating bonus:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  done();
};
