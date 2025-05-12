exports.id = 402;
exports.ids = [402];
exports.modules = {

/***/ 34198:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 31232, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 52987, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 50831, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 56926, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 44282, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 16505, 23))

/***/ }),

/***/ 22598:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 7365));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 32910))

/***/ }),

/***/ 32910:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LayoutWrapper)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(57114);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/layout-dashboard.js
var layout_dashboard = __webpack_require__(97849);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/map.js
var map = __webpack_require__(79898);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/building-2.js
var building_2 = __webpack_require__(13482);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/battery.js
var battery = __webpack_require__(20631);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/navigation.js
var icons_navigation = __webpack_require__(36583);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bot.js
var bot = __webpack_require__(13560);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/heart.js
var heart = __webpack_require__(87371);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/clipboard-list.js
var clipboard_list = __webpack_require__(44881);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/shield.js
var shield = __webpack_require__(44901);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bar-chart-3.js
var bar_chart_3 = __webpack_require__(35256);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user.js
var user = __webpack_require__(93680);
// EXTERNAL MODULE: ./node_modules/@supabase/auth-helpers-nextjs/dist/index.js
var dist = __webpack_require__(43334);
;// CONCATENATED MODULE: ./src/components/Sidebar.tsx
/* __next_internal_client_entry_do_not_use__ Sidebar auto */ 














const Sidebar_navigation = [
    {
        name: "Профиль",
        icon: user/* default */.Z,
        href: "/profile"
    },
    {
        name: "Панель управления",
        icon: layout_dashboard/* default */.Z,
        href: "/dashboard"
    },
    {
        name: "Анализ участка",
        icon: map/* default */.Z,
        href: "/site-analysis"
    },
    {
        name: "Инфраструктура",
        icon: building_2/* default */.Z,
        href: "/infrastructure"
    },
    {
        name: "Ресурсы",
        icon: battery/* default */.Z,
        href: "/resources"
    },
    {
        name: "Навигация",
        icon: icons_navigation/* default */.Z,
        href: "/navigation"
    },
    {
        name: "Управление роботами",
        icon: bot/* default */.Z,
        href: "/robotics"
    },
    {
        name: "Медицина",
        icon: heart/* default */.Z,
        href: "/medical"
    },
    {
        name: "Администрирование",
        icon: clipboard_list/* default */.Z,
        href: "/admin"
    },
    {
        name: "Безопасность",
        icon: shield/* default */.Z,
        href: "/security"
    },
    {
        name: "Аналитика",
        icon: bar_chart_3/* default */.Z,
        href: "/analytics"
    }
];
function Sidebar() {
    const supabase = (0,dist.createClientComponentClient)();
    const [name, setName] = (0,react_.useState)("Пользователь");
    const [avatar, setAvatar] = (0,react_.useState)("/photo/default.jpg");
    (0,react_.useEffect)(()=>{
        const loadUser = async ()=>{
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data, error } = await supabase.from("users").select("first_name, last_name, avatar_url").eq("id", user.id).single();
            if (!error && data) {
                setName(`${data.first_name} ${data.last_name}`);
                if (data.avatar_url) setAvatar(data.avatar_url);
            }
        };
        loadUser();
    }, [
        supabase
    ]);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("aside", {
        className: "fixed top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 z-10",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "mb-8 px-4 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("img", {
                        src: avatar,
                        alt: "Аватар",
                        className: "w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                        className: "text-white font-semibold truncate",
                        children: name
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("nav", {
                className: "space-y-1",
                "aria-label": "Главное меню",
                children: Sidebar_navigation.map((item)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                        href: item.href,
                        className: "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(item.icon, {
                                className: "w-6 h-6"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                children: item.name
                            })
                        ]
                    }, item.href))
            })
        ]
    });
}

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bell.js
var bell = __webpack_require__(3514);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/log-out.js
var log_out = __webpack_require__(90092);
;// CONCATENATED MODULE: ./src/components/Header.tsx
/* __next_internal_client_entry_do_not_use__ Header auto */ 





