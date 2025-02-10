
import { RouteRecordRaw, createRouter , createWebHistory} from 'vue-router'
import NotFound from "./pages/404.vue"
import Layout from './layouts/Layout.vue'
import Files from './pages/Files.vue'
import TOC from './TOC/TOC.vue'
import Bookmarks from './pages/Bookmarks.vue'
import Settings from './pages/Settings.vue'
import Shelf from './pages/Shelf.vue'
// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes:RouteRecordRaw[] = [
    { 
        path: '/', 
        name: 'root',
        component: Layout,
        children: [
            {
                path: "files",
                name: "files",
                component: Files
            },
            {
                path: "toc",
                name: "toc",
                component: TOC,
            },
            {
                path: "bookmarks",
                name: "bookmarks",
                component: Bookmarks,
            },
            {
                // settings
                path: "settings",
                name: "settings",
                component: Settings,
            },
            {
                path: "shelf",
                name: "shelf",
                component: Shelf,
            },
            {
                // Always leave this as last one,
                // but you can also remove it
                path: "/:catchAll(.*)*",
                name:"404",
                component: NotFound,
            },
        ],
    },

]
  
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes,
})
