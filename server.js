const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLScalarType} = require("graphql")
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

const RootMutationType = new GraphQLObjectType({
    name:"Mutation",
    description : 'Root Mutation',
    fields:()=>({
        addBook:{
            type:BookType,
            description:'Add a book',
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                authorId:{type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const book = {id:books.length+1,name:arags.namem,authorId:args.authorId}
                books.push(book)
                return book 
            }
        },
        addAuthor:{
            type:AuthorType,
            description:'Add a Author',
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve:(parent,args)=>{
                const author = {id:books.length+1,name:arags.namem}
                authors.push(author)
                return author 
            }
        }
    })
     
})

const schema =  new GraphQLSchema({
    query:RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000,()=> console.log(`Sever Running on port ${port}`))