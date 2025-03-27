// src/auth/plugin/updateExam.ts
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';
import { AppDataSource } from '../../db/ormconfig';
import { Question } from '../../entities/Question';

export const UpdateExamQuestionsPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input CustomUpdateQuestionInput {
        questionText: String!
        questionOptions: [String!]!
        correctOptionIndex: Int!
      }

      input CustomUpdateExamInput {
        examId: Int!
        questions: [CustomUpdateQuestionInput!]!
      }

      type CustomUpdateExamPayload {
        questions: [Question!]!
      }

      extend type Mutation {
        customUpdateExamQuestions(input: CustomUpdateExamInput!): CustomUpdateExamPayload
      }
    `,
    resolvers: {
      Mutation: {
        customUpdateExamQuestions: async (_query, args: { input: {
          examId: number;
          questions: Array<{
            questionText: string;
            questionOptions: string[];
            correctOptionIndex: number;
          }>;
        }}, _context, _resolveInfo) => {
          const { examId, questions } = args.input;
          const questionRepo = AppDataSource.getRepository(Question);
          
          await questionRepo.delete({ exam: { id: examId } });
          
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
            questions: savedQuestions
          };
        }
      }
    }
  };
});