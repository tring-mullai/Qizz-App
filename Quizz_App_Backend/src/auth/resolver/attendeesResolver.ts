import { getExamAttendeesService } from '../service/attendeeService';

export const attendeesResolver = {
  Query: {
    examAttendees: async (_query: any, args: any, _context: any, _resolveInfo: any) => {
      return getExamAttendeesService(args.examId);
    }
  }
};