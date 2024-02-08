import Login from "../views/reception/login";
import Register from "../views/reception/register";
import Collect from "../views/service/collect/collect";
import Submit from "../views/service/submit";
import { IdentityConfirm } from "../views/reception/reset/reset";
import { EditPassword } from "../views/reception/reset/reset";
import Home from "../views/service/home";
export const routes = [
  { path: "/", name: "login", component: <Login></Login> },
  {
    path: "/user/:id/collect",
    name: "collect",
    component: <Collect></Collect>,
  },
  {
    path: "/user/:id/setting",
    name: "setting",
    component: <Submit></Submit>,
  },
  { path: "/register", name: "register", component: <Register></Register> },
  {
    path: "/reset",
    name: "reset",
    component: <IdentityConfirm></IdentityConfirm>,
  },
  {
    path: "/edit/:id/:token",
    name: "edit",
    component: <EditPassword></EditPassword>,
  },
  {
    path: "/user/:id/home",
    name: "home",
    component: <Home></Home>,
  },
];
