import { createExamService } from '../service/examService';

export const examResolver = {
  Mutation: {
    customCreateExamWithQuestions: async (_query: any, args: any, _context: any, _resolveInfo: any) => {
      return createExamService(args.input);
    }
  }
};