
const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    posts: async () => {
      return await Post.find();
    },
    post: async (_, { id }) => {
      return await Post.findById(id);
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },
    createPost: async (_, { title, content, authorId }) => {
      const post = new Post({ title, content, author: authorId });
      await post.save();
      return post;
    },
    createComment: async (_, { content, authorId, postId }) => {
      const comment = new Comment({ content, author: authorId, post: postId });
      await comment.save();
      return comment;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const token = jwt.sign({ userId: user.id }, 'your_secret_key');
      return token;
    }
  },
  User: {
    posts: async (user) => {
      return await Post.find({ author: user.id });
    },
  },
  Post: {
    author: async (post) => {
      return await User.findById(post.author);
    },
    comments: async (post) => {
      return await Comment.find({ post: post.id });
    },
  },
  Comment: {
    author: async (comment) => {
      return await User.findById(comment.author);
    },
    post: async (comment) => {
      return await Post.findById(comment.post);
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      const user = jwt.verify(token, 'your_secret_key');
      return { user };
    } catch (e) {
      return {};
    }
  },
});

// Start server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
