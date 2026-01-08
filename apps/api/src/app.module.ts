import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmModuleOptions } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { AnswerEvaluationModule } from './answer-evaluation/answer-evaluation.module';
import { AudioStreamModule } from './audio-stream/audio-stream.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    UserModule,
    AnswerEvaluationModule,
    AudioStreamModule,
    CategoryModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
