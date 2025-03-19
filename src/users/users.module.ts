import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BudgetsModule } from 'src/budgets/budgets.module';

@Module({
  imports: [AccountsModule, BudgetsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}