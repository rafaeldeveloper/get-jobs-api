
const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const gql = require('graphql-tag')
const graphql = require('graphql')
const joinMonster = require('join-monster')

const app = express()
require('dotenv').config()
app.use(cors())



const { Client } = require('pg')

const client = new Client({
  connectionString:  process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();







const rootValue = {
  hello: () => 'Hello, world'
}


const Vacancy = new graphql.GraphQLObjectType({
  name: 'Vacancy',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    company: { type: graphql.GraphQLString },
    salary: { type: graphql.GraphQLString },
    place: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
  })
});
    
Vacancy._typeConfig = {
  sqlTable: 'vacancies',
  uniqueKey: 'id',
}
    



const MutationRoot = new graphql.GraphQLObjectType({
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
    



const QueryRoot = new graphql.GraphQLObjectType({
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

const schema = new graphql.GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot
});


app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

const port = process.env.PORT || 4000
app.listen(port)
console.log(`Running a GraphQL API server at localhost:${port}/graphql`)
