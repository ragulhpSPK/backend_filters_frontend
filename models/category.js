const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: "string",
  },
});

module.exports = mongoose.model("Category", CategorySchema);
