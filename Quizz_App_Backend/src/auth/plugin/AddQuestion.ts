// src/auth/plugin/addQuestions.ts
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';
import { AppDataSource } from '../../db/ormconfig';
import { Question } from '../../entities/Question';

export const AddQuestionsPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input CustomAddQuestionInput {
        questionText: String!
        questionOptions: [String!]!
        correctOptionIndex: Int!
      }
      input CustomAddQuestionsInput {
        examId: Int!
        questions: [CustomAddQuestionInput!]!
      }

      type CustomAddQuestionsPayload {
        questions: [Question!]!
      }

      extend type Mutation {
        customAddQuestionsToExam(input: CustomAddQuestionsInput!): CustomAddQuestionsPayload
      }
    `,
    resolvers: {
      Mutation: {
        customAddQuestionsToExam: async (_query, args: { input: {
          examId: number;
          questions: Array<{
            questionText: string;
            questionOptions: string[];
            correctOptionIndex: number;
          }>;
        }}, _context, _resolveInfo) => {
          const { examId, questions } = args.input;
          const questionRepo = AppDataSource.getRepository(Question);
          
          // Validate correctOptionIndex values
          questions.forEach(q => {
            if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.questionOptions.length) {
              throw new Error(`Correct option index ${q.correctOptionIndex} is out of bounds for question: ${q.questionText}`);
            }
          });

          const questionEntities = questions.map(q => ({
            text: q.questionText,
            options: q.questionOptions,
            correctAnswer: q.correctOptionIndex,
            exam: { id: examId }
          }));
          
          const savedQuestions = await questionRepo.save(questionEntities);
          
          return { 
            questions: savedQuestions 
          };
        }
      }
    }
  };
});