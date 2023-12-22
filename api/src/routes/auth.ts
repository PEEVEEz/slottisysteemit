import {
  GetTwitchUserToken,
  GetTwitchUserDataByAccessToken,
} from "../lib/twitch";
import { env } from "../lib/env";
import prisma from "../lib/prisma";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";

export const registerAuthRoutes = (
  instance: FastifyInstance,
  _opt: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) => {
  instance.get("/login", (_, reply) => {
    const params = new URLSearchParams();

    params.append("response_type", "code");
    params.append("client_id", env.CLIENT_ID);
    params.append("redirect_uri", env.CALLBACK_URL);
    params.append("scope", "user:read:email openid");

    reply.redirect(
      `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
    );
  });

  instance.get(
    "/callback",
    async (req: FastifyRequest<{ Querystring: { code: string } }>, reply) => {
      const code = req.query.code;

      const { access_token } = await GetTwitchUserToken(
        "authorization_code",
        code
      );

      const user = await GetTwitchUserDataByAccessToken(access_token);

      await prisma.user.upsert({
        where: {
          twitchId: user.twitchId,
        },
        update: {},
        create: {
          twitchId: user.twitchId,
        },
      });

      reply.setCookie("accessToken", access_token, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      reply.redirect(env.DASHBOARD_URL);
      return "OK";
    }
  );

  done();
};
