import {
  GetTwitchUserToken,
  GetTwitchUserDataByAccessToken,
} from "../lib/twitch";
import { env } from "../lib/env";
import prisma from "../lib/prisma";
import { SetAndGenerateAuthTokenCookie } from "../lib/utils";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";

export const registerAuthRoutes = (
  instance: FastifyInstance,
  _opt: FastifyPluginOptions,
  done: (err?: Error | undefined) => void
) => {
  instance.get("/login", (_, reply) => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.CLIENT_ID,
      redirect_uri: env.CALLBACK_URL,
      scope: ["user:read:email", "openid"].join(" "),
    });

    reply.redirect(
      `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
    );
  });

  instance.get(
    "/callback",
    async (req: FastifyRequest<{ Querystring: { code: string } }>, reply) => {
      const code = req.query.code;

      const tokenData = await GetTwitchUserToken("authorization_code", code);

      const user = await GetTwitchUserDataByAccessToken(tokenData.access_token);

      await prisma.user.upsert({
        where: {
          twitchId: user.twitchId,
        },
        update: {},
        create: {
          twitchId: user.twitchId,
        },
      });

      SetAndGenerateAuthTokenCookie(tokenData, reply);
      reply.redirect(env.DASHBOARD_URL);
      return "OK";
    }
  );

  done();
};
