import { AppDataSource } from '../../db/ormconfig';
import { Score } from '../../entities/Score';
import { Exam } from '../../entities/Exam';
import { User } from '../../entities/User';

type ScoreSubmissionInput = {
  examId: number;
  userId: number;
  percentage: number;
  answers: string;
};

export const submitExamService = async (scoreData: ScoreSubmissionInput) => {
  const { examId, userId, percentage, answers } = scoreData;
  
  // Start a transaction
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Get repositories
    const scoreRepo = queryRunner.manager.getRepository(Score);
    const examRepo = queryRunner.manager.getRepository(Exam);
    const userRepo = queryRunner.manager.getRepository(User);
    
    // Check if user already has a score for this exam
    const existingScore = await scoreRepo.findOne({
      where: {
        examId,
        userId
      }
    });
    
    if (existingScore) {
      throw new Error('You have already taken this exam');
    }
    
    // Verify exam and user exist
    const exam = await examRepo.findOne({ where: { id: examId } });
    const user = await userRepo.findOne({ where: { id: userId } });
    
    if (!exam) throw new Error('Exam not found');
    if (!user) throw new Error('User not found');
    
    // Create new score
    const newScore = new Score();
    newScore.examId = examId;
    newScore.userId = userId;
    newScore.percentage = percentage;
    newScore.answers = answers;
    
    // Save the score
    const savedScore = await scoreRepo.save(newScore);
    
    // Commit transaction
    await queryRunner.commitTransaction();
    
    return savedScore;
  } catch (error) {
    // Rollback on error
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};