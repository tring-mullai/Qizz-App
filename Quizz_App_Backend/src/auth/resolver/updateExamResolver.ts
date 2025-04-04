import { updateExamService } from '../service/updateExamService';

export const updateExamResolver = {
  Mutation: {
    customUpdateExam: async (_query: any, args: any, _context: any, _resolveInfo: any) => {
      return updateExamService(args.input);
    }
  }
};