import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CardModule } from 'src/card/card.module';

@Module({
  imports: [CardModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
