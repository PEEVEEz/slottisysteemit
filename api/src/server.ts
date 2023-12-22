import { env } from "./lib/env";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastify, { FastifyRequest } from "fastify";
import { registerAuthRoutes } from "./routes/auth";
import { registerUsersRoutes } from "./routes/users";
import { registerHuntsRoutes } from "./routes/hunts";

const server = fastify();

server.register(cookie);
server.register(cors, {
  origin: true,
  credentials: true,
});

//register routes
server.register(registerAuthRoutes, { prefix: "auth" });
server.register(registerUsersRoutes, { prefix: "users" });
server.register(registerHuntsRoutes, { prefix: "hunts" });

//game search
server.get(
  "/game",
  async (req: FastifyRequest<{ Querystring: { name: string } }>, reply) => {
    try {
      const url = `https://cms-prod.casinobud.com/api/proxy?operationName=searchGames&variables={"first":5,"skip":0,"name":"${req.query.name}"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"ead60222ed62e2c6792f37ab03b1b14203f9a00a11d825791d31bc896a5750e8"}}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.data || !data.data.allGames || data.data.allGames.length <= 0) {
        return [req.query.name];
      }

      return (data.data.allGames as { name: string }[]).map((v) => v.name);
    } catch (error) {
      reply.code(500).send({
        message: "Internal server error",
      });
    }
  }
);

server.listen({ port: Number(env.PORT), host: env.HOST }, (err, addr) => {
  if (err) throw err;

  console.log(`[API] Listening at ${addr}`);
});
