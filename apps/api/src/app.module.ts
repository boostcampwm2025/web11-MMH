import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEvaluationModule } from './answer-evaluation/answer-evaluation.module';
import { AnswerSubmissionModule } from './answer-submission/answer-submission.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioStreamModule } from './audio-stream/audio-stream.module';
import { typeOrmModuleOptions } from './configs/typeorm.config';
import { StreaksModule } from './streaks/streaks.module';
import { UserModule } from './user/user.module';
import { SttModule } from './stt/stt.module';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    UserModule,
    AnswerEvaluationModule,
    AnswerSubmissionModule,
    AudioStreamModule,
    CategoryModule,
    QuestionModule,
    StreaksModule,
    SttModule,
    ObjectStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
