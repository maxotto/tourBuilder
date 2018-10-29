import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import MainPage from './views/mainPage';
import NewProject from './views/newProject';
import ProjectsList from './views/projectsList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/new',
      name: 'new',
      component: NewProject,
    },
    {
      path: '/projects',
      name: 'list',
      component: ProjectsList
    },
    {
      path: '/projects/:id',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'main',
      component: MainPage,
    }
  ]
})
