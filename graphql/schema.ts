// import {gql} from 'apollo-server-micro'

// export const typeDefs = gql`
//     scalar Date

//     type Link {
//         id: String
//         title: String
//         description: String
//         url: String
//         category: String
//         imageUrl: String
//         users: [String]
//     }

//     type User {
//        id: String
//        createdAt: Date
//        email: String
//        role: String
//        bookmarks: [Link]
//     }

//     type Query {
//         links: [Link]!
//         users: [User]!
//     }
// `

import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './types';

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    schema: join(process.cwd(), 'graphql', 'schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: join(process.cwd(), 'graphql', 'context.ts'),
  },
});