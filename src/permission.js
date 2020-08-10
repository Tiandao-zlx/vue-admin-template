import router from "./router";

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token");
  if (to.path === "/login") {
    if (token === null || token === "" || token === "undefined") {
      next();
    } else {
      next(from.path);
    }
  } else {
    if (token === null || token === "" || token === "undefined") {
      next("/login");
    } else {
      next();
    }
  }
});
