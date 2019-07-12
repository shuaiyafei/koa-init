import Vue from 'vue';
import VueRouter from 'vue-router';
import List from '../views/List.vue';
import New from '../views/New.vue';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: List
        },
        {
            path: '/new',
            component: New
        }
    ]
});