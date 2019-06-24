var express = require("express");

var router = express.Router();
var { waterfall } = require("async");
var { conn } = require("./untils/db");
var { setError, aesEncrypt, keys, aesDecrypt } = require("./untils/index");
var { user, movie, pinglun, good, cart, text } = require("./untils/schema");

router.get("/index", (req, res) => {
  res.json({
    msg: "这是vue项目后台的路由",
    code: 200
  });
});
//前端发送来的请求
router.get("/movie", (req, res) => {
  var limit = req.query.limit * 1 || 0;
  conn((err, mongoose) => {
    setError(err, res, mongoose);
    movie
      .find({}, {})
      .limit(limit)
      .exec((err, result) => {
        setError(err, res, mongoose);
        res.json({
          msg: "获取电影数据成功",
          type: 1,
          code: 200,
          result
        });
        mongoose.disconnect();
      });
  });
});
router.post("/register", (req, res) => {
  // console.log(req.body)
  var body = req.body;
  var username1 = body.username;
  conn((err, mongoose) => {
    setError(err, res, mongoose);
    user.find({ username: username1 }).exec((err, result) => {
      setError(err, res, mongoose);
      // console.log(result);
      if (result[0]) {
        res.json({
          type: 0,
          msg: "当前用户名已存在，请重新注册",
          code: 200
        });
      } else {
        user.insertMany(body, (err, result) => {
          // console.log(result);
          setError(err, res, mongoose);
          res.json({
            type: 1,
            msg: "注册成功",
            code: 200
          });
          mongoose.disconnect();
        });
      }
    });
  });
});

//搜索商品路由
// router.get("/search", (req, res) => {
//   var keyword = req.query.keyword;

//   console.log(req.query, "asdfasd5f465");
//   var limit = req.query.limit * 1 || 0;
//   var obj = {};
//   if (keyword) {
//     obj = {
//       $or: [
//         {
//           name: new RegExp(keyword)
//         },
//         {
//           "type.text": new RegExp(keyword)
//         }
//       ]
//     };
//   }
//   conn((err, db) => {
//     setError(err, res, db);
//     good.find(obj).limit(limit).exec((err, result) => {
//       setError(err, res, db);
//       // console.log(result);
//       res.json({
//         msg: "搜索数据成功",
//         code: 200,
//         type: 1,
//         result
//       });
//       db.disconnect();
//     });
//   });
// });


router.get("/search", (req, res) => {
  var query = req.query;
  var limit = query.limit * 1 || 0;
  var keyword = query.keyword;
  var obj = {};
  if (keyword) {
    obj = {
      $or: [
        {
          name: new RegExp(keyword),
        },
        {
          "type.text": new RegExp(keyword)
        }
      ]
    }
  }
  conn((err, db) => {
    setError(err, res, db);
    good.find(obj, {}).limit(limit).exec((err, result) => {
      setError(err, res, db);
      res.json({
        msg: "获取商品数据成功",
        code: 200,
        result
      })
      db.disconnect();
    })
  })
})
//id商品
router.get("/goodsid", (req, res) => {
  var query = req.query;
  // console.log(query, "11111111111111")
  var limit = query.limit * 1 || 0;
  // var id = query.id;
  conn((err, db) => {
    setError(err, res, db);
    good.find(query, {}).limit(limit).exec((err, result) => {
      setError(err, res, db);
      res.json({
        msg: "获取商品数据成功",
        code: 200,
        result
      })
      db.disconnect();
    })
  })
})


//所有商品获取
router.get("/goodsidarr", (req, res) => {
  var query = req.query;
  // console.log(query, "11111111111111")
  var limit = query.limit * 1 || 0;
  // var id = query.id;
  conn((err, db) => {
    setError(err, res, db);
    good.find({}, {}).limit(limit).exec((err, result) => {
      setError(err, res, db);
      res.json({
        msg: "获取商品数据成功",
        code: 200,
        result
      })
      db.disconnect();
    })
  })
})



router.get("/more", (req, res) => {
  var query = req.query;
  var id = query.goodid;
  // console.log(query);
  conn((err, mongoose) => {
    setError(err, res, mongoose);
    if (id) {
      good.find({ _id: id }, {}).exec((err, result) => {
        setError(err, res, mongoose);
        res.json({
          type: 1,
          msg: "获取数据成功",
          result,
          code: 200
        });
        mongoose.disconnect();
      });
    } else {
      good.find({}, {}).exec((err, result) => {
        setError(err, res, mongoose);
        res.json({
          type: 1,
          msg: "获取数据成功",
          result,
          code: 200
        });
        mongoose.disconnect();
      });
    }
  });
});

//获取分类
//distinct 去重处理
router.get("/type", (req, res) => {
  conn((err, mongoose) => {
    setError(err, res, mongoose);
    good.distinct("type", (err, result) => {
      //返回不重复的type
      setError(err, res, mongoose);
      res.json({
        type: 1,
        msg: "获取商品分类数据成功",
        result,
        code: 200
      });
    });
  });
});

