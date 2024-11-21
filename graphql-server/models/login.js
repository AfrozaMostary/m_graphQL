const bcrypt = require('bcryptjs');

const resolvers = {
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');
      
      const token = jwt.sign({ userId: user.id }, 'your_secret_key');
      return token;
    }
  }
};