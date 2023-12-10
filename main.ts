import { PrismaClient } from "@prisma/client";
import { pino } from "pino";
import { groups } from "./groups.js";

const prisma = new PrismaClient();

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "trace",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: process.env.NODE_ENV === "production" ? "info" : "trace",
        options: {},
      },
    ],
  },
});

async function main() {
  logger.info("Start to update abstract groups");
  try {
    await prisma.$transaction(
      Object.entries(groups).map(([keyword, group]) =>
        prisma.abstractGroup.upsert({
          where: {
            keyword,
          },
          create: {
            keyword,
            names: {
              createMany: {
                skipDuplicates: true,
                data: Object.entries(group.names).map(([lang, name]) => ({
                  locale: lang,
                  name,
                })),
              },
            },
          },
          update: {
            names: {
              createMany: {
                skipDuplicates: true,
                data: Object.entries(group.names).map(([lang, name]) => ({
                  locale: lang,
                  name,
                })),
              },
            },
          },
        }),
      ),
    );
    logger.info("Succeeded!");
  } catch (e) {
    logger.error(e, "Failed to update abstract groups");
  }
}

main();
