import { env } from "./env";
import { sign } from "jsonwebtoken";
import type { TwitchToken } from "../types";
import { FastifyReply } from "fastify/types/reply";

export function SetAndGenerateAuthTokenCookie(
  { access_token, refresh_token, expires_in }: TwitchToken,
  reply: FastifyReply
) {
  const expiration_time = new Date();
  expiration_time.setSeconds(expiration_time.getSeconds() + expires_in);

  const token = sign(
    { access_token, refresh_token, expires_in: expiration_time },
    env.JWT_SECRET
  );

  return reply.setCookie("authToken", token, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
