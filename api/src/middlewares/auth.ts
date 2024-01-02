import {
  GetTwitchUserToken,
  GetTwitchUserDataByAccessToken,
} from "../lib/twitch";
import { env } from "../lib/env";
import { verify } from "jsonwebtoken";
import type { TwitchToken } from "../types";
import { FastifyReply, FastifyRequest } from "fastify";
import { SetAndGenerateAuthTokenCookie } from "../lib/utils";

import { UserModel } from "../database";

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

    const user = await UserModel.findOne({
      twitchId: twitchUser.twitchId,
    });

    if (!user) {
      return reply.status(401).send({
        message: `Unauthorized: User not found`,
      });
    }

    req.user = { id: user._id, ...twitchUser };
  } catch (error) {
    console.error("Authentication error:", error);
    reply.status(500).send({
      message: "Internal Server Error",
    });
  }
};
