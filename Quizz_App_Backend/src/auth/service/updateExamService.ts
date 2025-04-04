import { AppDataSource } from '../../db/ormconfig';
import { Question } from '../../entities/Question';
import { Exam } from '../../entities/Exam';

type UpdateQuestionInput = {
  questionText: string;
  questionOptions: string[];
  correctOptionIndex: number;
};

type UpdateExamInput = {
  examId: number;
  title: string;
  description: string;
  duration: number;
  questions: UpdateQuestionInput[];
};

export const updateExamService = async (input: UpdateExamInput) => {
  const { examId, title, description, duration, questions } = input;
  const examRepo = AppDataSource.getRepository(Exam);
  const questionRepo = AppDataSource.getRepository(Question);
  
  // Validate correctOptionIndex values
  questions.forEach((q) => {
    if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.questionOptions.length) {
      throw new Error(`Correct option index ${q.correctOptionIndex} is out of bounds for question: ${q.questionText}`);
    }
  });

  // Update exam details
  const exam = await examRepo.findOneBy({ id: examId });
  if (!exam) {
    throw new Error(`Exam with ID ${examId} not found`);
  }

  exam.title = title;
  exam.description = description;
  exam.duration = duration;
  await examRepo.save(exam);

  // Delete existing questions
  await questionRepo.delete({ exam: { id: examId } });
  
  // Create new question entities
  const questionEntities = questions.map(q => 
    questionRepo.create({
      text: q.questionText,
      options: q.questionOptions,
      correctAnswer: q.correctOptionIndex,
      exam: { id: examId }
    })
  );
  
  const savedQuestions = await questionRepo.save(questionEntities);
  
  return { 
    exam,
    questions: savedQuestions
  };
};