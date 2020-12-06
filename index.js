"use strict";

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");

// 引入schema
const { User, Product } = require("./db_client");

const app = new Koa();
const router = new Router();
app.use(bodyParser());

// 通过id取回数据
router.get("/user/:id", async (ctx) => {
  const { id } = ctx.params;
  const res = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (res) {
    // 这里可以不需要设置ctx.status，Koa会自动设置为200
    ctx.body = res;
  } else {
    ctx.status = 404;
    ctx.body = {
      message: `${id} not found`,
    };
  }
});

// 与数据库交换，需要用异步请求async
router.post("/user", async (ctx) => {
  const { body } = ctx.request;
  const user = new User(body);
  const { _id } = await user.save(); // 等待数据库存入这条数据
  ctx.status = 201; // 返回信息给客户端
  ctx.body = {
    message: "user created",
    _id,
  };
});

// 修改数据
router.put("/user/:id", async (ctx) => {
  const {id} = ctx.params;
  const {body} = ctx.request;
  const {n} = await User.updateOne({_id: new mongoose.Types.ObjectId(id)}, {$set: body});

  if(n ===0){
      ctx.status = 404;
      ctx.body = {
          message: `${id} not found!`,
      }
  } else {
      ctx.status = 200;
      ctx.body = {
          message: 'updated',
      }
  }
});

// 删除数据
router.delete("/user/:id", async (ctx) => {
  const {id} = ctx.params;
  const res = await User.findOneAndDelete({_id: new mongoose.Types.ObjectId(id)});
  console.log(res);
  if (res){
      ctx.body = {
          message: 'deleted!',
      };
  } else {
      ctx.status = 404;
  }
});

// product
router.post("/product", async (ctx) => {
  const { body } = ctx.request;
  const product = new Product(body);
  const { _id } = await product.save();
  ctx.status = 201;
  ctx.body = {
    message: "product created",
    _id,
  };
});

app.use(router.routes());

// 前面没法匹配的路由/中间件 最终会由这个中间件兜底，给出一些提示性的信息给用户
app.use((ctx) => {
  ctx.body = "Do something";
});

app.listen(3000, () => {
  console.log("server start at: 3000");
});
