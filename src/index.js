"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
require("./index.css");
const App_1 = __importDefault(require("./App"));
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const index_1 = __importDefault(require("./store/index"));
const container = document.getElementById("root");
const root = (0, client_1.createRoot)(container); // createRoot(container!) if you use TypeScript
root.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_redux_1.Provider, Object.assign({ store: index_1.default }, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) })) }));
