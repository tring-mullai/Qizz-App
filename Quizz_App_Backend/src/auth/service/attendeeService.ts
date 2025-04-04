import { AppDataSource } from '../../db/ormconfig';
import { Score } from '../../entities/Score';

export const getExamAttendeesService = async (examId: number) => {
  const scoreRepo = AppDataSource.getRepository(Score);
  
  const scores = await scoreRepo.find({
    where: { exam: { id: examId } },
    relations: ['user']
  });
  
  return scores.map(score => ({
    user: score.user,
    score
  }));
};