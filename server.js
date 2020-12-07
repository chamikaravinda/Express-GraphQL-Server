const express = require('express')
const expressGraphQL = require('express-graphql')
const {GraphQLSchema,GraphQLObjectType} = require("graphql")
const port =  process.env.port || 5000
const app = express()



app.listen(5000,()=> console.log(`Sever Running on port ${port}`))