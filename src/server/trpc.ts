import { initTRPC } from "@trpc/server";
import Decimal from "decimal.js";
import superjson from "superjson";

superjson.registerCustom<Decimal, string>(
    {
      isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
      serialize: (v) => v.toJSON(),
      deserialize: (v) => new Decimal(v),
    },
    "decimal.js",
  );

const t = initTRPC.create({
    transformer: superjson,
});

export const { createCallerFactory, router } = t;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
