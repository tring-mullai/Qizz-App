import { makeExtendSchemaPlugin } from 'graphile-utils';
import { submitSchema } from '../schema/submitSchema';
import { submitResolver } from '../resolver/submitResolver';

export const submitPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: submitSchema,
    resolvers: submitResolver(build)
  };
});