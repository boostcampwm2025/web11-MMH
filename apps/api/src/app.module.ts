import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmModuleOptions } from './configs/typeorm.config';
import { AnswerEvaluationModule } from './answer-evaluation/answer-evaluation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AnswerEvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
