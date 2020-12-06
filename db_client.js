"use strict";

const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/jr_11", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = {
    name: String,
    age: Number,
};
const ProductSchema = {
    name: String,
    price: Number,
};

module.exports = {
    User: mongoose.model("User", UserSchema),
    Product: mongoose.model("Product", ProductSchema),
};