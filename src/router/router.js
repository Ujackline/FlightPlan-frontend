import { createRouter, createWebHistory } from "vue-router";
import Utils from '../config/utils'; 
import Login from "../views/Login.vue";
import Home from "../views/Home.vue"
import AfterNest from "../views/AfterNest.vue";

//import StudentDashboard from "../views/StudentDashboard.vue"
// import Task from "../views/taskStudents.vue"

import StudentDashboard from "../views/StudentDashboard.vue"
import Task from "../views/task.vue"
import Badge from "../views/Badge.vue"

import Experience from "../views/Experience.vue";
import AdminDashboard from "../views/adminDashboard.vue";
import Adminsettings from "../views/Adminsettings.vue";
import ManageUser from "../views/ManageUser.vue";
import Events from "../views/Events.vue";
import Profile from "../views/profile.vue";
import themeToggle from "../views/themeToggle.vue";
import StudentSetup from "../views/StudentSetup.vue";

import AdminCreateTask from "../views/AdminCreateTask.vue";
import AdminViewTask from "../views/AdminViewTasks.vue"; 
import AdminEvents from "../views/AdminEvents.vue";

import PointRedemption from "../views/pointRedemption.vue";
import Shop from "../views/Shop.vue";
import Documents from "../views/Documents.vue";
import AdminDocuments from "../views/AdminDocuments.vue";




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'  
    },

   
    {
      path: '/shop',
      name: 'shop',
      component: Shop
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
    // Add this additional route to catch the lowercase version
    {
      path: '/admin/events',
      redirect: { name: 'AdminEvents' }  // Redirect to the main route
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
      path: '/Experience',
      name: 'Experience',
      component: Experience
    },

    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true },
      children: [
        {
          path: 'documents',
          name: 'adminDocuments',
          component: AdminDocuments,
          meta: { requiresAdmin: true }
        }
      ]
    },

    // Admin routes
    {
      path: '/experience',
      name: 'experience',
      component: Experience,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/students',
      name: 'students',
      component: StudentDashboard,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/pointRedemption',
      name: 'points',
      component: PointRedemption,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/settings',
      name: 'settings',
      component: Adminsettings,
      meta: { requiresAdmin: true }
    },
    {
      path: '/task',
      name: 'task',
      component: Task,
      meta: { requiresAdmin: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Task,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'manageusers',
      component: ManageUser,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/dashboard/events',
      name: 'adminEvents',
      component: Events,
      meta: { requiresAdmin: true }
    },
    {
      path: '/badge',
      name: 'badge',
      component: Badge
    },
    {
      path: "/admin/create-task",
      name: "create-task",
      component: AdminCreateTask
    },   
    
    {
      path: "/admin/view-task",
      name: "view-task",
      component: AdminViewTask
    }, 

    {
      path: '/themeToggle',
      name: 'themeToggle',
      component: themeToggle
    },

    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
    },
  
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },

    {
      path: '/documents',
      name: 'documents',
      component: Documents,
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
    console.log('Access to admin route blocked - user is not an admin');
    next({ name: 'home' });
    return;
  }
  
  next();
});

export default router;
