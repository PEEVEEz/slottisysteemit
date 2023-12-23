import {
  TwitchToken,
  GetTwitchUserToken,
  GetTwitchUserDataByAccessToken,
} from "../lib/twitch";
import { env } from "../lib/env";
import prisma from "../lib/prisma";
import { verify } from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import { SetAndGenerateAuthTokenCookie } from "../lib/utils";

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      reply.status(401).send({
        message: `Unauthorized: No token provided`,
      });
      return;
    }

    const jwt = verify(token, env.JWT_SECRET);
    if (!jwt) {
      reply.status(401).send({
        message: `Unauthorized: Invalid token`,
      });
      return;
    }

    let { access_token, expires_in, refresh_token } = jwt as TwitchToken;

    const currentTime = new Date();
    const expirationTime = new Date(expires_in);
    const isExpired = currentTime >= expirationTime;

    if (isExpired) {
      const newTokenData = await GetTwitchUserToken(
        "refresh_token",
        refresh_token
      );

      SetAndGenerateAuthTokenCookie(newTokenData, reply);
      access_token = newTokenData.access_token;
    }

    const twitchUser = await GetTwitchUserDataByAccessToken(access_token);

    const user = await prisma.user.findUnique({
      where: {
        twitchId: twitchUser.twitchId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return reply.status(401).send({
        message: `Unauthorized: User not found`,
      });
    }

    req.user = { ...user, ...twitchUser };
  } catch (error) {
    console.error("Authentication error:", error);
    reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
