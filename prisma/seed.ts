import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Stud Earrings" },
    }),
    prisma.category.create({
      data: { name: "Hoop Earrings" },
    }),
    prisma.category.create({
      data: { name: "Drop Earrings" },
    }),
    prisma.category.create({
      data: { name: "Statement Earrings" },
    }),
  ]);

  // Create products
  const products = await Promise.all(
    Array.from({ length: 50 }).map((_, i) => {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const baseNames = [
        "Crystal",
        "Pearl",
        "Gold",
        "Silver",
        "Diamond",
        "Emerald",
        "Ruby",
        "Sapphire",
        "Opal",
        "Topaz",
      ];
      const styles = ["Classic", "Modern", "Vintage", "Bohemian", "Minimalist"];
      const name = `${styles[Math.floor(Math.random() * styles.length)]} ${
        baseNames[Math.floor(Math.random() * baseNames.length)]
      } ${category.name}`;

      return prisma.product.create({
        data: {
          name,
          price: Math.round(Math.random() * 150 + 20), // Price between 20 and 170
          categoryId: category.id,
        },
      });
    })
  );

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "password123",
    },
  });

  // Create test order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "completed",
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
          },
          {
            productId: products[1].id,
            quantity: 2,
          },
        ],
      },
    },
  });

  console.log({
    categoriesCount: categories.length,
    productsCount: products.length,
    users: 1,
    orders: 1,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
