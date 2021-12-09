import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [GraphQLModule.forRoot({})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
