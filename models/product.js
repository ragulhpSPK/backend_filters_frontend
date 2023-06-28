const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "subcategory" },
});

module.exports = mongoose.model("product", productSchema);
