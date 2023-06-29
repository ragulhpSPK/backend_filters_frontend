const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const Category = require("./models/category");
const Subcategory = require("./models/subcategory");
const Product = require("./models/product");
var bodyParser = require("body-parser");
const cors = require("cors");
const { isEmpty } = require("lodash");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.get("/getuser", async (req, res) => {
  try {
    const result = await User.find();
    return res.json(result);
  } catch (err) {
    console.log(err);
  }
});

app.post("/createuser", async (req, res) => {
  try {
    const result = await User.create({ ...req.body });

    const user = result.save();
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
});

app.get("/search", async (req, res) => {
  console.log(req.query.q);
  const searchQuery = req.query.q;
  try {
    const regexQuery = { $regex: searchQuery, $options: "i" };
    const result = await User.find({
      $or: [
        { name: regexQuery },
        { age: !isNaN(searchQuery) ? Number(searchQuery) : null },
        { address: regexQuery },
      ],
    });

    res.send({ result });
  } catch (err) {
    console.log(err);
  }
});

app.post("/createcat", async (req, res) => {
  try {
    const result = await Category.create({ ...req.body });
    const category = result.save();
    return res.send(category);
  } catch (err) {
    return res.send("failed");
  }
});

app.get("/getcat", async (req, res) => {
  try {
    const result = await Category.find();
    return res.send(result);
  } catch (e) {
    console.log(e);
  }
});

app.post("/createsub", async (req, res) => {
  try {
    const result = await Subcategory.create({ ...req.body });
    const subcat = result.save();
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

app.get("/subcat", async (req, res) => {
  try {
    const result = isEmpty(req.query.q)
      ? await Subcategory.find().populate("category")
      : await Subcategory.find({ category: req.query.q });
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

app.post("/createPro", async (req, res) => {
  try {
    const result = await Product.create({ ...req.body });
    const subcat = result.save();
    res.send(result);
  } catch (e) {
    console.log(e);
  }
});

// app.get("/getpro", async (req, res) => {
//   try {
//     console.log(req.query);
//     const result =
//       isEmpty(req.query.q) && isEmpty(req.query.sub)
//         ? await Product.find().populate("category subcategory")
//         : isEmpty(req.query.sub)
//         ? await Product.find({ category: req.query.q })
//         : await Product.find({
//             subcategory: req.query.sub,
//           });
//     console.log(result, "result");
//     res.send(result);
//   } catch (e) {
//     console.log(e);
//   }
// });

app.get("/getpro", async (req, res) => {
  try {
    const { q, sub, search } = req.query;
    let where = {};

    if (q !== "") {
      where.category = q;
      where.name = { $regex: search, $options: "i" };
    }
    if (q === "" && search !== "") {
      where.name = { $regex: search, $options: "i" };
    }

    if (sub !== "") {
      where.subcategory = sub;
      where.category = q;
      where.name = { $regex: search, $options: "i" };
    }
    console.log(where);
    const result = await Product.find(where).populate("category subcategory");

    console.log(result, "result");
    return res.status(200).send(result);
  } catch (e) {
    console.log(e);
  }
});

const mongoUri =
  "mongodb+srv://ragulhp27:ragulhp2704@filters.07pegsf.mongodb.net/filter";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen("4001", () => {
  console.log("Server started");
});
