
const deleteRouter = [
  {
    path: "/DeleteAccount",
    name: "DeleteAccount",
    component: () => import(/* webpackChunkName: "Investigation" */ '@/views/DeleteAccount/DeleteAccount.vue'),
  },
  {
    path: "/DeleteSuccess",
    name: "DeleteSuccess",
    component: () => import(/* webpackChunkName: "Investigation" */ '@/views/DeleteAccount/DeleteSuccess.vue'),
  }, 
]
export default deleteRouter
