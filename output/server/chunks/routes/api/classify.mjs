import { c as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const classify = defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    amount: (Math.random() * 100).toFixed(2),
    category: ["Food", "Transport", "Utilities"][Math.floor(Math.random() * 3)],
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    description: "Scanned Receipt Item"
  };
});

export { classify as default };
//# sourceMappingURL=classify.mjs.map
