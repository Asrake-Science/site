const https = require('https');
const fs = require('fs');
const { default: enforceHttps } = require('koa-sslify');
const koastatic = require('koa-static')
const path = require('path');
const Koa = require('koa')
const http = require('http');
const views = require("co-views")
var render = views("public", { map: { html: 'swig' }});
//const sslify = require('koa-sslify').default; // factory with default options
const Router = require('koa-joi-router')
const Joi = Router.Joi
const errorHandler = require('koa-better-error-handler')
const koa404Handler = require('koa-404-handler')
const Boom = require('@hapi/boom')
const bodyParser = require('koa-bodyparser')
//const { default: axios } = require('axios');
const { allowedNodeEnvironmentFlags } = require('process');
const koaCors = require('koa-cors')

const app = new Koa()

const router = Router()

app.context.onerror = errorHandler()
app.use(koa404Handler)
app.use(bodyParser())
app.use(enforceHttps({
  port: 443
}));

const koaOptions = {
  origin: true,
  credentials: true
};


router.get("/", async(ctx, next) => 
  koastatic(`${__dirname}/website/pages`)(
    Object.assign(ctx, { path: 'home.html' }), 
    next)
  );

  router.get("/privacy-policy", async(ctx, next) => 
  koastatic(`${__dirname}/website/pages`)(
    Object.assign(ctx, { path: 'privacypolicy.html' }), 
    next)
  );

  router.get("/discord", async(ctx, next) => 
  koastatic(`${__dirname}/website/pages`)(
    Object.assign(ctx, { path: 'discord.html' }), 
    next)
  );

  router.get("/soon", async(ctx, next) => 
  koastatic(`${__dirname}/website/pages`)(
    Object.assign(ctx, { path: 'placeholder.html' }), 
    next)
  );

  router.get("/seized", async(ctx, next) => 
  koastatic(`${__dirname}/website/pages`)(
    Object.assign(ctx, { path: 'secret.html' }), 
    next)
  );

  router.get("/tos", async(ctx, next) => 
  koastatic(`${__dirname}/website/pages`)(
    Object.assign(ctx, { path: 'tos.html' }), 
    next)
  );


  app.use(router.middleware())
  app.use(koaCors(koaOptions))

var options = {
    key: fs.readFileSync(`${__dirname}/certificate/private.key`),
    cert: fs.readFileSync(`${__dirname}/certificate/certificate.crt`)
}
  
 // http.createServer(app.callback()).listen(80);
  https.createServer(options, app.callback()).listen(443);
  