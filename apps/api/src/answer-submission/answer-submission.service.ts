import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerSubmission } from './entities/answer-submission.entity';
import { QuizMode } from '../answer-submission/answer-submission.constants';
import { AnswerSubmissionResponseDto } from './dtos/answer-submission-response.dto';

@Injectable()
export class AnswerSubmissionService {
  constructor(
    @InjectRepository(AnswerSubmission)
    private readonly answerSubmissionRepository: Repository<AnswerSubmission>,
  ) {}

  async getHistoryListByQuestionId(
    userId: number,
    questionId: number,
  ): Promise<AnswerSubmissionResponseDto[]> {
    const submissions = await this.answerSubmissionRepository.find({
      where: {
        userId,
        questionId,
        quizMode: QuizMode.DAILY,
      },
      order: {
        submittedAt: 'DESC',
      },
    });

    return submissions.map((submission) => ({
      id: submission.id,
      questionId: submission.questionId,
      submittedAt: submission.submittedAt,
      audioAssetId: submission.audioAssetId,
      evaluationStatus: submission.evaluationStatus,
      sttStatus: submission.sttStatus,
      inputType: submission.inputType,
      answerContent: submission.rawAnswer,
      totalScore: submission.score,
      duration: submission.takenTime,
    }));
  }
}