//登录路由
router.post("/login", (req, res) => {
  var a = req.body.username;
  var b = req.body.password;
  // console.log(req.body)
  var token = aesEncrypt(a, keys);
  // console.log(token);
  req.session.token = token; //把token存入到session中
  // console.log("req.session", req.session);
  conn((err, mongoose) => {
    setError(err, res, mongoose);
    user.find({ username: a, password: b }, {}).exec((err, result) => {
      //   console.log(result);
      setError(err, res, mongoose);
      if (result[0]) {
        res.json({
          msg: "登录成功",
          type: 1,
          code: 200,
          token,
          a
        });
      } else {
        res.json({
          msg: "用户名或者密码错误",
          type: 0,
          code: 200
        });
      }
      mongoose.disconnect();
    });
  });
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./public/avatar");
  },
  filename: function (req, file, cb) {
    //修改上传文件的名称
    cb(null, Date.now() + "wh" + file.originalname); //
  }
});

const upload = multer({ storage }).any(); //任何格式的文件都可以
router.post("/upload", upload, (req, res) => {
  // console.log(req.files)
  var avatarurl = req.files[0].path;
  var username = aesDecrypt(req.session.token, keys);
  // console.log(username)
  conn((err, db) => {
    setError(err, res, db);
    user.updateOne(
      { username },
      {
        $set: {
          avatar: avatarurl
        }
      },
      (err, result) => {
        setError(err, res, db);
        res.json({
          msg: "图片上传成功",
          avatarurl,
          result
        });
        db.disconnect()
      }
    );
  });
});



//加入购物车路由
router.post("/cartJoin", (req, res) => {
  var body = req.body
  var username = aesDecrypt(req.headers.token, keys);
  var selectedNum = body.selectedNum * 1
  var id = body.id
  var lirr = body.lirr
  var price = body.price * 1
  body.username = username
  // console.log(username, lirr, "444444")
  conn((err, db) => {
    setError(err, res, db);
    waterfall([
      (cb) => {
        cart.findOne({ username, id }, (err, result) => {
          cb(err, result)
        })
      },
      (args, cb) => {
        if (args) {
          cart.updateOne({
            username, id, lirr
          }, {
              $inc: {
                selectedNum
              }
            }, (err, result) => {
              cb(err, { msg: "购物车数量累计添加成功", code: 200, result, type: 0 })
            })
        } else {
          // console.log(body)
          cart.create(body, (err, result) => {
            cb(err, { msg: "购物车添加商品成功 ", code: 200, type: 1 })
          })
        }
      }
    ], (err, result) => {
      setError(err, res, db);
      res.json(result)
      db.disconnect()
    })
  })

})


//获取购物车信息
router.get("/getcar", (req, res) => {
  console.log("5555", req.query.usename, "55555")
  // var a = req.query.usename
  var obj = { username: req.query.usename }
  // console.log(a)
  console.log("879465464894", obj)
  conn((err, db) => {
    setError(err, res, db)
    cart.find(obj).exec((err, result) => {
      setError(err, res, db)
      console.log(result)
      if (result) {
        res.json({
          msg: "获取商品数据成功",
          code: 200,
          type: 1,
          result
        })
      } else {
        res.json({
          msg: "购物车为空 请添加商品",
          code: 200,
          type: 0
        })
      }
      db.disconnect()
    })
  })
});

//删除购物车
router.post("/cartJoinsanchu", (req, res) => {
  var body = req.body
  console.log("2222", body, "222222")
  var id = body.id
  conn((err, db) => {
    setError(err, res, db)
    cart.remove({ id: id }).exec((err, result) => {
      setError(err, res, db)
      // res.json({ msg: "删除成功" })
      db.disconnect()
    })
  })
})

//加加减减购物车
router.post("/cartJoinjiajia", (req, res) => {
  var body = req.body
  console.log("2222", body, "222222")
  var id = body.id
  var selectedNum = body.selectedNum
  conn((err, db) => {
    setError(err, res, db)
    cart.updateOne({ id: id }, {
      $set: {
        selectedNum: selectedNum
      }
    }).exec((err, result) => {
      setError(err, res, db)
      res.json({ msg: "修改成功" })
      db.disconnect()
    })
  })
})



// //加加减减购物车
// router.post("/cartJoinsanchuxinshua", (req, res) => {
//   var body = req.body
//   console.log("2222", body, "222222")
//   conn((err, db) => {
//     setError(err, res, db)
//     cart.remove({}).exec((err, result) => {
//       setError(err, res, db)
//       // res.json({msg:"删除成功"})
//       cart.insert(body).exec((err, result) => {
//         setError(err, res, db)
//         res.json({ msg: "添加成功" })

//       })
//     })
//   })
// })
module.exports = router;
