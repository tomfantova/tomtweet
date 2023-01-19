import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const check = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      if (
        check === null &&
        checkBody(input, ["firstName", "username", "password"])
      ) {
        return await ctx.prisma.user.create({
          data: {
            firstName: input.firstName,
            username: input.username,
            password: bcrypt.hashSync(input.password, 10),
            token: uid2(32),
          },
        });
      }
    }),
  signin: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (checkBody(input, ["username", "password"])) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            username: input.username,
          },
        });
        if (user && bcrypt.compareSync(input.password, user.password)) {
          return user;
        }
      }
    }),
});
