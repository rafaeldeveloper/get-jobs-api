
import { MutationRoot } from './graphql/mutations';
import { QueryRoot } from './graphql/queries';

const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const graphql = require('graphql')

const app = express()
require('dotenv').config()
app.use(cors())


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
