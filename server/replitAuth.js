// 简化的认证模块，目前只提供基本的模拟认证功能
const { storage } = require("./storage.js");

// 模拟的认证中间件
const isAuthenticated = (req, res, next) => {
  // 在开发环境中，我们创建一个模拟用户
  if (!req.user) {
    req.user = {
      claims: {
        sub: "test-user-001",
        email: "test@example.com",
        first_name: "测试",
        last_name: "用户",
        profile_image_url: null,
      }
    };
  }
  next();
};

// 模拟的认证设置
const setupAuth = async (app) => {
  // 在实际部署中，这里会设置真正的Replit认证
  // 目前只是设置一些基本的路由
  
  app.get("/api/login", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });
};

module.exports = {
  setupAuth,
  isAuthenticated,
};