import { createRouter, createWebHistory } from "vue-router";
import Utils from '../config/utils'; 
import Login from "../views/Login.vue";
import FlightPlan from "../views/FlightPlan.vue"
import AfterNest from "../views/AfterNest.vue";
import StudentDashboard from "../views/StudentDashboard.vue"
import Task from "../views/task.vue"
import Experience from "../views/Experience.vue";
import Adminsettings from "../views/Adminsettings.vue";
import ManageUser from "../views/ManageUser.vue";
import Events from "../views/Events.vue";
import Profile from "../views/profile.vue";
import themeToggle from "../views/themeToggle.vue"; 
import StudentSetup from "../views/StudentSetup.vue";
import AdminEvents from "../views/AdminEvents.vue";
import adminDashboard from "../views/adminDashboard.vue";
import PointRedemption from "../views/pointRedemption.vue";




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'  
    },
    { 
      path: '/pointRedemption', 
      name: 'pointRedemption',  // ✅ Fixed Name (removed leading `/`) 
      component: PointRedemption 
    },
    
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/student/StudentSetup',
      name: 'StudentSetup',
      component: StudentSetup,
    },
    {
      path: '/admin/AdminEvents',
      name: 'AdminEvents',
      component: AdminEvents,
    },
    {
      path: '/afternest',
      name: 'afterNest',
      component: AfterNest
    },
    {
      path: '/student/studentDashboard',
      name: 'studentDashboard',
      component: StudentDashboard
    },
    
    {
      path: '/flightPlan',
      name: 'FlightPlan',
      component: FlightPlan
    },


    {
      path: '/Experience',
      name: 'Experience',
      component: Experience
    },

    {
      path:'/admin/AdminDashboard',
      name: 'AdminDashboard',
      component: adminDashboard,
       meta: { requiresAdmin: true }
    },

    {
      path:'/settings',
      name: 'settings',
      component: Adminsettings
    },
    {
      path: '/task',
      name: 'task',
      component: Task
    },

    {
      path: '/themeToggle',
      name: 'themeToggle',
      component: themeToggle
    },

     {
      path: '/events',
      name: 'Events',
      component: Events,
    },
  
    {
      path: '/manageusers',
      name: 'manageusers',
      component: ManageUser,
    }, 

    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    }, 

  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = Utils.getStore("user");
  
  // If trying to access login when already logged in, redirect to home
  if (to.name === 'login' && user) {
    next({ name: 'FlightPlan' });
    return;
  }
  
  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !user) {
    next({ name: 'login' });
    return;
  }
  
  // If trying to access admin routes without admin role
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next({ name: 'FlightPlan' });
    return;
  }
  
  next();
});

export default router;