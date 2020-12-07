const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull} = require("graphql")
const port =  process.env.port || 5000
const {authors,books} = require ('./data.js');

const app = express()

const  AuthorType = new GraphQLObjectType({
    name:"Author",
    description:"This is a author",
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        books:{
            type: new GraphQLList(BookType),
            resolve: (author)=>{
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const  BookType = new GraphQLObjectType({
    name:"Book",
    description:"This is a book written by author",
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        author:{
            type:AuthorType,
            resolve:(book)=>{
                return authors.find(author=> author.id ===  book.authorId)
            }
        }
    })
})
const RootQueryType =  new GraphQLObjectType({
    name:'Query',
    description:'Root Query',
    fields:()=>({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
              id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books:{
            type:GraphQLList(BookType),
            description:'List of all Books',
            resolve:()=>books
        },
        author:{
            type:AuthorType,
            description:'A single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve:(parent,args)=>authors.find(author => author.id === args.id)
        },
        authors:{
            type:GraphQLList(AuthorType),
            description:'List of all Authors',
            resolve:()=>authors
        }
    })
})

const schema =  new GraphQLSchema({
    query:RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000,()=> console.log(`Sever Running on port ${port}`))