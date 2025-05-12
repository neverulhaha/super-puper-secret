"use strict";
(() => {
var exports = {};
exports.id = 996;
exports.ids = [996];
exports.modules = {

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1855:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./src/app/api/notifications/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  DELETE: () => (DELETE),
  GET: () => (GET)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(19513);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(89335);
// EXTERNAL MODULE: ./src/lib/supabase.ts
var lib_supabase = __webpack_require__(68100);
;// CONCATENATED MODULE: ./src/lib/api/notifications.ts

const fetchNotifications = async ()=>{
    const { data, error: userError } = await lib_supabase/* supabase */.O.auth.getUser();
    if (userError) throw userError;
    const user = data?.user;
    if (!user) throw new Error("User not found");
    const { data: notifications, error } = await lib_supabase/* supabase */.O.from("notifications").select("*").eq("owner_id", user.id).order("timestamp", {
        ascending: false
    });
    if (error) throw error;
    return notifications;
};
const createNotification = async (notification)=>{
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = data?.user;
    if (!user) throw new Error("User not found");
    const { data: notificationData, error } = await supabase.from("notifications").insert([
        {
            ...notification,
            owner_id: user.id
        }
    ]).single();
    if (error) throw error;
    return notificationData;
};
const deleteNotification = async (id)=>{
    const { data, error } = await lib_supabase/* supabase */.O.from("notifications").delete().eq("id", id).single();
    if (error) throw error;
    return data;
};

;// CONCATENATED MODULE: ./src/app/api/notifications/route.ts


async function GET() {
    try {
        const notifications = await fetchNotifications();
        return next_response/* default */.Z.json(notifications);
    } catch (error) {
        return next_response/* default */.Z.json({
            error: "Error fetching notifications"
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    const { id } = await request.json();
    try {
        const notification = await deleteNotification(id);
        return next_response/* default */.Z.json(notification);
    } catch (error) {
        return next_response/* default */.Z.json({
            error: "Error deleting notification"
        }, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fnotifications%2Froute&name=app%2Fapi%2Fnotifications%2Froute&pagePath=private-next-app-dir%2Fapi%2Fnotifications%2Froute.ts&appDir=D%3A%5Clunar-base-backend%5Csrc%5Capp&appPaths=%2Fapi%2Fnotifications%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = app_route_module.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = ""
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: route_kind.RouteKind.APP_ROUTE,
        page: "/api/notifications/route",
        pathname: "/api/notifications",
        filename: "route",
        bundlePath: "app/api/notifications/route"
    },
    resolvedPagePath: "D:\\lunar-base-backend\\src\\app\\api\\notifications\\route.ts",
    nextConfigOutput,
    userland: route_namespaceObject
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/api/notifications/route";


//# sourceMappingURL=app-route.js.map

/***/ }),

/***/ 68100:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ e0)
/* harmony export */ });
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61363);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`D:\lunar-base-backend\src\lib\supabase.ts`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["supabase"];


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [478,363,565,937,778], () => (__webpack_exec__(1855)));
module.exports = __webpack_exports__;

})();