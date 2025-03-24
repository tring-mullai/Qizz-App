import {registerSchema} from '../schema/registerSchema'
import { makeExtendSchemaPlugin } from 'graphile-utils'
import { registerResolver } from '../resolver/registerResolver'

export const authPlugin = makeExtendSchemaPlugin((build) => {
    return {
        typeDefs: registerSchema,
        resolvers: registerResolver
    }
})