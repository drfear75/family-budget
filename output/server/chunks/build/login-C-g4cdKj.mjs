import { defineComponent, ref, watchEffect, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-DxYTVa8G.mjs';
import { a as useSupabaseUser, n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const user = useSupabaseUser();
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const isSignUp = ref(false);
    const message = ref("");
    watchEffect(() => {
      if (user.value) {
        return navigateTo("/");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" }, _attrs))}><div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg"><div class="text-center"><h2 class="mt-6 text-3xl font-extrabold text-gray-900">Family Budget</h2><p class="mt-2 text-sm text-gray-600">Sign in to manage your expenses</p></div>`);
      if (unref(message)) {
        _push(`<div class="${ssrRenderClass([unref(message).includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700", "p-4 rounded-md"])}">${ssrInterpolate(unref(message))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-8 space-y-6"><div class="space-y-4"><div><label for="email" class="block text-sm font-medium text-gray-700">Email address</label><div class="mt-1"><input${ssrRenderAttr("value", unref(email))} id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></div></div><div><label for="password" class="block text-sm font-medium text-gray-700">Password</label><div class="mt-1"><input${ssrRenderAttr("value", unref(password))} id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></div></div><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">${ssrInterpolate(unref(loading) ? "Loading..." : unref(isSignUp) ? "Create Account" : "Sign In")}</button><div class="text-center"><button class="text-sm text-blue-600 hover:text-blue-500">${ssrInterpolate(unref(isSignUp) ? "Already have an account? Sign in" : "Need an account? Sign up")}</button></div></div><div class="relative"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">Or continue with</span></div></div><div class="space-y-4"><button class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"> Sign in with Google </button><button class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"> Sign in with Microsoft </button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-C-g4cdKj.mjs.map
