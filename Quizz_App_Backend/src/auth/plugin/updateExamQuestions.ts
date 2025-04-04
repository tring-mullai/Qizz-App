import { makeExtendSchemaPlugin } from 'graphile-utils';
import { updateExamSchema } from '../schema/updateExamSchema';
import { updateExamResolver } from '../resolver/updateExamResolver';

export const updateExamPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: updateExamSchema,
    resolvers: updateExamResolver
  };
});