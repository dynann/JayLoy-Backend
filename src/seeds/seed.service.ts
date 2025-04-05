import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private accountService: AccountsService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_DATABASE === 'true') {
      await this.seed();
    }
  }

  async seed() {
    console.log('🌱 Starting automatic seeding...');
    
    await this.prisma.$executeRaw`TRUNCATE TABLE "User", "Category", "Currency" RESTART IDENTITY CASCADE`;

    await this.prisma.$executeRaw`
      INSERT INTO public."Currency" (name)
      VALUES ('Dollar');
    `;

    await this.prisma.$executeRaw`
      INSERT INTO public."Category" (id, name, type)
      VALUES (1, 'Food', 'EXPENSE'),
        (2, 'Transport', 'EXPENSE'),
        (3, 'Medicine', 'EXPENSE'),
        (4, 'Groceries', 'EXPENSE'),
        (5, 'Clothing', 'EXPENSE'),
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

    const  user = await  this.usersService.createOne({
      email: 'admin@gmail.com',
      password: 'adminpassword',
      gender: 'MALE',
    });
    
    await this.prisma.$executeRaw`
      INSERT INTO "Transaction" (amount, type, description, date, "categoryID", "accountID")
      VALUES
        (84321, 'INCOME', 'Freelance payment', '2025-02-21', 13, 1),
        (4567, 'EXPENSE', 'Grocery shopping', '2025-02-21', 3, 1),
        (23489, 'INCOME', 'Investment dividends', '2025-02-21', 12, 1),
        (1999, 'EXPENSE', 'Streaming service', '2025-02-21', 7, 1),
        (1500, 'INCOME', 'Monthly salary', '2025-02-21', 11, 1),
        (6543, 'EXPENSE', 'Fuel payment', '2025-02-21', 5, 1),
        (8950, 'EXPENSE', 'Coffee shop', '2025-02-21', 9, 1),
        (32476, 'INCOME', 'Bonus payment', '2025-02-21', 14, 1),
        (2345, 'EXPENSE', 'Book purchase', '2025-02-21', 2, 1),
        (15678, 'EXPENSE', 'Restaurant dinner', '2025-02-21', 6, 1),
        (49995, 'EXPENSE', 'Electronics repair', '2025-02-21', 4, 1),
        (7890, 'INCOME', 'Stock gains', '2025-02-21', 13, 1),
        (1234, 'EXPENSE', 'Public transport', '2025-02-21', 8, 1),
        (25600, 'INCOME', 'Consulting fee', '2025-01-21', 11, 1),
        (4500, 'EXPENSE', 'Gym membership', '2025-01-21', 10, 1),
        (67823, 'INCOME', 'Rental income', '2025-01-21', 14, 1),
        (3215, 'EXPENSE', 'Pharmacy items', '2025-01-21', 1, 1),
        (14567, 'EXPENSE', 'Home supplies', '2025-01-21', 4, 1),
        (8999, 'INCOME', 'Online sale', '2025-01-21', 12, 1),
        (23045, 'EXPENSE', 'Car maintenance', '2025-01-21', 5, 1),
        (5678, 'INCOME', 'Cashback reward', '2025-01-21', 13, 1),
        (1599, 'EXPENSE', 'Mobile plan', '2025-03-21', 7, 1),
        (43210, 'EXPENSE', 'Furniture purchase', '2025-01-21', 3, 1),
        (76543, 'INCOME', 'Project milestone', '2025-01-21', 11, 1),
        (2995, 'EXPENSE', 'Movie tickets', '2025-01-21', 9, 1),
        (12345, 'INCOME', 'Tax refund', '2025-03-21', 14, 1),
        (8765, 'EXPENSE', 'Clothing purchase', '2025-01-21', 2, 1),
        (34567, 'EXPENSE', 'Home renovation', '2025-03-20', 6, 1),
        (4321, 'INCOME', 'Interest income', '2025-03-20', 12, 1),
        (6500, 'EXPENSE', 'Software license', '2025-03-20', 8, 1),
        (21050, 'INCOME', 'Side hustle', '2025-03-21', 13, 1),
        (1950, 'EXPENSE', 'Fast food', '2025-03-21', 10, 1),
        (4500, 'EXPENSE', 'Insurance payment', '2025-03-21', 4, 1),
        (9530, 'INCOME', 'Gift received', '2025-03-21', 14, 1),
        (7525, 'EXPENSE', 'Pet supplies', '2025-03-21', 1, 1),
        (19999, 'EXPENSE', 'Smartwatch', '2025-03-21', 5, 1),
        (54321, 'INCOME', 'Contract work', '2025-03-21', 11, 1),
        (2375, 'EXPENSE', 'Office supplies', '2025-03-21', 7, 1),
        (8888, 'INCOME', 'Dividend payout', '2025-03-21', 12, 1),
        (15600, 'EXPENSE', 'Hotel booking', '2025-03-21', 9, 1),
        (6789, 'EXPENSE', 'Parking fee', '2025-03-21', 3, 1),
        (23456, 'INCOME', 'Bonus', '2025-03-21', 14, 1),
        (1299, 'EXPENSE', 'Music subscription', '2025-03-21', 8, 1),
        (45678, 'EXPENSE', 'Laptop repair', '2025-03-22', 2, 1),
        (7650, 'INCOME', 'Freelance project', '2025-03-22', 13, 1),
        (3415, 'EXPENSE', 'Laundry service', '2025-03-22', 10, 1),
        (12345, 'INCOME', 'Commission', '2025-03-22', 11, 1),
        (8888, 'INCOME', 'Dividend payout', '2025-04-01', 12, 1),
        (15600, 'EXPENSE', 'Hotel booking', '2025-04-01', 9, 1),
        (6789, 'EXPENSE', 'Parking fee', '2025-04-01', 3, 1),
        (23456, 'INCOME', 'Bonus', '2025-04-01', 14, 1),
        (1299, 'EXPENSE', 'Music subscription', '2025-04-01', 8, 1),
        (45678, 'EXPENSE', 'Laptop repair', '2025-04-01', 2, 1),
        (7650, 'INCOME', 'Freelance project', '2025-04-01', 13, 1),
        (3415, 'EXPENSE', 'Laundry service', '2025-04-01', 10, 1),
        
        (15600, 'EXPENSE', 'Hotel booking', '2025-04-01', 9, 1),
        (6789, 'EXPENSE', 'Parking fee', '2025-04-01', 3, 1),
        (23456, 'INCOME', 'Bonus', '2025-04-01', 14, 1),
        (1299, 'EXPENSE', 'Music subscription', '2025-04-01', 8, 1),
        (45678, 'EXPENSE', 'Daughter Gift', '2025-04-01', 5, 1),
        (7650, 'EXPENSE', 'Son Gift', '2025-04-01', 5, 1),
        (3415, 'EXPENSE', 'Husband Gift', '2025-04-01', 5, 1),
        
        (12345, 'INCOME', 'Commission', '2025-04-01', 11, 1);

    `;
    await this.accountService.verifyBalance(user.id);
    console.log('✅ Automatic seeding completed!');
  }
} 