function Header() {
    const supabase = (0,dist.createClientComponentClient)();
    const router = (0,navigation.useRouter)();
    const [name, setName] = (0,react_.useState)("Пользователь");
    const [avatar, setAvatar] = (0,react_.useState)("/photo/default.jpg");
    (0,react_.useEffect)(()=>{
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            const { data, error } = await supabase.from("users").select("first_name, last_name, avatar_url").eq("id", user.id).single();
            if (!error && data) {
                setName(`${data.first_name} ${data.last_name}`);
                if (data.avatar_url) setAvatar(data.avatar_url);
            }
        }
        load();
    }, [
        supabase,
        router
    ]);
    const handleLogout = async ()=>{
        await supabase.auth.signOut();
        router.push("/login");
    };
    return /*#__PURE__*/ jsx_runtime_.jsx("header", {
        className: "h-16 bg-white border-b shadow-md fixed top-0 left-72 right-0 z-10",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "h-full flex items-center justify-between px-6",
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: "text-xl font-semibold text-gray-800",
                    children: "Система управления лунной базой"
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                            onClick: ()=>{},
                            className: "p-2 hover:bg-gray-100 rounded-full relative",
                            "aria-label": "Уведомления",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(bell/* default */.Z, {
                                    className: "w-5 h-5 text-gray-600"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                    className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                    className: "text-sm text-gray-600 truncate",
                                    children: name
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                    src: avatar,
                                    alt: "Аватар",
                                    className: "w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                    onClick: handleLogout,
                                    className: "p-2 hover:bg-gray-100 rounded-full",
                                    "aria-label": "Выйти",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx(log_out/* default */.Z, {
                                        className: "w-5 h-5 text-gray-600"
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
}

;// CONCATENATED MODULE: ./src/components/LayoutWrapper.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




function LayoutWrapper({ children }) {
    const path = (0,navigation.usePathname)();
    const noNav = [
        "/login",
        "/register"
    ];
    const isProf = path === "/profile" || path === "/dashboard";
    if (noNav.includes(path || "")) {
        return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
            children: children
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(Sidebar, {}),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: [
                    "pl-72 pt-16 min-h-screen",
                    isProf ? "bg-white text-black" : "bg-gray-900 text-white"
                ].join(" "),
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(Header, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx("main", {
                        className: "p-6",
                        children: children
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 47071:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\app\\layout.tsx","import":"Montserrat","arguments":[{"subsets":["latin"],"weight":["400","600","700"]}],"variableName":"montserrat"}
var target_path_src_app_layout_tsx_import_Montserrat_arguments_subsets_latin_weight_400_600_700_variableName_montserrat_ = __webpack_require__(51273);
var target_path_src_app_layout_tsx_import_Montserrat_arguments_subsets_latin_weight_400_600_700_variableName_montserrat_default = /*#__PURE__*/__webpack_require__.n(target_path_src_app_layout_tsx_import_Montserrat_arguments_subsets_latin_weight_400_600_700_variableName_montserrat_);
// EXTERNAL MODULE: ./src/app/globals.css
var globals = __webpack_require__(5023);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(61363);
;// CONCATENATED MODULE: ./src/components/LayoutWrapper.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`D:\lunar-base-backend\src\components\LayoutWrapper.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const LayoutWrapper = (__default__);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/index.mjs
var dist = __webpack_require__(76094);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/ReactToastify.css
var ReactToastify = __webpack_require__(97001);
;// CONCATENATED MODULE: ./src/app/layout.tsx






const metadata = {
    title: "Лунная база",
    description: "Управление инфраструктурой на Луне"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "ru",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("body", {
            className: (target_path_src_app_layout_tsx_import_Montserrat_arguments_subsets_latin_weight_400_600_700_variableName_montserrat_default()).className,
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(LayoutWrapper, {
                    children: children
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(dist/* ToastContainer */.Ix, {})
            ]
        })
    });
}


/***/ }),

/***/ 5023:
/***/ (() => {



/***/ })

};
;