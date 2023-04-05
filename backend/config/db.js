const mongoose = require("mongoose");

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://student:major@cluster0.szpkr3h.mongodb.net/?retryWrites=true&w=majority`,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

      console.log(`MongoDb Connected: ${conn.connection.host}`);
  } catch (error) {
      console.log(`Error: ${error.message}`);
      process.exit();
  }

};

module.exports = connectDB;