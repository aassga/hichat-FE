
const customerRouter = [
  {
    path: "/Investigation",
    name: "Investigation",
    component: () => import(/* webpackChunkName: "Investigation" */ '@/views/Investigation/Investigation.vue'),
  },
]
export default customerRouter
