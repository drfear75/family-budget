import { _ as __nuxt_component_0 } from './nuxt-link-BD9fIjFC.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createTextVNode, computed, createElementBlock, shallowRef, getCurrentInstance, provide, cloneVNode, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-DxYTVa8G.mjs';
import { a as useSupabaseUser } from './server.mjs';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'vue-chartjs';
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

defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ExpenseForm",
  __ssrInlineRender: true,
  emits: ["expense-saved"],
  setup(__props, { emit: __emit }) {
    const amount = ref("");
    const category = ref("Food");
    const date = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const description = ref("");
    const paidBy = ref("Massimo");
    const loading = ref(false);
    useSupabaseClient();
    useSupabaseUser();
    const categories = ["Food", "Transport", "Utilities", "Entertainment", "Health", "Other"];
    const people = ["Massimo", "Elena"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto" }, _attrs))}><h3 class="text-xl font-semibold mb-4 text-gray-800">New Expense</h3><div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-1">Scan Receipt</label><input type="file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">`);
      if (unref(loading)) {
        _push(`<p class="text-xs text-blue-500 mt-1">Analyzing receipt...</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700">Amount</label><input${ssrRenderAttr("value", unref(amount))} type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="0.00"></div><div><label class="block text-sm font-medium text-gray-700">Category</label><select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"><!--[-->`);
      ssrRenderList(categories, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat)}${ssrIncludeBooleanAttr(Array.isArray(unref(category)) ? ssrLooseContain(unref(category), cat) : ssrLooseEqual(unref(category), cat)) ? " selected" : ""}>${ssrInterpolate(cat)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700">Paid By</label><select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"><!--[-->`);
      ssrRenderList(people, (person) => {
        _push(`<option${ssrRenderAttr("value", person)}${ssrIncludeBooleanAttr(Array.isArray(unref(paidBy)) ? ssrLooseContain(unref(paidBy), person) : ssrLooseEqual(unref(paidBy), person)) ? " selected" : ""}>${ssrInterpolate(person)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700">Date</label><input${ssrRenderAttr("value", unref(date))} type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></div><div><label class="block text-sm font-medium text-gray-700">Description</label><input${ssrRenderAttr("value", unref(description))} type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></div><button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> Save Expense </button></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ExpenseForm.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$5, { __name: "ExpenseForm" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "IncomeForm",
  __ssrInlineRender: true,
  emits: ["income-saved"],
  setup(__props, { emit: __emit }) {
    const amount = ref("");
    const source = ref("Salary");
    const date = ref((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    const description = ref("");
    const paidBy = ref("Massimo");
    ref(false);
    useSupabaseClient();
    useSupabaseUser();
    const sources = ["Salary", "Freelance", "Gift", "Investment", "Other"];
    const people = ["Massimo", "Elena"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto" }, _attrs))}><h3 class="text-xl font-semibold mb-4 text-green-700">New Income</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700">Amount</label><input${ssrRenderAttr("value", unref(amount))} type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" placeholder="0.00"></div><div><label class="block text-sm font-medium text-gray-700">Source</label><select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"><!--[-->`);
      ssrRenderList(sources, (src) => {
        _push(`<option${ssrRenderAttr("value", src)}${ssrIncludeBooleanAttr(Array.isArray(unref(source)) ? ssrLooseContain(unref(source), src) : ssrLooseEqual(unref(source), src)) ? " selected" : ""}>${ssrInterpolate(src)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700">Received By</label><select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"><!--[-->`);
      ssrRenderList(people, (person) => {
        _push(`<option${ssrRenderAttr("value", person)}${ssrIncludeBooleanAttr(Array.isArray(unref(paidBy)) ? ssrLooseContain(unref(paidBy), person) : ssrLooseEqual(unref(paidBy), person)) ? " selected" : ""}>${ssrInterpolate(person)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700">Date</label><input${ssrRenderAttr("value", unref(date))} type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"></div><div><label class="block text-sm font-medium text-gray-700">Description</label><input${ssrRenderAttr("value", unref(description))} type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"></div><button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"> Save Income </button></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/IncomeForm.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$4, { __name: "IncomeForm" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ReminderForm",
  __ssrInlineRender: true,
  emits: ["reminder-saved"],
  setup(__props, { emit: __emit }) {
    const title = ref("");
    const amount = ref("");
    const dueDate = ref("");
    const loading = ref(false);
    useSupabaseClient();
    useSupabaseUser();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-6 rounded-lg shadow-md mb-6" }, _attrs))}><h3 class="text-xl font-semibold mb-4 text-gray-800">Set Reminder</h3><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700">Title</label><input${ssrRenderAttr("value", unref(title))} type="text" placeholder="e.g., Electricity Bill" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></div><div><label class="block text-sm font-medium text-gray-700">Amount (Optional)</label><input${ssrRenderAttr("value", unref(amount))} type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></div><div><label class="block text-sm font-medium text-gray-700">Due Date</label><input${ssrRenderAttr("value", unref(dueDate))} type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></div><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">${ssrInterpolate(unref(loading) ? "Saving..." : "Set Reminder")}</button></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ReminderForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$3, { __name: "ReminderForm" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ReminderList",
  __ssrInlineRender: true,
  props: ["reminders"],
  emits: ["mark-paid", "edit-reminder", "delete-reminder", "convert-to-expense"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-6 rounded-lg shadow-md" }, _attrs))}><h3 class="text-xl font-semibold mb-4 text-gray-800">Upcoming Reminders</h3>`);
      if (__props.reminders.length === 0) {
        _push(`<div class="text-gray-500 text-center py-4"> No active reminders. </div>`);
      } else {
        _push(`<ul class="space-y-3"><!--[-->`);
        ssrRenderList(__props.reminders, (reminder) => {
          _push(`<li class="${ssrRenderClass([reminder.is_paid ? "border-green-500" : "border-orange-500", "flex justify-between items-center p-3 border-l-4 rounded bg-gray-50 hover:bg-gray-100 transition group"])}"><div><p class="${ssrRenderClass([{ "line-through text-gray-400": reminder.is_paid }, "font-medium text-gray-900"])}">${ssrInterpolate(reminder.title)}</p><p class="text-xs text-gray-500">Due: ${ssrInterpolate(reminder.due_date)}</p></div><div class="flex items-center gap-2">`);
          if (reminder.amount) {
            _push(`<span class="font-bold text-gray-700">$ ${ssrInterpolate(reminder.amount)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (!reminder.is_paid) {
            _push(`<button class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"> Mark Paid </button>`);
          } else {
            _push(`<!---->`);
          }
          if (!reminder.is_paid && reminder.amount) {
            _push(`<button class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition"> Expense </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition text-xs">Edit</button><button class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition text-xs">Delete</button></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ReminderList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "ReminderList" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Statistics",
  __ssrInlineRender: true,
  props: ["expenses", "incomes"],
  setup(__props) {
    Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    const props = __props;
    const expensesByCategory = computed(() => {
      const categories = {};
      props.expenses.forEach((expense) => {
        const cat = expense.category || "Other";
        categories[cat] = (categories[cat] || 0) + parseFloat(expense.amount);
      });
      return categories;
    });
    const incomesBySource = computed(() => {
      const sources = {};
      props.incomes.forEach((income) => {
        const src = income.source || "Other";
        sources[src] = (sources[src] || 0) + parseFloat(income.amount);
      });
      return sources;
    });
    const expensesByPerson = computed(() => {
      const people = {};
      props.expenses.forEach((expense) => {
        const person = expense.paid_by || "Unknown";
        people[person] = (people[person] || 0) + parseFloat(expense.amount);
      });
      return people;
    });
    const incomesByPerson = computed(() => {
      const people = {};
      props.incomes.forEach((income) => {
        const person = income.paid_by || "Unknown";
        people[person] = (people[person] || 0) + parseFloat(income.amount);
      });
      return people;
    });
    const totalExpenses = computed(() => {
      return props.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    });
    const totalIncomes = computed(() => {
      return props.incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
    });
    const balance = computed(() => totalIncomes.value - totalExpenses.value);
    const expenseChartData = computed(() => ({
      labels: Object.keys(expensesByCategory.value),
      datasets: [{
        label: "Expenses by Category",
        data: Object.values(expensesByCategory.value),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ]
      }]
    }));
    const incomeChartData = computed(() => ({
      labels: Object.keys(incomesBySource.value),
      datasets: [{
        label: "Incomes by Source",
        data: Object.values(incomesBySource.value),
        backgroundColor: [
          "#4CAF50",
          "#8BC34A",
          "#CDDC39",
          "#FFEB3B",
          "#FFC107"
        ]
      }]
    }));
    const expensesByPersonChart = computed(() => ({
      labels: Object.keys(expensesByPerson.value),
      datasets: [{
        label: "Expenses by Person",
        data: Object.values(expensesByPerson.value),
        backgroundColor: ["#FF6384", "#36A2EB"]
      }]
    }));
    const incomesByPersonChart = computed(() => ({
      labels: Object.keys(incomesByPerson.value),
      datasets: [{
        label: "Incomes by Person",
        data: Object.values(incomesByPerson.value),
        backgroundColor: ["#4CAF50", "#8BC34A"]
      }]
    }));
    const comparisonChartData = computed(() => ({
      labels: ["Total"],
      datasets: [
        {
          label: "Incomes",
          data: [totalIncomes.value],
          backgroundColor: "#4CAF50"
        },
        {
          label: "Expenses",
          data: [totalExpenses.value],
          backgroundColor: "#F44336"
        }
      ]
    }));
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="bg-green-50 p-6 rounded-lg shadow"><h3 class="text-sm font-medium text-green-800">Total Incomes</h3><p class="text-3xl font-bold text-green-600 mt-2">$ ${ssrInterpolate(totalIncomes.value.toFixed(2))}</p></div><div class="bg-red-50 p-6 rounded-lg shadow"><h3 class="text-sm font-medium text-red-800">Total Expenses</h3><p class="text-3xl font-bold text-red-600 mt-2">$ ${ssrInterpolate(totalExpenses.value.toFixed(2))}</p></div><div class="${ssrRenderClass([balance.value >= 0 ? "bg-blue-50" : "bg-orange-50", "p-6 rounded-lg shadow"])}"><h3 class="${ssrRenderClass([balance.value >= 0 ? "text-blue-800" : "text-orange-800", "text-sm font-medium"])}">Balance</h3><p class="${ssrRenderClass([balance.value >= 0 ? "text-blue-600" : "text-orange-600", "text-3xl font-bold mt-2"])}">$ ${ssrInterpolate(balance.value.toFixed(2))}</p></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white p-6 rounded-lg shadow"><h3 class="text-lg font-semibold mb-4 text-gray-800">Expenses by Person</h3>`);
      if (Object.keys(expensesByPerson.value).length > 0) {
        _push(`<div style="${ssrRenderStyle({ "height": "300px" })}">`);
        _push(ssrRenderComponent(unref(Pie), {
          data: expensesByPersonChart.value,
          options: chartOptions
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<p class="text-gray-500 text-center py-8">No expense data available</p>`);
      }
      if (Object.keys(expensesByPerson.value).length > 0) {
        _push(`<div class="mt-4 space-y-2"><!--[-->`);
        ssrRenderList(expensesByPerson.value, (amount, person) => {
          _push(`<div class="flex justify-between text-sm"><span class="font-medium">${ssrInterpolate(person)}:</span><span class="text-gray-600">$ ${ssrInterpolate(amount.toFixed(2))} (${ssrInterpolate((amount / totalExpenses.value * 100).toFixed(1))}%)</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-white p-6 rounded-lg shadow"><h3 class="text-lg font-semibold mb-4 text-gray-800">Incomes by Person</h3>`);
      if (Object.keys(incomesByPerson.value).length > 0) {
        _push(`<div style="${ssrRenderStyle({ "height": "300px" })}">`);
        _push(ssrRenderComponent(unref(Pie), {
          data: incomesByPersonChart.value,
          options: chartOptions
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<p class="text-gray-500 text-center py-8">No income data available</p>`);
      }
      if (Object.keys(incomesByPerson.value).length > 0) {
        _push(`<div class="mt-4 space-y-2"><!--[-->`);
        ssrRenderList(incomesByPerson.value, (amount, person) => {
          _push(`<div class="flex justify-between text-sm"><span class="font-medium">${ssrInterpolate(person)}:</span><span class="text-gray-600">$ ${ssrInterpolate(amount.toFixed(2))} (${ssrInterpolate((amount / totalIncomes.value * 100).toFixed(1))}%)</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white p-6 rounded-lg shadow"><h3 class="text-lg font-semibold mb-4 text-gray-800">Expenses by Category</h3>`);
      if (Object.keys(expensesByCategory.value).length > 0) {
        _push(`<div style="${ssrRenderStyle({ "height": "300px" })}">`);
        _push(ssrRenderComponent(unref(Pie), {
          data: expenseChartData.value,
          options: chartOptions
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<p class="text-gray-500 text-center py-8">No expense data available</p>`);
      }
      _push(`</div><div class="bg-white p-6 rounded-lg shadow"><h3 class="text-lg font-semibold mb-4 text-gray-800">Incomes by Source</h3>`);
      if (Object.keys(incomesBySource.value).length > 0) {
        _push(`<div style="${ssrRenderStyle({ "height": "300px" })}">`);
        _push(ssrRenderComponent(unref(Pie), {
          data: incomeChartData.value,
          options: chartOptions
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<p class="text-gray-500 text-center py-8">No income data available</p>`);
      }
      _push(`</div></div><div class="bg-white p-6 rounded-lg shadow"><h3 class="text-lg font-semibold mb-4 text-gray-800">Income vs Expenses</h3><div style="${ssrRenderStyle({ "height": "300px" })}">`);
      _push(ssrRenderComponent(unref(Bar), {
        data: comparisonChartData.value,
        options: chartOptions
      }, null, _parent));
      _push(`</div></div><div class="bg-white p-6 rounded-lg shadow"><h3 class="text-lg font-semibold mb-4 text-gray-800">Expense Breakdown</h3><table class="w-full"><thead><tr class="border-b"><th class="text-left py-2">Category</th><th class="text-right py-2">Amount</th><th class="text-right py-2">Percentage</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(expensesByCategory.value, (amount, category) => {
        _push(`<tr class="border-b"><td class="py-2">${ssrInterpolate(category)}</td><td class="text-right">$ ${ssrInterpolate(amount.toFixed(2))}</td><td class="text-right">${ssrInterpolate((amount / totalExpenses.value * 100).toFixed(1))}%</td></tr>`);
      });
      _push(`<!--]--></tbody><tfoot><tr class="font-bold"><td class="py-2">Total</td><td class="text-right">$ ${ssrInterpolate(totalExpenses.value.toFixed(2))}</td><td class="text-right">100%</td></tr></tfoot></table></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Statistics.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "Statistics" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const user = useSupabaseUser();
    const supabase = useSupabaseClient();
    const expenses = ref([]);
    const reminders = ref([]);
    const incomes = ref([]);
    const activeTab = ref("expenses");
    const dueRemindersCount = ref(0);
    const editingItem = ref(null);
    const editingType = ref("");
    const people = ["Massimo", "Elena"];
    const fetchExpenses = async () => {
      const { data } = await supabase.from("expenses").select("*").order("date", { ascending: false });
      if (data) expenses.value = data;
    };
    const fetchIncomes = async () => {
      const { data } = await supabase.from("incomes").select("*").order("date", { ascending: false });
      if (data) incomes.value = data;
    };
    const fetchReminders = async () => {
      const { data } = await supabase.from("reminders").select("*").order("due_date", { ascending: true });
      if (data) {
        reminders.value = data;
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        dueRemindersCount.value = data.filter((r) => !r.is_paid && r.due_date <= today).length;
      }
    };
    const markReminderPaid = async (id) => {
      const { error } = await supabase.from("reminders").update({ is_paid: true }).eq("id", id);
      if (!error) await fetchReminders();
    };
    const startEdit = (item, type) => {
      editingItem.value = { ...item };
      editingType.value = type;
    };
    const deleteItem = async (id, type) => {
      if (!confirm("Are you sure you want to delete this item?")) return;
      let table = "";
      table = "reminders";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        alert("Error deleting: " + error.message);
      } else {
        await fetchReminders();
      }
    };
    const convertReminderToExpense = async (reminder) => {
      if (!confirm("Convert this reminder to an expense?")) return;
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        alert("Authentication error");
        return;
      }
      const expensePayload = {
        user_id: currentUser.id,
        amount: reminder.amount || 0,
        category: "Other",
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        description: reminder.title,
        paid_by: "Massimo"
      };
      const { error: expenseError } = await supabase.from("expenses").insert(expensePayload);
      if (expenseError) {
        alert("Error creating expense: " + expenseError.message);
        return;
      }
      const { error: updateError } = await supabase.from("reminders").update({ is_paid: true }).eq("id", reminder.id);
      if (updateError) {
        alert("Expense created but failed to mark reminder as paid");
      } else {
        alert("Reminder converted to expense!");
        await Promise.all([fetchExpenses(), fetchReminders()]);
        activeTab.value = "expenses";
      }
    };
    watch(user, async (newUser) => {
      if (newUser) await Promise.all([fetchExpenses(), fetchReminders(), fetchIncomes()]);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ExpenseForm = __nuxt_component_1;
      const _component_IncomeForm = __nuxt_component_2;
      const _component_ReminderForm = __nuxt_component_3;
      const _component_ReminderList = __nuxt_component_4;
      const _component_Statistics = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-100 p-8" }, _attrs))}><div class="max-w-6xl mx-auto"><div class="flex justify-between items-center mb-8"><h1 class="text-3xl font-bold text-gray-900">Family Budget Dashboard</h1>`);
      if (unref(user)) {
        _push(`<div class="flex items-center gap-4"><span class="text-sm text-gray-600">${ssrInterpolate(unref(user).email)}</span><button class="text-sm text-red-600 hover:text-red-800">Sign Out</button></div>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Login`);
            } else {
              return [
                createTextVNode("Login")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
      if (unref(user)) {
        _push(`<div>`);
        if (unref(dueRemindersCount) > 0) {
          _push(`<div class="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p class="font-bold">Attention Needed</p><p>You have ${ssrInterpolate(unref(dueRemindersCount))} reminder(s) due or overdue. Please check the Reminders tab.</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(editingItem)) {
          _push(`<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"><div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"><h3 class="text-xl font-bold mb-4">Edit ${ssrInterpolate(unref(editingType) === "expense" ? "Expense" : unref(editingType) === "income" ? "Income" : "Reminder")}</h3><div class="space-y-4">`);
          if (unref(editingType) === "reminder") {
            _push(`<div><label class="block text-sm font-medium text-gray-700">Title</label><input${ssrRenderAttr("value", unref(editingItem).title)} type="text" class="mt-1 block w-full border rounded p-2"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><label class="block text-sm font-medium text-gray-700">Amount</label><input${ssrRenderAttr("value", unref(editingItem).amount)} type="number" step="0.01" class="mt-1 block w-full border rounded p-2"></div>`);
          if (unref(editingType) === "expense") {
            _push(`<div><label class="block text-sm font-medium text-gray-700">Category</label><input${ssrRenderAttr("value", unref(editingItem).category)} type="text" class="mt-1 block w-full border rounded p-2"></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(editingType) === "income") {
            _push(`<div><label class="block text-sm font-medium text-gray-700">Source</label><input${ssrRenderAttr("value", unref(editingItem).source)} type="text" class="mt-1 block w-full border rounded p-2"></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(editingType) !== "reminder") {
            _push(`<div><label class="block text-sm font-medium text-gray-700">${ssrInterpolate(unref(editingType) === "expense" ? "Paid By" : "Received By")}</label><select class="mt-1 block w-full border rounded p-2"><!--[-->`);
            ssrRenderList(people, (person) => {
              _push(`<option${ssrRenderAttr("value", person)}${ssrIncludeBooleanAttr(Array.isArray(unref(editingItem).paid_by) ? ssrLooseContain(unref(editingItem).paid_by, person) : ssrLooseEqual(unref(editingItem).paid_by, person)) ? " selected" : ""}>${ssrInterpolate(person)}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(editingType) === "reminder") {
            _push(`<div><label class="block text-sm font-medium text-gray-700">Due Date</label><input${ssrRenderAttr("value", unref(editingItem).due_date)} type="date" class="mt-1 block w-full border rounded p-2"></div>`);
          } else {
            _push(`<div><label class="block text-sm font-medium text-gray-700">Date</label><input${ssrRenderAttr("value", unref(editingItem).date)} type="date" class="mt-1 block w-full border rounded p-2"></div>`);
          }
          _push(`<div><label class="block text-sm font-medium text-gray-700">Description</label><input${ssrRenderAttr("value", unref(editingItem).description)} type="text" class="mt-1 block w-full border rounded p-2"></div><div class="flex justify-end gap-2 mt-4"><button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button><button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mb-6 border-b border-gray-200"><nav class="-mb-px flex space-x-8" aria-label="Tabs"><button class="${ssrRenderClass([unref(activeTab) === "expenses" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"])}"> Expenses </button><button class="${ssrRenderClass([unref(activeTab) === "incomes" ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"])}"> Incomes </button><button class="${ssrRenderClass([unref(activeTab) === "reminders" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"])}"> Reminders </button><button class="${ssrRenderClass([unref(activeTab) === "statistics" ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"])}"> Statistics </button></nav></div>`);
        if (unref(activeTab) === "expenses") {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8">`);
          _push(ssrRenderComponent(_component_ExpenseForm, { onExpenseSaved: fetchExpenses }, null, _parent));
          _push(`<div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-xl font-semibold mb-4 text-gray-800">Recent Expenses</h3>`);
          if (unref(expenses).length === 0) {
            _push(`<div class="text-gray-500 text-center py-4">No expenses recorded yet.</div>`);
          } else {
            _push(`<ul class="space-y-3"><!--[-->`);
            ssrRenderList(unref(expenses), (expense) => {
              _push(`<li class="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition group"><div class="flex-1"><p class="font-medium text-gray-900">${ssrInterpolate(expense.description || expense.category)}</p><p class="text-xs text-gray-500">${ssrInterpolate(expense.date)} ${ssrInterpolate(expense.paid_by || "N/A")}</p></div><div class="flex items-center gap-3"><span class="font-bold text-gray-900">$ ${ssrInterpolate(expense.amount)}</span><button class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition text-sm">Edit</button><button class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition text-sm">Delete</button></div></li>`);
            });
            _push(`<!--]--></ul>`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "incomes") {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8">`);
          _push(ssrRenderComponent(_component_IncomeForm, { onIncomeSaved: fetchIncomes }, null, _parent));
          _push(`<div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-xl font-semibold mb-4 text-gray-800">Recent Incomes</h3>`);
          if (unref(incomes).length === 0) {
            _push(`<div class="text-gray-500 text-center py-4">No incomes recorded yet.</div>`);
          } else {
            _push(`<ul class="space-y-3"><!--[-->`);
            ssrRenderList(unref(incomes), (income) => {
              _push(`<li class="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition group"><div class="flex-1"><p class="font-medium text-gray-900">${ssrInterpolate(income.description || income.source)}</p><p class="text-xs text-gray-500">${ssrInterpolate(income.date)} ${ssrInterpolate(income.paid_by || "N/A")}</p></div><div class="flex items-center gap-3"><span class="font-bold text-green-700">$ ${ssrInterpolate(income.amount)}</span><button class="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition text-sm">Edit</button><button class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition text-sm">Delete</button></div></li>`);
            });
            _push(`<!--]--></ul>`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "reminders") {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8">`);
          _push(ssrRenderComponent(_component_ReminderForm, { onReminderSaved: fetchReminders }, null, _parent));
          _push(ssrRenderComponent(_component_ReminderList, {
            reminders: unref(reminders),
            onMarkPaid: markReminderPaid,
            onEditReminder: (r) => startEdit(r, "reminder"),
            onDeleteReminder: (id) => deleteItem(id),
            onConvertToExpense: convertReminderToExpense
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "statistics") {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_Statistics, {
            expenses: unref(expenses),
            incomes: unref(incomes)
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="text-center py-20"><h2 class="text-2xl text-gray-700 mb-4">Welcome to Family Budget</h2><p class="text-gray-600 mb-8">Please login to manage your expenses.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Get Started`);
            } else {
              return [
                createTextVNode("Get Started")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CfgA_bKe.mjs.map
