import prisma from "../lib/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { GetTwitchUserDataByAccessToken } from "../lib/twitch";

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    reply.status(401).send({
      message: `Unauthorized: No token provided`,
    });
    return;
  }

  const twitchUser = await GetTwitchUserDataByAccessToken(token);

  const user = await prisma.user.findUnique({
    where: {
      twitchId: twitchUser.twitchId,
    },
    select: {
      id: true,
    },
  });

  req.user = { ...user, ...twitchUser };
};
