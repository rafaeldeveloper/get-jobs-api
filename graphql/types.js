const graphql = require('graphql')


export const Vacancy = new graphql.GraphQLObjectType({
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
  
  