import {createRouter, createWebHistory} from "vue-router";
import ProfileView from "../../client/views/ProfileView.vue";
import LoginView from "../../client/views/LoginView.vue";
import HomeView from "../../client/views/HomeView.vue";
import RegisterView from "../../client/views/RegisterView.vue";
import LibraryView from "../../client/views/LibraryView.vue";
import LikedView from "../../client/views/LikedView.vue";
import NewPlaylistView from "../../client/views/NewPlaylistView.vue";
import PlaylistView from "../../client/views/PlaylistView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },
        {
            path: '/library',
            name: 'library',
            component: LibraryView,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/create-playlist',
            name: 'create-playlist',
            component: NewPlaylistView,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/liked',
            name: 'liked',
            component: LikedView,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/playlist/:pid',
            name: 'playlist',
            component: PlaylistView,
            props: true,
            meta: {
                requiresAuth: true
            },
            beforeEnter: (to, from, next) => {
                if (to.params.pid === '1') {
                    next({name: 'liked'});
                } else {
                    next();
                }
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView,
            meta: {
                requiresAuth: true
            },
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            credentials: 'include',
        });

        const isAuthenticated = response.ok;

        if (to.meta.requiresAuth && !isAuthenticated) {
            next({ name: 'login' });
        } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
            next({ name: 'home' });
        } else {
            next();
        }

    } catch (err) {
        console.error('Erreur de vérification auth:', err);
        next({ name: 'login' });
    }});


export default router;