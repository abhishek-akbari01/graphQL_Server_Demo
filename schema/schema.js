const graphql = require('graphql')
const _ = require('lodash')
const Author = require('../models/author')
const Book = require('../models/book')


const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql

// fake data
// var books = [
//     {name:'Name of the wind',genre:'Fantasy', id:'1',authorId:'1'},
//     {name:'The Final Emapire',genre:'Thriller', id:'2',authorId:'2'},
//     {name:'The Long Earth',genre:'sci-fi', id:'3',authorId:'3'},
//     {name:'The Journey',genre:'novel',id:'4',authorId:'2'},
//     {name:'The hero of ages',genre:'novel',id:'5',authorId:'3'},
//     {name:'The color of magic',genre:'novel',id:'6',authorId:'4'},
//     {name:'The light fantastic',genre:'novel',id:'7',authorId:'3'},

// ]

// var authors = [
//     {name:'Patrick',age:45,id:'1'},
//     {name:'Bradon',age:40,id:'2'},
//     {name:'Terry',age:41,id:'3'},
//     {name:'Herri',age:34,id:'4'}
// ]

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:() => ({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        genre:{type: GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                // return _.find(authors,{id:parent.authorId})
                return Author.findById(parent.authorId)
            }
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:() => ({
        id:{type: GraphQLID},
        name:{type: GraphQLString},
        age:{type: GraphQLInt},
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return _.filter(books,{authorId:parent.id})

                return Book.find({authorId:parent.id})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                // code to get data from db
            //    return _.find(books,{id: args.id})
            return Book.findById(args.id)
            }
        },
        author:{
            type:AuthorType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                // return _.find(authors,{id:args.id})
                return Author.findById(args.id)
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return books
                return Book.find({})
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                // return authors
                return Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                let author =new Author({
                    name:args.name,
                    age:args.age
                })
                return author.save()
            }
        },
        addBook:{
            type:BookType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},
                authorId:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    genre:args.genre,
                    authorId:args.authorId
                })
                return book.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({    
    query:RootQuery,
    mutation:Mutation
})