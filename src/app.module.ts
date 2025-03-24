import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { BudgetsModule } from './budgets/budgets.module';
import { AccountsModule } from './accounts/accounts.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './auth/strategy/google.strategy';
import { SeedService } from './seeds/seed.service';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    BudgetsModule,
    AccountsModule,
    CurrenciesModule,
    TransactionsModule,
    CategoriesModule,
    AuthModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'google'}),
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    GoogleStrategy,
  ],
})
export class AppModule {}
