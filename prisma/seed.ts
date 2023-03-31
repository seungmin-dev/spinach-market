import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(300).keys())].forEach(async (item) => {
    const stream = await client.stream.create({
      data: {
        name: String(item),
        description: String(item),
        price: item,
        user: {
          connect: {
            id: 1,
          },
        },
        cloudflareId: "abc",
        cloudflareKey: "abc",
        cloudflareUrl: "abc",
      },
    });
    console.log(`${item}/300`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
