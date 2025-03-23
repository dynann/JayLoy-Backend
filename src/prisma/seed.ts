import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from './prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { TransactionsService } from 'src/transactions/transactions.service';

export async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const prismaService = app.get(PrismaService);
  const categoriesService = app.get(CategoriesService);
  const transactionsService = app.get(TransactionsService);
  console.log('🌱 Seeding the database...');
  await prismaService.$executeRaw`TRUNCATE TABLE "User", "Category", "Currency" RESTART IDENTITY CASCADE`;

  // Create currency
  await prismaService.$executeRaw`
    INSERT INTO public."Currency" (name)
    VALUES ('Dollar');
  `;

  // Create categories
  await prismaService.$executeRaw`
    INSERT INTO public."Category" (id, name, type)
    VALUES
      (1, 'Food', 'EXPENSE'),
      (2, 'Transport', 'EXPENSE'),
      (3, 'Medicine', 'EXPENSE'),
      (4, 'Groceries', 'EXPENSE'),
      (5, 'Savings', 'EXPENSE'),
      (6, 'Rent', 'EXPENSE'),
      (7, 'Gifts', 'EXPENSE'),
      (8, 'Entertainment', 'EXPENSE'),
      (9, 'Internet', 'EXPENSE'),
      (10, 'Transfer', 'EXPENSE'),
      (11, 'Salary', 'INCOME'),
      (12, 'Freelance', 'INCOME'),
      (13, 'Invest', 'INCOME'),
      (14, 'Recieve', 'INCOME');
  `;

  await usersService.createOne({
    email: 'admin@gmail.com',
    password: 'adminpassword',
  });

  console.log('✅ Seeding completed!');
  await app.close();
}

seed()
  .catch((error) => {
    console.error('Error seeding the database:', error);
    process.exit(1);
  });