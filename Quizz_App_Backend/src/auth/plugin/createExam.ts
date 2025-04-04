import { makeExtendSchemaPlugin } from 'graphile-utils';
import { examSchema } from '../schema/examSchema';
import { examResolver } from '../resolver/examResolver';

export const examPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: examSchema,
    resolvers: examResolver
  };
});