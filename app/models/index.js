import config from "../../config/app.js";
import prisma from "@prisma/client";
import chalk from "chalk";

/** @type {(prisma.Prisma.LogLevel | prisma.Prisma.LogDefinition)[] | undefined} */
const log = (() => {
  if (config.disable_prisma_console) {
    return undefined;
  } else if (config.is_development) {
    return [{ emit: "event", level: "query" }];
  }
})();

const model = new prisma.PrismaClient({ log });

model.$on("query", event => {
  console.info(`${chalk.blue("prisma:query")} ${event.query}`);
  console.info(`${chalk.blue("prisma:params")}: ${event.params}`);
  console.info(`${chalk.blue("prisma:duration")}: ${event.duration}ms`);
  console.info(`${chalk.red("-----")}`);
});

export { model, prisma };
