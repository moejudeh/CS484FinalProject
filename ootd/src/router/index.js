import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/wardrobe",
    name: "wardrobe",
    component: () => import("../views/WardrobeView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },

  // used to add a new category to wardrobe
  {
    path: "/wardrobe/add",
    name: "add-category",
    component: () => import("../views/AddCategoryView.vue"),
  },

  // used to go back to homepage if doesnt exist
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // if user is logged in and tries to go to login page
  // go to dashboard instead
  if (to.path === "./login" && auth.currentUser) {
    next("/");
    return;
  }

  // if route requires auth and user is not logged in
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.currentUser
  ) {
    next("/login");
    return;
  }

  // otherwise go to next
  next();
});

export default router;
