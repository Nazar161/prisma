import { objectType, enumType } from "nexus";
import { Link } from "./Link";

export const User = objectType({
    name: 'User',
    definition(t) {
        t.string('id');
        t.string('email');
        t.string('name');
        t.string('image');
        t.field('role', {type: Role});
        t.list.field('bookmarks', {
            type: Link,
            async resolve(_parent, _args, context) {
                return await context.prisma.user
                    .findUnique({
                        where: {
                            id: _parent.id
                        }
                    })
                    .bookmarks()
            }
        })
    }
})

const Role = enumType({
    name: 'Role',
    members: ['USER', 'ADMIN']
})