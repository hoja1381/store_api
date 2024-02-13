import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { ProductModule } from 'src/product/product.module';
import { UserService } from 'src/user/service/user.service';

@Module({
  imports: [ProductModule],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
