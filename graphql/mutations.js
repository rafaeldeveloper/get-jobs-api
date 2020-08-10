

import { Vacancy} from './types'
import { client} from '../database'

const graphql = require('graphql')


export const MutationRoot = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      vacancies: {
        type: Vacancy,
        args: {
          name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          company: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          salary: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          place: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
          description: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        },
        resolve: async (parent, args, context, resolveInfo) => {
          try {
            return (await client.query("INSERT INTO VACANCIES (name, company, salary, place, description ) VALUES ($1, $2, $3, $4, $5) RETURNING *", [args.name, args.company, args.salary, args.place, args.description])).rows[0]
          } catch (err) {
            throw new Error("Failed to insert new vacancy")
          }
        }
      },
      deleteVacancy: {
        type: Vacancy,
        args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
        resolve: async (parent, args, context, resolveInfo) => {
          try {
            return (await client.query("DELETE FROM VACANCIES WHERE ID = $1 RETURNING *", [args.id])).rows[0]
          } catch (err) {
            throw new Error("Failed to insert new vacancy")
          }
        }
      },
      updateVacancy: {
        type: Vacancy,
        args: {
          id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
          name: { type: graphql.GraphQLString },
          company: { type: graphql.GraphQLString },
          salary: { type: graphql.GraphQLString },
          place: { type: graphql.GraphQLString },
          description: { type: graphql.GraphQLString },
        },
        resolve: async (parent, args, context, resolveInfo) => {
          try {
            return (await client.query("UPDATE VACANCIES SET name=$2, company=$3, salary=$4, place=$5, description=$6  WHERE ID = $1  RETURNING *", [args.id, args.name, args.company, args.salary, args.place, args.description])).rows[0]
          } catch (err) {
            throw new Error("Failed to insert new vacancy")
          }
        }
      }
    })
  })
  
  
  