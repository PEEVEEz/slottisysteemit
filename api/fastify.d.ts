import { OAuth2Namespace } from "@fastify/oauth2";

declare module "fastify" {
  interface FastifyRequest {
    user: any;
  }
}
