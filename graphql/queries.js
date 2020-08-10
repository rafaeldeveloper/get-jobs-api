

import { Vacancy} from './types'
import { client} from '../database'

const graphql = require('graphql')
const joinMonster = require('join-monster')


export const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => "Hello world!"
    },
    vacancies: {
      type: new graphql.GraphQLList(Vacancy),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return client.query(sql)
        })
      }
    },
    vacancy: {
      type: Vacancy,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (await client.query("SELECT *  FROM VACANCIES WHERE ID = $1", [args.id])).rows[0]
        } catch (err) {
          throw new Error("Failed to list new vacancy")
        }
      }
    },
    //...
  })
})