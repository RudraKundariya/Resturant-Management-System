import { PrismaClient, UserRole, TableStatus, ActorType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seed ---');

  // 1. Clean existing records in development
  await prisma.tableStatusLog.deleteMany();
  await prisma.tableAlert.deleteMany();
  await prisma.cleaningTask.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.tableSession.deleteMany();
  await prisma.modifier.deleteMany();
  await prisma.modifierGroup.deleteMany();
  await prisma.itemVariant.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.table.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.staffShift.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();

  // 2. Create Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'The Grand Masala Bistro',
      slug: 'grand-masala-bistro',
      address: '101, Connaught Place, New Delhi, India',
      phone: '+91 98765 43210',
      gstin: '07AAAAA0000A1Z5',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      settings: {
        gstRate: 5.0,
        serviceChargeRate: 0.0,
        currency: 'INR',
        orderApprovalRequired: false,
        guestPhoneRequired: false,
        sessionIdleTimeoutMin: 15,
        alertThresholds: {
          callWaiterEscalationSec: 90,
          requestBillEscalationSec: 120,
          longWaitWithoutOrderMin: 10,
          orderDelayedToleranceMin: 5,
          unattendedTableMin: 25,
          longStayMin: 90,
          cleaningDelayMin: 5,
        },
      },
    },
  });

  console.log(`Created restaurant: ${restaurant.name} (${restaurant.id})`);

  // 3. Create Staff Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const pin1111 = await bcrypt.hash('1111', 10);
  const pin2222 = await bcrypt.hash('2222', 10);
  const pin3333 = await bcrypt.hash('3333', 10);
  const pin4444 = await bcrypt.hash('4444', 10);

  const owner = await prisma.user.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Vikram Singh (Owner)',
      email: 'owner@bistro.com',
      passwordHash,
      role: UserRole.OWNER,
    },
  });

  const manager = await prisma.user.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Priya Sharma (Manager)',
      email: 'manager@bistro.com',
      passwordHash,
      role: UserRole.MANAGER,
    },
  });

  const waiter1 = await prisma.user.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Rohan (Waiter)',
      pinHash: pin1111,
      role: UserRole.WAITER,
    },
  });

  const chef = await prisma.user.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Chef Rajesh',
      pinHash: pin3333,
      role: UserRole.KITCHEN,
    },
  });

  const cleaner = await prisma.user.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Sunil (Cleaner)',
      pinHash: pin4444,
      role: UserRole.CLEANER,
    },
  });

  console.log('Created staff users (Owner, Manager, Waiter, Kitchen, Cleaner).');

  // 4. Create Floors
  const indoorFloor = await prisma.floor.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Indoor Dining Hall',
      sortOrder: 1,
    },
  });

  const terraceFloor = await prisma.floor.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Terrace Garden',
      sortOrder: 2,
    },
  });

  // 5. Create Tables
  const tablesData = [
    { label: 'T01', capacity: 2, shape: 'square', floorId: indoorFloor.id, x: 50, y: 50 },
    { label: 'T02', capacity: 4, shape: 'square', floorId: indoorFloor.id, x: 180, y: 50 },
    { label: 'T03', capacity: 4, shape: 'square', floorId: indoorFloor.id, x: 310, y: 50 },
    { label: 'T04', capacity: 6, shape: 'rect', floorId: indoorFloor.id, x: 50, y: 180 },
    { label: 'T05', capacity: 2, shape: 'round', floorId: indoorFloor.id, x: 180, y: 180 },
    { label: 'T06', capacity: 8, shape: 'rect', floorId: indoorFloor.id, x: 310, y: 180 },
    { label: 'T07', capacity: 4, shape: 'round', floorId: terraceFloor.id, x: 60, y: 60 },
    { label: 'T08', capacity: 4, shape: 'round', floorId: terraceFloor.id, x: 200, y: 60 },
    { label: 'T09', capacity: 2, shape: 'square', floorId: terraceFloor.id, x: 60, y: 200 },
    { label: 'T10', capacity: 6, shape: 'rect', floorId: terraceFloor.id, x: 200, y: 200 },
  ];

  for (const t of tablesData) {
    const qrToken = `srms_${restaurant.slug}_${t.label.toLowerCase()}_${crypto.randomBytes(6).toString('hex')}`;
    await prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        floorId: t.floorId,
        label: t.label,
        capacity: t.capacity,
        shape: t.shape,
        posX: t.x,
        posY: t.y,
        status: TableStatus.AVAILABLE,
        qrToken,
        assignedWaiterId: waiter1.id,
      },
    });
  }

  console.log(`Created 10 tables across 2 floors with unique QR tokens.`);

  // 6. Create Menu Categories & Items
  const catStarters = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: 'Starters & Appetizers', sortOrder: 1 },
  });

  const catMains = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: 'Main Course', sortOrder: 2 },
  });

  const catBreads = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: 'Breads & Rice', sortOrder: 3 },
  });

  const catDrinks = await prisma.menuCategory.create({
    data: { restaurantId: restaurant.id, name: 'Beverages & Desserts', sortOrder: 4 },
  });

  // Paneer Tikka
  const paneerTikka = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catStarters.id,
      name: 'Paneer Tikka Angaare',
      description: 'Charcoal-grilled cottage cheese cubes marinated in spiced hung curd with peppers and onions.',
      price: 320.00,
      taxRate: 5.0,
      isVeg: true,
      prepTimeMin: 15,
      tags: ['Bestseller', 'Vegetarian', 'Spicy'],
      sortOrder: 1,
    },
  });

  // Butter Chicken
  const butterChicken = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catMains.id,
      name: 'Murgh Makhani (Butter Chicken)',
      description: 'Tender chicken tandoori pieces simmered in rich satin-smooth tomato, butter and cashew gravy.',
      price: 450.00,
      taxRate: 5.0,
      isVeg: false,
      prepTimeMin: 20,
      tags: ['Chef Special', 'Non-Veg', 'Bestseller'],
      sortOrder: 1,
    },
  });

  // Variants for Butter Chicken (Half / Full)
  await prisma.itemVariant.createMany({
    data: [
      { itemId: butterChicken.id, name: 'Half (2 pcs)', price: 290.00 },
      { itemId: butterChicken.id, name: 'Full (4 pcs)', price: 450.00 },
    ],
  });

  // Dal Makhani
  await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catMains.id,
      name: 'Dal Makhani Bukhara',
      description: 'Slow-cooked black lentils simmered overnight with butter, cream, and aromatic spices.',
      price: 340.00,
      taxRate: 5.0,
      isVeg: true,
      prepTimeMin: 10,
      tags: ['Classic', 'Vegetarian'],
      sortOrder: 2,
    },
  });

  // Garlic Naan
  await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catBreads.id,
      name: 'Garlic Butter Naan',
      description: 'Clay-oven fired flatbread topped with minced roasted garlic and fresh cilantro butter.',
      price: 75.00,
      taxRate: 5.0,
      isVeg: true,
      prepTimeMin: 8,
      tags: ['Vegetarian'],
      sortOrder: 1,
    },
  });

  // Mango Lassi
  await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: catDrinks.id,
      name: 'Kesariya Mango Lassi',
      description: 'Traditional Punjabi churned yoghurt drink blended with Alphonso mango pulp and saffron.',
      price: 150.00,
      taxRate: 5.0,
      isVeg: true,
      prepTimeMin: 5,
      tags: ['Refreshing', 'Bestseller'],
      sortOrder: 1,
    },
  });

  console.log('Seeded menu items, variants, and categories.');
  console.log('--- Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

