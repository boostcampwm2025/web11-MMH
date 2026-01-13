import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioAsset } from '../audio-stream/entities/audio-asset.entity';
import { Question } from '../question/entities/question.entity';
import { SttService } from '../stt/stt.service';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import {
  QuizMode,
  InputType,
  ProcessStatus,
} from './answer-submission.constants';
import { AnswerSubmission } from './entities/answer-submission.entity';
import { AnswerSubmissionResponseDto } from './dtos/answer-submission-response.dto';

@Injectable()
export class AnswerSubmissionService {
  constructor(
    @InjectRepository(AnswerSubmission)
    private readonly answerSubmissionRepository: Repository<AnswerSubmission>,
    @InjectRepository(AudioAsset)
    private readonly audioAssetRepository: Repository<AudioAsset>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly sttService: SttService,
  ) {}

  async submitAnswer(
    userId: number,
    submitAnswerDto: SubmitAnswerDto,
  ): Promise<AnswerSubmission> {
    const { audioAssetId, questionId } = submitAnswerDto;

    // Validate audio asset exists and has objectKey
    const audioAsset = await this.audioAssetRepository.findOne({
      where: { id: audioAssetId },
    });

    if (!audioAsset) {
      throw new NotFoundException(
        `Audio asset with ID ${audioAssetId} not found`,
      );
    }

    if (!audioAsset.objectKey) {
      throw new BadRequestException(
        `Audio asset ${audioAssetId} not uploaded to object storage, missing objectKey`,
      );
    }

    // Validate question exists
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    // Create answer submission
    const answerSubmission = this.answerSubmissionRepository.create({
      userId,
      questionId,
      audioAssetId,
      quizMode: QuizMode.DAILY,
      inputType: InputType.VOICE,
      rawAnswer: '', // Will be filled by STT callback
      takenTime: audioAsset.durationMs ?? 0,
      sttStatus: ProcessStatus.PENDING,
      evaluationStatus: ProcessStatus.PENDING,
    });

    const savedSubmission =
      await this.answerSubmissionRepository.save(answerSubmission);

    // Request STT asynchronously
    this.sttService.requestStt(audioAsset);

    return savedSubmission;
  }

  async updateSttResult(
    audioAssetId: number,
    sttText: string,
    isSuccess: boolean,
  ): Promise<AnswerSubmission> {
    // Find submission by audioAssetId
    const submission = await this.answerSubmissionRepository.findOne({
      where: { audioAssetId },
    });

    if (!submission) {
      throw new NotFoundException(
        `Answer submission with audioAssetId ${audioAssetId} not found`,
      );
    }

    // Update submission with STT result
    submission.rawAnswer = sttText;
    submission.sttStatus = isSuccess
      ? ProcessStatus.DONE
      : ProcessStatus.FAILED;

    return await this.answerSubmissionRepository.save(submission);
  }

  async findById(id: number): Promise<AnswerSubmission> {
    const submission = await this.answerSubmissionRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Answer submission with ID ${id} not found`);
    }

    return submission;
  }

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
