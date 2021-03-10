import React from "react";
import { authRoles } from "../../auth/authRoles";

const dashboardRoutes = [
  {
    path: "/dashboard/dashboard",
    component: React.lazy(() => import("../MainPage")),
    auth: authRoles.sa,
  },
  // {
  //   path: "/dashboard/spa1",
  //   component: React.lazy(() => import("./spas/ExchangePublicTokenApp")),
  //   auth: authRoles.sa,
  // },
  // {
  //   path: "/dashboard/alternative",
  //   component: React.lazy(() => import("./Analytics")),
  //   auth: authRoles.sa,
  // },
  {
    path: "/dashboard/default",
    component: React.lazy(() => import("../MainPage")),
    auth: authRoles.admin,
  },
  // {
  //   path: "/dashboard/banking",
  //   component: React.lazy(() => import("./Banking")),
  //   auth: authRoles.admin,
  // },
  // {
  //   path: "/dashboard/inventory-management",
  //   component: React.lazy(() => import("./InventoryManagement")),
  //   auth: authRoles.admin,
  // },
];

export default dashboardRoutes;
