import { createRouter, createWebHistory } from "vue-router";
import Utils from '../config/utils'; 
import Login from "../views/Login.vue";
import Home from "../views/Home.vue"
import AfterNest from "../views/AfterNest.vue";
import FlightPlan from "../views/FlightPlan.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'  
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/afternest',
      name: 'afterNest',
      component: AfterNest
    },
    {
      path: '/flightPlan',
      name: 'flightPlan',
      component: FlightPlan
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
  
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = Utils.getStore("user");
  
  // If trying to access login when already logged in, redirect to home
  if (to.name === 'login' && user) {
    next({ name: 'home' });
    return;
  }
  
  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !user) {
    next({ name: 'login' });
    return;
  }
  
  // If trying to access admin routes without admin role
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next({ name: 'home' });
    return;
  }
  
  next();
});

export default router;