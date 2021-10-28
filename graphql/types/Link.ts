import { extendType, objectType, intArg, stringArg } from "nexus";
import {User} from'./User';

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.string('id');
        t.string('title');
        t.string('description');
        t.string('url');
        t.string('imageUrl');
        t.string('category');
        t.list.field('users', {
            type: User,
            async resolve(parent, _args, context) {
                return await context.prisma.link
                    .findUnique({
                        where: {
                            id: parent.id
                        }
                    })
                    .users();
            }
        })
    }
})

export const Edge = objectType({
    name: 'Edge',
    definition(t) {
        t.string('cursor');
        t.field('node', {
            type: Link
        })
    }
})

export const PageInfo = objectType({
    name: 'PageInfo',
    definition(t) {
        t.string('endCursor'),
        t.boolean('hasNextPage')
    }
})

export const Response = objectType({
    name: 'Response',
    definition(t) {
        t.field('pageInfo', {type: PageInfo});
        t.list.field('edges', {
            type: Edge
        })
    }
})

// export const LinksQuery = extendType({
//     type: 'Query',
//     definition(t) {
//         t.nonNull.list.field('links', {
//             type: 'Link',
//             resolve(_parent, _args, context) {
//                 return context.prisma.link.findMany()
//             }
//         })
//     }
// })

// get ALl Links
export const LinksQuery = extendType({
    type: "Query",
    definition(t) {
      t.field("links", {
        type: "Response",
        args: {
          first: intArg(),
          after: stringArg(),
        },
        async resolve(_parent, args, ctx) {
          let queryResults = null;
  
          if (args.after) {
            queryResults = await ctx.prisma.link.findMany({
              take: args.first,
              skip: 1,
              cursor: {
                id: args.after,
              },
            });
          } else {
            queryResults = await ctx.prisma.link.findMany({
              take: args.first,
            });
          }
  
          if (queryResults.length > 0) {
            // last element
            const lastLinkInResults = queryResults[queryResults.length - 1];
            // cursor we'll return
            const myCursor = lastLinkInResults.id;
  
            // queries after the cursor to check if we have nextPage
            const secondQueryResults = await ctx.prisma.link.findMany({
              take: args.first,
              cursor: {
                id: myCursor,
              },
            });
  
            const result = {
              pageInfo: {
                endCursor: myCursor,
                hasNextPage: secondQueryResults.length >= args.first,
              },
              edges: queryResults.map((link) => ({
                cursor: link.id,
                node: link,
              })),
            };
  
            return result;
          }
          return {
            pageInfo: {
              endCursor: null,
              hasNextPage: false,
            },
            edges: [],
          };
        },
      });
    },
  });