// src/auth/plugin/createExam.ts
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';
import { AppDataSource } from '../../db/ormconfig';
import { Exam } from '../../entities/Exam';
import { Question } from '../../entities/Question';

export const CreateExamWithQuestionsPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input CustomExamQuestionInput {
        questionText: String!
        questionOptions: [String!]!
        correctOptionIndex: Int!
      }

      input CustomCreateExamInput {
        examTitle: String!
        examDescription: String!
        examDuration: Int!
        creatorId: Int!
        questions: [CustomExamQuestionInput!]!
      }

      type CustomCreateExamPayload {
        exam: Exam
      }

      extend type Mutation {
        customCreateExamWithQuestions(input: CustomCreateExamInput!): CustomCreateExamPayload
      }
    `,
    resolvers: {
      Mutation: {
        customCreateExamWithQuestions: async (_query, args: { input: { 
          examTitle: string;
          examDescription: string;
          examDuration: number;
          creatorId: number;
          questions: Array<{
            questionText: string;
            questionOptions: string[];
            correctOptionIndex: number;
          }>;
        }}, _context, _resolveInfo) => {
          const { examTitle, examDescription, examDuration, creatorId, questions } = args.input;
          
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
        }
      }
    }
  };
});