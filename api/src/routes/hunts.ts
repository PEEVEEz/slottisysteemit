import { HuntModel, BonusModel } from "../database";
import { authMiddleware } from "../middlewares/auth";
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
      const hunts = await HuntModel.find({
        userId: req.user.id,
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
        await HuntModel.findByIdAndDelete(req.params.id);
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
        const newHunt = new HuntModel({
          name: req.body.name,
          userId: req.user.id,
          start: req.body.start,
        });

        newHunt.save();

        return "OK";
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
        Body: { start: number; hunt_id: number; name: string };
      }>,
      reply
    ) => {
      try {
        await HuntModel.findByIdAndUpdate(req.body.hunt_id, {
          name: req.body.name,
          start: req.body.start,
        });

        return "OK";
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
        const hunt = await HuntModel.findById(req.params.id);
        const bonuses = await BonusModel.find({
          huntId: hunt?._id,
        });

        return {
          ...{
            name: hunt?.name,
            _id: hunt?._id,
            start: hunt?.start,
          },
          bonuses,
        };
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
        await BonusModel.findByIdAndDelete(req.params.id);

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
    async (
      req: FastifyRequest<{
        Body: { hunt_id: number; game: string; bet: number };
      }>,
      reply
    ) => {
      try {
        const newBonus = new BonusModel({
          huntId: req.body.hunt_id,
          game: req.body.game,
          bet: req.body.bet,
        });

        console.log(await newBonus.save());

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
        Body: { bet: number; bonus_id: number };
      }>,
      reply
    ) => {
      try {
        await BonusModel.findByIdAndUpdate(req.body.bonus_id, {
          bet: req.body.bet,
        });

        return "OK";
      } catch (error) {
        console.error("Error updating bonus:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  done();
};
