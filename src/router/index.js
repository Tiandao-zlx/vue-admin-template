import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue")
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/Home.vue"),
    // redirect: () => {
    //   return "Welcome";
    // },
    redirect:'/welcome',
    children: [
      {
        path: "table",
        name: "table",
        component: () => import("@/views/table/Table.vue")
      },
      {
        path: "form",
        name: "form",
        component: () => import("@/views/form/Form.vue")
      },
      {
        path:"/welcome",
        name:"Welcome",
        component: () => import("@/views/welcome/Welcome")
      },
      {
        path:"/users",
        component: () => import("@/views/user/Users")
      },
      {
        path:"/goods",
        component: () => import("@/views/goods/GoodsList")
      },
      {
        path:"/rights",
        component: () => import("@/views/power/Rights")
      },
      {
        path:"/roles",
        component: () => import("@/views/power/Roles")
      }
    ]
  }
];

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  routes
});

export default router;
