const { ApolloServer, gql } = require("apollo-server");


const typeDefs = gql`

  type Book {
    id: String  
    title: String
    author: String
  }

  type BreakQuote{
    quote: String!
    author: String!
  }

  type Query {
    Getbooks: [Book],
    Getbook(id:String!): Book
    GetBreakQuotes: [BreakQuote]
    GetBreakQuote(quote:String!): BreakQuote
  }
  type Mutation {
      CreateBook(id: String!,title: String!, author: String!): Book
      DeleteBook(id: String!): Book
      UpdateBook(id: String!,title: String!, author: String!): Book 
      CreateBreakQuote(quote: String!, author: String!): BreakQuote
      DeleteBreakQuote(quote: String!): BreakQuote
      UpdateBreakQuote(quote: String!, author: String!): BreakQuote
  }
`;

let books = [
    {
      id:"1",
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      id:"2",  
      title: 'City of Glass',
      author: 'Paul Auster',
    },
    {
       id:"3",  
       title: 'Del amor y otros demonios',
       author: 'Gabriel garcia Marquez',
    }
  ];

  let breakingquotes = [];

  const getApiBreaks = async() => {
    await fetch('https://api.breakingbadquotes.xyz/v1/quotes/10')
    .then(response => response.json())  
    .then(json => breakingquotes = json)    
    .catch(err => console.log('There is not any date', err)); 
  };

  getApiBreaks();

  const resolvers = {
    Mutation: {
        CreateBook: (_,arg) => {books.push(arg); return arg},
        DeleteBook: (_,arg) => { 
                                 let finalbooks=books.filter(book => book.id != arg.id);
                                 let bookdeleted = books.find(book => book.id == arg.id );   
                                 books = [...finalbooks]; 
                                 return bookdeleted
                                },
        UpdateBook:(_,arg) => {  let objIdx = books.findIndex(book => book.id == arg.id);
                                 books[objIdx] = arg
                                 return arg   
             
                              },
      CreateBreakQuote: (_,arg) => {breakingquotes.push(arg);return arg},
      DeleteBreakQuote: (_,arg) => { 
        let finalbooks=breakingquotes.filter(book => book.quote != arg.quote);
        let bookdeleted = breakingquotes.find(book => book.quote == arg.quote );   
        breakingquotes = [...finalbooks]; 
        return bookdeleted
       },
      UpdateBreakQuote:(_,arg) => {  let objQuotex = breakingquotes.findIndex(book => book.quote == arg.quote);
        breakingquotes[objQuotex] = arg
        return arg   

     }                        

    },  
    Query: {
      Getbooks: () => books,
      Getbook: (_,arg) => books.find(number => number.id==arg.id),
      GetBreakQuotes: () => breakingquotes,
      GetBreakQuote: (_,arg) => breakingquotes.find(number => number.id==arg.id),
    },
  };


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

