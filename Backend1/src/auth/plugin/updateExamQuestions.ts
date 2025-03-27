// src/auth/plugin/updateExamQuestions.ts
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';
import { AppDataSource } from '../../db/ormconfig';
import { Question } from '../../entities/Question';
interface QuestionInput {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface UpdateExamQuestionsArgs {
  input: {
    examId: number;
    questions: QuestionInput[];
  };
}

export const UpdateExamQuestionsPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      input UpdateExamQuestionsInput {
        examId: Int!
        questions: [QuestionInputType!]!
      }

      type UpdateExamQuestionsPayload {
        questions: [Question!]!
      }

      extend type Mutation {
        updateExamQuestions(input: UpdateExamQuestionsInput!): UpdateExamQuestionsPayload
      }
    `,
    resolvers: {
      Mutation: {
        updateExamQuestions: async (_query, args: UpdateExamQuestionsArgs, _context, _resolveInfo) => {
          const { examId, questions } = args.input;
          const questionRepo = AppDataSource.getRepository(Question);
          
          // First delete existing questions
          await questionRepo.delete({ exam: { id: examId } });
          
          // Create new questions with proper field names
          const questionEntities = questions.map((q: QuestionInput) => 
            questionRepo.create({
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              exam: { id: examId }
            })
          );
          
          // Save and get the full entities with IDs
          const savedQuestions = await questionRepo.save(questionEntities);
          
          return { 
            questions: savedQuestions
          };
        }
      }
    }
  };
});