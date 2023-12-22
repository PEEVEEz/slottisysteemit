import { authMiddleware } from "../middlewares/auth";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const registerUsersRoutes = (
  instance: FastifyInstance,
  _opt: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) => {
  /** @ts-ignore */
  instance.addHook("preHandler", authMiddleware);

  instance.get("/@me", (req) => {
    return req.user;
  });

  done();
};
