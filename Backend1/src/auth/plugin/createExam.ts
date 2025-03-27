// src/auth/plugin/createExam.ts
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';
import { AppDataSource } from '../../db/ormconfig';
import { Exam } from '../../entities/Exam';
import { Question } from '../../entities/Question';

interface QuestionInput {
  text: string;
  options: string[];
  correctAnswer: number;
}

export const CreateExamWithQuestionsPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input CreateExamInput {
        title: String!
        description: String!
        duration: Int!
        creatorId: Int!
      }

      type CreateExamWithQuestionsPayload {
        exam: Exam
      }

      extend type Mutation {
        createExamWithQuestions(
          title: String!
          description: String!
          duration: Int!
          creatorId: Int!
          questions: [QuestionInputType!]!
        ): CreateExamWithQuestionsPayload
      }
    `,
    resolvers: {
      Mutation: {
        createExamWithQuestions: async (_query, args, _context, _resolveInfo) => {
          const { title, description, duration, creatorId, questions } = args;
          
          const examRepo = AppDataSource.getRepository(Exam);
          const questionRepo = AppDataSource.getRepository(Question);
          
          const exam = examRepo.create({
            title,
            description,
            duration,
            creator: { id: creatorId }
          });
          
          await examRepo.save(exam);
          
          const questionEntities = questions.map((q: QuestionInput) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            exam: { id: exam.id }
          }));
          
          await questionRepo.save(questionEntities);
          
          return { exam };
        }
      }
    }
  };
});