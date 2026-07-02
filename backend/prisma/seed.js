const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      address: 'Admin HQ',
      role: 'ADMIN',
    },
  });

  // Store Owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Store Owner',
      email: 'owner@example.com',
      password: hashedPassword,
      address: '123 Market St',
      role: 'STORE_OWNER',
    },
  });

  // Normal User
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      address: '456 Main St',
      role: 'USER',
    },
  });

  console.log('Database seeded successfully!');
  console.log({ admin: admin.email, owner: owner.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
