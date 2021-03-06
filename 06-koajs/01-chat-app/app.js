const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const router = new Router();
const queue = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    ctx.status = 200;
    queue.push(resolve);
  });
  return next();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    while (queue.length) {
      const resolve = queue.pop();
      resolve(message);
    }
    ctx.status = 201;
  }
  return next();
});

app.use(router.routes());

module.exports = app;
