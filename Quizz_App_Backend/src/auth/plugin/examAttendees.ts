// src/auth/plugin/examAttendees.ts
import { makeExtendSchemaPlugin, gql } from 'graphile-utils';
import { AppDataSource } from '../../db/ormconfig';
import { Score } from '../../entities/Score';

export const ExamAttendeesPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      type ExamAttendee {
        user: User!
        score: Score!
      }

      extend type Query {
        examAttendees(examId: Int!): [ExamAttendee!]!
      }
    `,
    resolvers: {
      Query: {
        examAttendees: async (_query, args, _context, _resolveInfo) => {
          const scoreRepo = AppDataSource.getRepository(Score);
          
          const scores = await scoreRepo.find({
            where: { exam: { id: args.examId } },
            relations: ['user']
          });
          
          return scores.map(score => ({
            user: score.user,
            score
          }));
        }
      }
    }
  };
});