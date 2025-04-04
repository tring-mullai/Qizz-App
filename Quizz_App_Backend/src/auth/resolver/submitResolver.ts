import { submitExamService } from '../service/submitService';

export const submitResolver = (build: any) => ({
  Mutation: {
    submitQuizScore: async (_query: any, args: any, _context: any, _resolveInfo: any) => {
      const savedScore = await submitExamService(args.input.score);
      
      return {
        score: savedScore,
        query: build.$$isQuery
      };
    }
  }
});