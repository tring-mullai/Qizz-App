import { makeExtendSchemaPlugin } from 'graphile-utils';
import { attendeesSchema } from '../schema/attendeesSchema';
import { attendeesResolver } from '../resolver/attendeesResolver';

export const attendeesPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: attendeesSchema,
    resolvers: attendeesResolver
  };
});