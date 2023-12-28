import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/techplans',
    name: 'TechPlanList',
    component: () => import('../views/TechPlanList.vue')
  },
  {
    path: '/techplan/:id',
    name: 'TechPlan',
    component: () => import('../views/TechPlan.vue')
  },
  {
    path: '/lessons',
    name: 'LessonList',
    component: () => import('../views/LessonList.vue')
  },
  {
    path: '/lesson/:id',
    name: 'Lesson',
    component: () => import('../views/Lesson.vue')
  },
  {
    path: '/banner',
    name: 'Banner',
    component: () => import('../views/Banner.vue')
  },
  {
    path: '/css',
    name: 'Css',
    component: () => import('../views/Css.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/members',
    name: 'MemberList',
    component: () => import('../views/MemberList.vue')
  },
  {
    path: '/member/:id',
    name: 'Member',
    component: () => import('../views/Member.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
