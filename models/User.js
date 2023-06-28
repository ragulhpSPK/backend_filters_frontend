const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
