"use strict";
(() => {
var exports = {};
exports.id = 569;
exports.ids = [569];
exports.modules = {

/***/ 14300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 82361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 57147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 41808:
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 71017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 85477:
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 24404:
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 17533:
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

// NAMESPACE OBJECT: ./src/app/api/register/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  POST: () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(19513);
// EXTERNAL MODULE: ./src/lib/supabase-admin.ts
var supabase_admin = __webpack_require__(42426);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(89335);
;// CONCATENATED MODULE: ./src/app/api/register/route.ts


async function POST(request) {
    try {
        const { first_name, email, password } = await request.json();
        if (!first_name || !email || !password) {
            return next_response/* default */.Z.json({
                error: "Все поля обязательны"
            }, {
                status: 400
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next_response/* default */.Z.json({
                error: "Неверный формат email"
            }, {
                status: 400
            });
        }
        if (password.length < 6) {
            return next_response/* default */.Z.json({
                error: "Пароль должен быть не менее 6 символов"
            }, {
                status: 400
            });
        }
        const { data, error } = await supabase_admin/* supabaseAdmin */.p.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "https://super-puper-secret.vercel.app/confirmed",
                data: {
                    first_name
                }
            }
        });
        if (error) {
            const lower = error.message.toLowerCase();
            if (lower.includes("user already registered")) {
                return next_response/* default */.Z.json({
                    error: "Пользователь с таким email уже зарегистрирован. Пожалуйста, войдите в аккаунт."
                }, {
                    status: 409
                });
            }
            return next_response/* default */.Z.json({
                error: error.message
            }, {
                status: 400
            });
        }
        const user = data?.user;
        if (!user || !user.id) {
            return next_response/* default */.Z.json({
                error: "Регистрация не удалась. Попробуйте позже."
            }, {
                status: 500
            });
        }
        const { data: existing } = await supabase_admin/* supabaseAdmin */.p.from("users").select("id").eq("id", user.id).maybeSingle();
        if (!existing) {
            const { error: profileError } = await supabase_admin/* supabaseAdmin */.p.from("users").insert([
                {
                    id: user.id,
                    email,
                    first_name,
                    avatar_url: ""
                }
            ]);
            if (profileError) {
                console.error("Ошибка вставки профиля:", profileError);
                return next_response/* default */.Z.json({
                    error: `Ошибка вставки профиля: ${profileError.message}`
                }, {
                    status: 500
                });
            }
        } else {
            console.log("Профиль уже существует, вставка пропущена.");
        }
        return next_response/* default */.Z.json({
            message: "Письмо для подтверждения отправлено. Подтвердите email."
        });
    } catch (err) {
        console.error("Регистрация упала с ошибкой:", err);
        return next_response/* default */.Z.json({
            error: "Ошибка сервера. Попробуйте позже."
        }, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fregister%2Froute&name=app%2Fapi%2Fregister%2Froute&pagePath=private-next-app-dir%2Fapi%2Fregister%2Froute.ts&appDir=D%3A%5Clunar-base-backend%5Csrc%5Capp&appPaths=%2Fapi%2Fregister%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = app_route_module.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = ""
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: route_kind.RouteKind.APP_ROUTE,
        page: "/api/register/route",
        pathname: "/api/register",
        filename: "route",
        bundlePath: "app/api/register/route"
    },
    resolvedPagePath: "D:\\lunar-base-backend\\src\\app\\api\\register\\route.ts",
    nextConfigOutput,
    userland: route_namespaceObject
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/api/register/route";


//# sourceMappingURL=app-route.js.map

/***/ }),

/***/ 42426:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ supabaseAdmin)
/* harmony export */ });
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53066);
/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__);

const supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)("https://edqcdgmpxoobefiqvujl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcWNkZ21weG9vYmVmaXF2dWpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njg3ODg1MSwiZXhwIjoyMDYyNDU0ODUxfQ.8Il2dnp82XbyzQ4gB46z4aTv-bSBWgLIxK1QQj4EC2k", {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [478,565,937,778,66], () => (__webpack_exec__(17533)));
module.exports = __webpack_exports__;

})();