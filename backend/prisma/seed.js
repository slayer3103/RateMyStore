const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Clearing old data (if any)...');
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database with bulk data...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin User
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      address: 'Admin HQ',
      role: 'ADMIN',
    },
  });

  // 10 Store Owners
  const owners = [];
  for (let i = 1; i <= 10; i++) {
    const owner = await prisma.user.create({
      data: {
        name: `Owner ${i}`,
        email: `owner${i}@example.com`,
        password: hashedPassword,
        address: `${i}00 Business Rd, Suite ${i}`,
        role: 'STORE_OWNER',
      },
    });
    owners.push(owner);
  }

  // 10 Normal Users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        address: `${i}00 Resident St`,
        role: 'USER',
      },
    });
    users.push(user);
  }

  // 10 Stores (1 for each owner)
  const stores = [];
  for (let i = 0; i < 10; i++) {
    const store = await prisma.store.create({
      data: {
        name: `Awesome Store ${i + 1}`,
        email: `contact@store${i + 1}.com`,
        address: `${i + 1}00 Retail Blvd`,
        ownerId: owners[i].id,
      },
    });
    stores.push(store);
  }

  // Add Ratings: Give each store 3 ratings from our normal users
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    // pick 3 distinct users for each store using a simple offset
    for (let j = 0; j < 3; j++) {
      const userIndex = (i + j) % 10;
      const user = users[userIndex];
      // Generate a rating between 3 and 5 (make the stores look good!)
      const ratingVal = Math.floor(Math.random() * 3) + 3; 
      
      await prisma.rating.create({
        data: {
          storeId: store.id,
          userId: user.id,
          rating: ratingVal,
        },
      });
    }
  }

  console.log('Database seeded successfully with 10 Owners, 10 Stores, 10 Users, and 30 Ratings!');
  console.log('Test login with owner1@example.com or user1@example.com (Password: password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
