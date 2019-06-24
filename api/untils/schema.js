var mongoose = require("mongoose");
var user_schema = new mongoose.Schema({ phone: String, username: String, password: String, passwords: String, time: Date, avatar: String })
var user = mongoose.model("user", user_schema);
exports.user = user;



//电影数据库
var mongoose = require("mongoose");
var movie_schema = new mongoose.Schema({ title: String, images: Object, directors: Object, rating: Object, genres: Array, id: String });
var movie = mongoose.model("movie", movie_schema);
exports.movie = movie;



//评论数据库
var pinglun_schema = new mongoose.Schema({ title: String, content: String, username: String, uid: String, mtitle: String, time: Date, movie: Object, img: String, year: String })
var pinglun = mongoose.model("pinglun", pinglun_schema);
exports.pinglun = pinglun

//商品列表
var goods_schema = new mongoose.Schema({ lirr: Boolean, price: Number, discount: Number, id: String, type: Object, img: String, name: String, _id: String })
var good = mongoose.model("good", goods_schema);
exports.good = good

//购物车列表
var cart_schema = new mongoose.Schema({ lirr: Boolean, username: String, goods: Object, selectedNum: Number, price: Number, id: String })
var cart = mongoose.model("cart", cart_schema);
exports.cart = cart;

//购物车列表
var text_schema = new mongoose.Schema({ lirr: Boolean, username: String, arr: Array, selectedNum: Number, price: Number, id: String })
var text = mongoose.model("text", text_schema);
exports.text = text;