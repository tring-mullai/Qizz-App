import { AppDataSource } from '../../db/ormconfig';
import { Exam } from '../../entities/Exam';
import { Question } from '../../entities/Question';

type CreateExamInput = {
  examTitle: string;
  examDescription: string;
  examDuration: number;
  creatorId: number;
  questions: Array<{
    questionText: string;
    questionOptions: string[];
    correctOptionIndex: number;
  }>;
};

export const createExamService = async (input: CreateExamInput) => {
  const { examTitle, examDescription, examDuration, creatorId, questions } = input;
  
  const examRepo = AppDataSource.getRepository(Exam);
  const questionRepo = AppDataSource.getRepository(Question);
  
  const exam = examRepo.create({
    title: examTitle,
    description: examDescription,
    duration: examDuration,
    creator: { id: creatorId }
  });
  
  await examRepo.save(exam);
  
  const questionEntities = questions.map(q => ({
    text: q.questionText,
    options: q.questionOptions,
    correctAnswer: q.correctOptionIndex,
    exam: { id: exam.id }
  }));
  
  await questionRepo.save(questionEntities);
  
  return { exam };
};