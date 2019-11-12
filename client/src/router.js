import Vue from 'vue';
import Router from 'vue-router';

import home from './views/home';
import search from './views/search';
import landing from './views/landing';
import register from './views/register';
import login from './views/login';
import settings from './views/settings'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/search',
            component: search
        },
        {
            path: '/home',
            component: home
        },
        {
            path: '/',
            component: landing
        },
        {
            path: '/register',
            component: register
        },
        {
            path: '/login',
            component: login
        },
        {
            path: '/settings',
            component: settings
        }
    ]
});