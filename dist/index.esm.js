// src/object/register-custom.ts
import register from "preact-custom-element";

// src/components/form-control.tsx
import { h as h14, Fragment as Fragment8 } from "preact";

// src/components/input.tsx
import { h } from "preact";

// src/hooks/value.tsx
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
function useValue(value) {
  const v = useSignal(null);
  useEffect(() => {
    if (value == void 0) return;
    v.value = value;
  }, [value]);
  return { value: v };
}

// src/hooks/name.tsx
import { useSignal as useSignal2 } from "@preact/signals";
import { useEffect as useEffect2 } from "preact/hooks";

// src/utils/index.ts
import RecursiveIterator from "recursive-iterator";

// src/utils/singleton.ts
function singleton(key, value) {
  if (!window[key]) {
    window[key] = value;
  }
  return window[key];
}

// src/utils/caches.ts
var CacheData = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.cache.set(key, value);
  }
  get(key) {
    return this.cache.get(key);
  }
  delete(key) {
    this.cache.delete(key);
  }
  has(key) {
    return this.cache.has(key);
  }
  clear() {
    this.cache.clear();
  }
};
function caches() {
  const cacheName = "_caches";
  return singleton(cacheName, new CacheData());
}

// src/utils/index.ts
var generateIndex = () => {
  let index = singleton("_index", 0);
  return index++;
};
var mergeTo = (value, obj) => {
  if (isFalsy(value)) {
    return {};
  }
  return obj || {};
};
function isFalsy(val, len) {
  if (!val) {
    return true;
  }
  const isNumber = val.constructor.name == "Number";
  const isString = val.constructor.name == "String";
  if (isNumber) {
    return !val;
  } else if (isString) {
    if (len) {
      return val == "undefined" || val == "null" || val.length <= len;
    }
    if (val == "false") {
      return true;
    }
    return val == "undefined" || val == "null";
  }
  return false;
}
var cloneObj = (ctx) => {
  if (!ctx) return ctx;
  try {
    if (typeof ctx == "string") {
      return JSON.parse(ctx);
    } else {
      return JSON.parse(JSON.stringify(ctx));
    }
  } catch (e) {
  }
  return ctx;
};
var parseUpdateData = (ctx) => {
  if (!ctx) {
    return {};
  }
  const parsedUpdate = cloneObj(ctx);
  return Object.keys(parsedUpdate).reduce((accu, key) => {
    accu[key] = cloneObj(parsedUpdate[key]);
    return accu;
  }, {});
};
var restructureControls = (data, update) => {
  update = parseUpdateData(update);
  data = cloneObj(data);
  return data.filter((item) => item).map((item) => {
    item.id = generateIndex();
    if (item.properties && typeof item.properties == "string") {
      item.properties = cloneObj(item.properties);
    }
    if (item.variants && typeof item.variants == "string") {
      item.variants = cloneObj(item.variants);
    }
    if (item.children && typeof item.children == "string") {
      item.children = cloneObj(item.children);
    }
    if (item.options && typeof item.options == "string") {
      item.options = cloneObj(item.options);
    }
    item.properties && item.properties.forEach(({ key, value }) => {
      item[key] = value;
    });
    if (update && update[item.name]) {
      item.value = update[item.name]?.value || update[item.name];
    }
    return item;
  });
};
var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function() {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || [];
  }
};
var getWindowWidth = () => {
  const [mobileType] = isMobile.any();
  return mobileType ? window.screen.width : window.innerWidth;
};
var sanitize = (str) => decodeURIComponent(String(str).replace(/<.*>/, ""));
var getControlValue = (control) => {
  let value = sanitize(control["value"]);
  if (control["type"] == "checkbox") {
    if (!control["checked"]) {
      value = null;
    }
  } else if (control["type"] == "file") {
    value = control["files"][0];
  }
  return value;
};
function getFormData(form, opts) {
  const o = {
    trim: false,
    json: true,
    key: "name"
  };
  if (opts && opts.trim != void 0) {
    o.trim = opts.trim;
  }
  if (opts && opts.json != void 0) {
    o.json = opts.json;
  }
  if (opts && opts.key != void 0) {
    o.key = opts.key;
  }
  const formData = new FormData(form);
  const data = {};
  const isTrim = o.trim;
  Array.from(form.elements).forEach((item) => {
    const value = opts?.is_sanitize == void 0 || opts?.is_sanitize ? sanitize(item["value"]) : item["value"];
    let name = item["name"];
    if (o.key == "data-name") {
      name = item.dataset.name;
    }
    if (name) {
      if (item["type"] == "checkbox") {
        item["checked"] && (data[name] = item["checked"]);
      } else if (item["type"] == "file") {
        console.log(item["files"]);
        data[name] = item["files"][0];
      } else if (isTrim && value != "") {
        data[name] = value;
      } else if (!isTrim) {
        data[name] = value;
      }
    }
  });
  delete data.PreventChromeAutocomplete;
  if (o.json == false) {
    Object.keys(data).forEach((key) => {
      if (!formData.has(key)) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
  return data;
}
var generateUniqueId = () => crypto.randomUUID();
var createOptions = (arr, selectedValue) => {
  return cloneObj(arr).map((item) => {
    if (selectedValue && item.value == selectedValue) {
      item.selected = true;
    }
    item.id = generateIndex();
    return item;
  });
};
var selectSize = (dic, size) => {
  let v = null;
  const keys = Object.keys(dic).sort((a, b) => Number(a) > Number(b) ? 1 : -1);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = Number(key);
    if (size <= value) {
      v = dic[key];
      break;
    }
    if (keys.length - 1 === i) {
      v = dic[key];
    }
  }
  return v;
};
var toBool = (test, a, b) => {
  switch (test) {
    case "eq":
      {
        return a == b;
      }
      ;
    case "ne":
      {
        return a != b;
      }
      ;
    case "gt":
      {
        return a > b;
      }
      ;
    case "lt":
      {
        return a < b;
      }
      ;
    case "gte":
      {
        return a >= b;
      }
      ;
    case "lte":
      {
        return a <= b;
      }
      ;
    case "in":
      {
        return a.includes(b);
      }
      ;
    case "notIn":
      {
        return !a.includes(b);
      }
      ;
    case "truthy": {
      const test2 = !!b || b == "0";
      return test2;
    }
    case "contains":
      {
        return a.includes(b);
      }
      ;
    case "notContains": {
      return !a.includes(b);
    }
    case "startsWith": {
      return a.startsWith(b);
    }
    case "endsWith": {
      return a.endsWith(b);
    }
    case "any": {
      return true;
    }
    default: {
      throw new Error(`Invalid test type - ${test}`);
    }
  }
};
var getVariant = (variants, payload) => {
  if (!variants || !variants.length) return;
  const testCtx = (target, ctx) => {
    let exp = {};
    if (["string", "number", "boolean"].includes(typeof target)) {
      exp.eq = target;
    } else if (typeof target == "object") {
      exp = Object.assign(exp, target);
    }
    ;
    const [[key, value]] = Object.entries(exp);
    return toBool(key, value, ctx);
  };
  const variant = variants.filter((item) => {
    const { test, data } = item?.fn || {};
    let t = false;
    if (typeof test == "boolean") {
      t = test;
    } else if (typeof test == "object") {
      const testItem = (test2) => Object.keys(test2).every((key) => {
        if (key.includes("caches.")) {
          const [a, b, c] = key.split(".");
          const parent = caches().get(b);
          if (!parent) {
            return false;
          }
          return testCtx(test2[key], parent.get(c));
        } else {
          return testCtx(test2[key], payload[key]);
        }
      });
      if (Array.isArray(test)) {
        t = test.every((item2) => testItem(item2));
      } else {
        t = testItem(test);
      }
    }
    return t;
  });
  return variant;
};
var replace = (str, obj) => {
  str = decodeURIComponent(str);
  return str.replace(/{(.*?)}/g, (match, key) => {
    return obj[key] !== void 0 ? obj[key] : "";
  });
};
var fetchOptions = (url, map) => {
  return fetch(url).then(async (resp) => {
    if (resp.ok) {
      let json = await resp.json();
      json = json.map((item) => {
        return map.reduce((accu, iter) => {
          const [targetKey, key] = iter;
          accu[key] = item[targetKey];
          return accu;
        }, {});
      });
      return json;
    }
  }).catch((err) => {
    console.log(err);
    return [];
  });
};
var reviveData = (data) => {
  try {
    if (!data) {
      return {};
    }
    if (typeof data == "string") {
      return JSON.parse(data);
    }
    return data;
  } catch (err) {
    return {};
  }
};
function Stack(array, callback) {
  const l = array.length;
  let index = 0;
  const cache = [];
  function recurse(callback2, rej, res) {
    if (index < l) {
      const item = array[index];
      callback2(item, index).then((result) => {
        index += 1;
        cache.push(result);
        recurse(callback2, rej, res);
      }).catch((err) => {
        rej(err);
      });
    } else {
      res(cache);
    }
  }
  return new Promise((res, rej) => {
    try {
      recurse(callback, rej, res);
    } catch (err) {
      rej(err);
    }
  });
}

// src/hooks/name.tsx
function useName(value) {
  const v = useSignal2(null);
  useEffect2(() => {
    if (isFalsy(value)) return;
    v.value = value;
  }, [value]);
  return { name: v };
}

// src/hooks/is-view.tsx
import { useSignal as useSignal3 } from "@preact/signals";
import { useEffect as useEffect3 } from "preact/hooks";
function useIsView(value) {
  const v = useSignal3(false);
  useEffect3(() => {
    v.value = value || false;
  }, [value]);
  return { isView: v };
}

// src/hooks/trigger.tsx
import { useEffect as useEffect4 } from "preact/hooks";

// src/signals/index.ts
import { signal } from "@preact/signals";
var submitSignal = signal(null);
var pubSignal = signal({
  value: null,
  name: null,
  event: null
});

// src/hooks/trigger.tsx
function useTrigger(config, name, value) {
  useEffect4(() => {
    if (isFalsy(config)) return;
    if (isFalsy(name)) return;
    if (isFalsy(value)) return;
    if (!config.length) {
      return console.error(`trigger config of ${name} must be an array`);
    }
    config.forEach((event) => {
      pubSignal.value = { value, name, event };
    });
  }, [config, name, value]);
}

// src/hooks/subscribe.tsx
import { useEffect as useEffect5 } from "preact/hooks";
import { useSignal as useSignal4 } from "@preact/signals";

// src/utils/pubsub.ts
var PubSub = class {
  constructor() {
    this.callbacks = {};
  }
  /**
   * 
   * @param key - ensures that the subscriber has a unique handler for the event 
   * @param event - subscriber event
   * @param handler - subscriber handler to event 
   */
  register(key, event, handler) {
    if (!this.callbacks[key]) {
      this.callbacks[key] = {};
    }
    this.callbacks[key][event] = handler;
  }
  /**
   * @param event - event to broadcast
   * @param payload - data to broadcast
   */
  broadcast(event, payload) {
    const callbacks = Object.keys(this.callbacks).reduce((accu, key) => {
      const config = this.callbacks[key];
      if (config[event]) {
        accu.push(config[event]);
      }
      return accu;
    }, []);
    if (callbacks && callbacks.length) {
      callbacks.forEach((callback) => {
        callback(payload);
      });
    }
  }
  clean(id) {
    delete this.callbacks[id];
  }
};
function pubsub() {
  const cacheName = "_pubsub";
  return singleton(cacheName, new PubSub());
}

// src/hooks/subscribe.tsx
function useSubscribe(config, controlName, v) {
  const options = useSignal4(null);
  const isLoading = useSignal4(false);
  const value = useSignal4(null);
  const type = useSignal4(null);
  useEffect5(() => {
    if (isFalsy(config)) return;
    if (isFalsy(controlName)) return;
    if (isLoading.value) return;
    const { name, event } = pubSignal.value;
    config.forEach((subscribe) => {
      const { change, config: config2 } = subscribe;
      type.value = change;
      if (change == "value") {
        const _config = config2;
        const { fields, macro } = _config;
        if (fields) {
          if (macro == "sum") {
            value.value = fields.reduce((accu, field) => {
              if (caches().has(field)) {
                const val = caches().get(field).get("value");
                accu += parseInt(val) || 0;
              }
              return accu;
            }, 0);
          }
        }
      } else if (change == "options") {
        const _config = config2;
        const { options: localOptions, option_api } = _config;
        const value2 = pubSignal.value;
        if (option_api) {
          const { url, cache, map } = option_api;
          if (!url) return;
          const data = {
            value: value2,
            name
          };
          if (cache) {
            cache.forEach((c) => {
              !isFalsy(caches().get(c)) && (data[c] = caches().get(c).get("value"));
            });
          }
          ;
          const replacedUrl = replace(url, data);
          isLoading.value = true;
          fetchOptions(replacedUrl, map).then((res) => {
            isLoading.value = false;
            if (!Array.isArray(res)) throw new Error("Invalid response, options should be an array of ({label:string, value:string})[]");
            options.value = createOptions(res, value2);
          }).catch((err) => isLoading.value = false);
        } else if (localOptions?.length) {
          options.value = createOptions(localOptions, value2);
        }
      }
    });
    return () => {
      config.forEach((subscribe) => {
        pubsub().clean(subscribe.event);
      });
    };
  }, [config, controlName, v, pubSignal.value]);
  return { options, isLoading, value, type };
}

// src/components/input.tsx
import { useEffect as useEffect8, useMemo, useRef } from "preact/hooks";

// src/hooks/cache.tsx
import { useEffect as useEffect6 } from "preact/hooks";
import { useSignal as useSignal5 } from "@preact/signals";
function useCache(cache, name, value, text) {
  const t = useSignal5(/* @__PURE__ */ new Map());
  useEffect6(() => {
    if (isFalsy(cache)) return;
    if (name == null) return;
    const data = /* @__PURE__ */ new Map();
    data.set("name", name);
    data.set("value", value);
    data.set("text", text);
    caches().set(name, data);
    t.value = data;
    return () => {
      t.value = null;
    };
  }, [cache, name, value, text]);
  return { cacheValue: t };
}

// src/hooks/data.tsx
import { useSignal as useSignal6 } from "@preact/signals";
import { useEffect as useEffect7 } from "preact/hooks";
function useData(propsData, def) {
  const data = useSignal6(def || {});
  useEffect7(() => {
    data.value = reviveData(propsData);
  }, [propsData]);
  return { data };
}

// src/components/input.tsx
var Input = (props) => {
  const inputRef = useRef(null);
  const { value } = useValue(props.value);
  const { name } = useName(props.name);
  const { isView } = useIsView(props.is_view);
  const { data } = useData(props.data);
  useTrigger(props?.event?.trigger, name.value, value.value);
  const { cacheValue } = useCache(props.cache, name.value, value.value, name.value);
  const { value: macroValue } = useSubscribe(props?.event?.subscribe, name.value, cacheValue.value);
  useMemo(() => {
    value.value = macroValue.value;
  }, [macroValue.value]);
  const onInput = (e) => value.value = e.currentTarget.value;
  useEffect8(() => {
    const observer = new MutationObserver((mutationList, observer2) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "value") {
            value.value = mutation.target.getAttribute("value");
            observer2.disconnect();
          }
        }
      }
    });
    observer.observe(inputRef.current, {
      attributes: true,
      childList: false,
      subtree: false
    });
    return () => {
      observer.disconnect();
    };
  }, [value.value]);
  useEffect8(() => {
    if (data.value[name.value] == void 0) {
      value.value = null;
    } else {
      value.value = data.value[name.value];
    }
  }, [data.value, name.value]);
  return /* @__PURE__ */ h("div", { class: "form-group" }, props.label && /* @__PURE__ */ h("label", { class: "form-label", for: name.value }, props.label), /* @__PURE__ */ h(
    "input",
    {
      ref: inputRef,
      "data-name": name.value,
      "data-tag": props.tag,
      onInput,
      value: value.value,
      class: "form-control",
      type: props.type,
      placeholder: props.placeholder || "",
      id: name.value,
      ...isView.value ? {} : { name: name.value },
      ...props.readonly || isView.value ? { readonly: true } : {},
      ...props.disabled ? { disabled: true } : {},
      ...props.validator ? { "data-validator": props.validator } : {}
    }
  ));
};
var input_default = Input;

// src/components/textarea.tsx
import { h as h2 } from "preact";
function Textarea(props) {
  const { isView } = useIsView(props.is_view);
  const { value } = useValue(props.value);
  const { name } = useName(props.name);
  const onInput = (e) => value.value = e.currentTarget.value;
  return /* @__PURE__ */ h2("div", { class: "form-group" }, /* @__PURE__ */ h2("label", { for: props.name, class: "form-label " }, props.display), /* @__PURE__ */ h2(
    "textarea",
    {
      onInput,
      "data-tag": props.tag,
      class: "form-control",
      id: name.value,
      placeholder: props.placeholder || "",
      value: value.value,
      ...isView.value ? { "data-name": name.value } : { name: name.value },
      ...props.readonly || isView.value ? { readonly: true } : {},
      ...props.disabled ? { disabled: true } : {},
      ...props.validator ? { "data-validator": props.validator } : {},
      style: {
        ...mergeTo(props.height, {
          height: props.height
        })
      }
    }
  ));
}

// src/components/label.tsx
import { h as h3 } from "preact";
function Label(props) {
  return /* @__PURE__ */ h3("label", { class: "form-label", for: props.name }, props.label);
}

// src/components/select.tsx
import { useSignal as useSignal10 } from "@preact/signals";
import { h as h5 } from "preact";
import { useEffect as useEffect12, useMemo as useMemo4, useRef as useRef2 } from "preact/hooks";

// src/hooks/options-api.tsx
import { useSignal as useSignal7 } from "@preact/signals";
import { useEffect as useEffect9 } from "preact/hooks";
function useRemoteOptions(config, selectedValue, name, isChanged) {
  const options = useSignal7(null);
  const isLoading = useSignal7(false);
  useEffect9(() => {
    if (isChanged) return;
    if (isFalsy(config)) return;
    if (isFalsy(config?.url)) return;
    if (!config?.url) return;
    if (isLoading.value) return;
    if (!name) return;
    isLoading.value = true;
    const { url, map, cache } = config;
    const data = { [name]: selectedValue, value: selectedValue };
    name && (data.name = name);
    if (cache) {
      cache.forEach((c) => {
        !isFalsy(caches().get(c)) && (data[c] = caches().get(c).get("value"));
      });
    }
    ;
    const replacedUrl = replace(url, data);
    fetchOptions(replacedUrl, map).then((res) => {
      isLoading.value = false;
      if (!Array.isArray(res)) throw new Error("Invalid response, options should be an array of ({label:string, value:string})[]");
      options.value = createOptions(res, selectedValue);
    }).catch((err) => isLoading.value = false);
  }, [config, selectedValue, isChanged, name]);
  return { options, isLoading };
}

// src/hooks/options.tsx
import { useSignal as useSignal8 } from "@preact/signals";
import { useEffect as useEffect10 } from "preact/hooks";
function useLocalOptions(opts, selectedValue, isChanged) {
  const options = useSignal8(null);
  useEffect10(() => {
    if (isChanged) return;
    if (!opts?.length) return;
    options.value = createOptions(opts, selectedValue);
  }, [opts, selectedValue, isChanged]);
  return { options };
}

// src/hooks/variants.tsx
import { useSignal as useSignal9 } from "@preact/signals";
import { useEffect as useEffect11 } from "preact/hooks";
function useVariants(config, name, value, text, initialData) {
  const controls2 = useSignal9([]);
  const data = useSignal9({});
  const isLoading = useSignal9(false);
  useEffect11(() => {
    if (!config) return;
    if (!name) return;
    if (isLoading.value) return;
    ;
    (async () => {
      const selected = getVariant(config, { name, value, text });
      let currentData = { value, name, text, [name]: value };
      if (!selected.length) {
        controls2.value = [];
        data.value = {};
        return;
      }
      ;
      const reviveInitialData = reviveData(initialData);
      let updateData = { ...reviveInitialData, ...data.value };
      isLoading.value = true;
      const dataConfigs = selected.map(({ fn }) => fn?.data || []);
      const remoteDataConfigs = dataConfigs.filter(({ type }) => type == "api");
      const localDataConfigs = dataConfigs.filter(({ type }) => type == "local" || type != "api");
      localDataConfigs.length && localDataConfigs.forEach(({ data: localData }) => {
        updateData = { ...updateData, ...localData };
      });
      await Stack(remoteDataConfigs, async ({ url }) => {
        const replacedUrl = replace(url, currentData);
        if (!replacedUrl) return;
        return fetch(replacedUrl).then((res) => res.ok && res.json()).then((remoteData) => {
          if (!remoteData) return;
          if (remoteData.constructor !== Object) return;
          updateData = { ...updateData, ...remoteData };
        }).catch((err) => {
          console.log(err);
        });
      });
      const selectedControls = selected.reduce((accu, item) => {
        if (!item?.controls) return accu;
        if (!Array.isArray(item.controls)) return accu;
        return accu.concat(item.controls);
      }, []);
      controls2.value = restructureControls(selectedControls, data.value);
      data.value = updateData;
      isLoading.value = false;
    })();
  }, [config, name, value, initialData]);
  return {
    data,
    controls: controls2,
    isLoading
  };
}

// src/components/visibile.tsx
import { useMemo as useMemo2 } from "preact/hooks";
function Visible({ children, when }) {
  const isVisible = useMemo2(() => !isFalsy(when), [when]);
  return isVisible ? children : null;
}

// src/components/control-loader.tsx
import { h as h4 } from "preact";
import { useMemo as useMemo3 } from "preact/hooks";
function ControlLoader({ children, when }) {
  const isLoading = useMemo3(() => !isFalsy(when), [when]);
  return /* @__PURE__ */ h4("div", { style: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "1fr max-content",
    alignContent: "center",
    alignItems: "center",
    gridGap: "4px"
  } }, children, /* @__PURE__ */ h4(Visible, { when: isLoading }, /* @__PURE__ */ h4("div", null, /* @__PURE__ */ h4("div", { class: "spinner-border text-secondary spinner-border-sm", role: "status" }, /* @__PURE__ */ h4("span", { class: "visually-hidden" })))));
}

// src/components/select.tsx
function Select(props) {
  const { isView } = useIsView(props.is_view);
  const options = useSignal10([]);
  const { value: selectedValue } = useValue(props.value);
  const { value: placeholder } = useValue(props.placeholder);
  const { value: name } = useValue(props.name);
  const selectedText = useSignal10(null);
  const variants = useSignal10([]);
  const controlRef = useRef2(null);
  const isLoading = useSignal10(false);
  const isChanged = useSignal10(false);
  const { data } = useData(props.data);
  const { options: remoteOptions, isLoading: isRemoteOptionsLoading } = useRemoteOptions(props.option_api, selectedValue.value, name.value, isChanged.value);
  const { options: localOptions } = useLocalOptions(props.options, selectedValue.value, isChanged.value);
  const { options: subscribeOptions, isLoading: isSubscribeOptionsLoading } = useSubscribe(props?.event?.subscribe, name.value);
  const { controls: variantControls, data: variantData, isLoading: isVariantLoading } = useVariants(props.variants, name.value, selectedValue.value, selectedText.value, props.data);
  useMemo4(() => {
    if (isView.value) throw new Error(`Select component is not allowed in view mode`);
  }, [isView.value]);
  useMemo4(() => {
    const opts = subscribeOptions.value || remoteOptions.value || localOptions.value || [];
    if (placeholder.value) {
      opts.unshift({ label: placeholder, value: null });
    }
    options.value = opts;
  }, [remoteOptions.value, localOptions.value, subscribeOptions.value]);
  useMemo4(() => {
    isLoading.value = isRemoteOptionsLoading.value || isSubscribeOptionsLoading.value || isVariantLoading.value;
  }, [
    isRemoteOptionsLoading.value,
    isSubscribeOptionsLoading.value,
    isVariantLoading.value
  ]);
  useMemo4(() => {
    data.value = { ...data.value, ...variantData.value };
    variants.value = variantControls.value;
  }, [variantControls.value, variantData.value]);
  useTrigger(props?.event?.trigger, name.value, selectedValue.value);
  useCache(props.cache, name.value, selectedValue.value, selectedText.value);
  useEffect12(() => {
    if (data.value[name.value] == void 0) {
      selectedValue.value = null;
    } else {
      selectedValue.value = data.value[name.value];
    }
  }, [data.value, name.value]);
  const changeHandler = async (e) => {
    const target = e.target;
    if (!target) return;
    isChanged.value = true;
    selectedValue.value = target.value;
    selectedText.value = Array.from(target.selectedOptions).reduce((accu, iter, index) => accu + iter.text + (target.selectedOptions.length - 1 == index ? "" : ","), "");
  };
  return /* @__PURE__ */ h5(
    "div",
    {
      class: `form-group control-select ${props.help ? "has-help" : ""} mb-3`,
      style: { width: props.width }
    },
    /* @__PURE__ */ h5("label", { for: name.value, class: "form-label fs-12 roboto-regular" }, props.label),
    /* @__PURE__ */ h5(ControlLoader, { when: isLoading.value }, /* @__PURE__ */ h5(
      "select",
      {
        ref: controlRef,
        "data-tag": props.tag,
        value: selectedValue.value,
        onChange: changeHandler,
        class: "form-select form-control",
        "aria-label": "Default select example",
        "data-name": name.value,
        ...props.validator ? { "data-validator": props.validator } : {},
        ...props.readonly ? { disabled: true } : {}
      },
      options.value.map((item, index) => {
        if (item.selected) {
          return /* @__PURE__ */ h5("option", { key: item.id, value: item.value, selected: true }, item.label);
        }
        return /* @__PURE__ */ h5("option", { key: item.id, value: item.value }, item.label);
      })
    )),
    /* @__PURE__ */ h5(
      "input",
      {
        type: "hidden",
        id: name.value,
        name: name.value,
        value: selectedValue.value
      }
    ),
    /* @__PURE__ */ h5(Visible, { when: variants.value.length }, /* @__PURE__ */ h5(
      FormControl,
      {
        controls: variants.value,
        data: data.value
      }
    ))
  );
}

// src/components/data-list.tsx
import { useSignal as useSignal11 } from "@preact/signals";
import { h as h6 } from "preact";
import { useEffect as useEffect13, useMemo as useMemo5 } from "preact/hooks";
function DataList(props) {
  const { isView } = useIsView(props.is_view);
  const options = useSignal11([]);
  const { value } = useValue(props.value);
  const { value: name } = useValue(props.name);
  const variants = useSignal11([]);
  const isLoading = useSignal11(false);
  const isChanged = useSignal11(false);
  const { data } = useData(props.data);
  const { options: remoteOptions, isLoading: isRemoteOptionsLoading } = useRemoteOptions(props.option_api, value.value, name.value, isChanged.value);
  const { options: localOptions } = useLocalOptions(props.options, value.value, isChanged.value);
  const { options: subscribeOptions, isLoading: isSubscribeOptionsLoading, value: macroValue } = useSubscribe(props?.event?.subscribe, name.value);
  const { controls: variantControls, data: variantData, isLoading: isVariantLoading } = useVariants(props.variants, name.value, value.value, value.value, props.data);
  useMemo5(() => {
    if (isView.value) throw new Error(`Select component is not allowed in view mode`);
  }, [isView.value]);
  useMemo5(() => {
    options.value = subscribeOptions.value || remoteOptions.value || localOptions.value || [];
  }, [remoteOptions.value, localOptions.value, subscribeOptions.value]);
  useMemo5(() => {
    isLoading.value = isRemoteOptionsLoading.value || isSubscribeOptionsLoading.value || isVariantLoading.value;
  }, [
    isRemoteOptionsLoading.value,
    isSubscribeOptionsLoading.value,
    isVariantLoading.value
  ]);
  useMemo5(() => {
    data.value = { ...data.value, ...variantData.value };
    variants.value = variantControls.value;
  }, [variantControls.value, variantData.value]);
  useTrigger(props?.event?.trigger, name.value, value.value);
  useEffect13(() => {
    if (data.value[name.value] == void 0) return;
    value.value = data.value[name.value];
  }, [data.value, name.value]);
  useEffect13(() => {
    if (props.readonly == true) {
      throw new Error("datalist cannot be readonly, use input instead");
    }
  }, []);
  const changeHandler = async (e) => {
    const target = e.target;
    if (!target) return;
    isChanged.value = true;
    value.value = target.value;
  };
  return /* @__PURE__ */ h6(
    "div",
    {
      class: `form-group  ${props.help ? "has-help" : ""} mb-3`,
      style: { width: props.width }
    },
    /* @__PURE__ */ h6("label", { for: name.value, class: "form-label fs-12 roboto-regular" }, props.label),
    /* @__PURE__ */ h6(ControlLoader, { when: isLoading.value }, /* @__PURE__ */ h6(
      "input",
      {
        "data-tag": props.tag,
        class: "form-control",
        id: name.value,
        name: name.value,
        placeholder: props.placeholder || "",
        value: value.value,
        list: `${name.value}s`,
        ...props.validator ? { "data-validator": props.validator } : {},
        onChange: changeHandler
      }
    ), /* @__PURE__ */ h6("datalist", { id: `${name.value}s` }, options.value.map((item) => /* @__PURE__ */ h6(
      "option",
      {
        value: item.value,
        key: String(item.value).split(" ").join("")
      }
    )))),
    /* @__PURE__ */ h6(Visible, { when: variants.value.length }, /* @__PURE__ */ h6(
      FormControl,
      {
        controls: variants.value,
        data: data.value
      }
    ))
  );
}

// src/components/checkbox-group.tsx
import { h as h7 } from "preact";
import { useSignal as useSignal12 } from "@preact/signals";
function CheckboxGroup(props) {
  const variants = useSignal12({});
  const changeHandler = (e) => {
    const value = getControlValue(e.target);
    const id = String(e.target.value).toLowerCase().replaceAll(" ", "-");
    if (!value) {
      variants[id] = [];
      return;
    }
    const variantConfig = props.variants.find(
      (item) => item.ref_name == e.target.name
    );
    variants[id] = restructureControls(variantConfig?.controls?.data || []);
  };
  return /* @__PURE__ */ h7("div", { class: "checkbox-group-container" }, /* @__PURE__ */ h7("label", { class: "" }, props.label), props.options.map((item) => {
    const id = String(item.value).toLowerCase().replaceAll(" ", "-");
    return /* @__PURE__ */ h7("div", { class: "checkbox-group-item form-group" }, /* @__PURE__ */ h7("div", { class: "form-check form-switch" }, /* @__PURE__ */ h7(
      "input",
      {
        "data-tag": props.tag,
        onChange: changeHandler,
        type: "checkbox",
        value: item.value,
        id,
        name: props.name,
        class: "form-check-input"
      }
    ), /* @__PURE__ */ h7("label", { for: id, class: "form-check-label" }, item.label)), /* @__PURE__ */ h7(Visible, { when: (variants[id] || []).length }, /* @__PURE__ */ h7(FormControl, { controls: variants[id] })));
  }));
}

// src/components/radio-group.tsx
import { h as h8 } from "preact";
import { useSignal as useSignal13 } from "@preact/signals";
function RadioGroup(props) {
  const currentId = useSignal13(null);
  const variants = useSignal13({});
  const orientation = useSignal13(props.orientation || "vertical");
  const options = useSignal13(props.options || []);
  const changeHandler = (e) => {
    const value = getControlValue(e.target);
    const key = `${e.target.name} - ${value}`;
    const id = String(e.target.value).toLowerCase().replaceAll(" ", "-");
    const variantConfig = props.variants.find((item) => {
      return item.ref_name == key;
    });
    if (!variantConfig) {
      return;
    }
    variants[currentId.value] = [];
    currentId.value = id;
    const controls2 = restructureControls(variantConfig?.controls || []);
    options.value = options.value.map((item) => {
      if (item.value == value) {
        item.controls = controls2;
      } else {
        item.controls = [];
      }
      return item;
    });
  };
  return /* @__PURE__ */ h8("div", { class: "radio-container form-group", style: { width: props.width } }, /* @__PURE__ */ h8("label", null, props.label), /* @__PURE__ */ h8("div", { class: `radio-item-container ${orientation.value}` }, options.value.map((item) => {
    const id = String(item.value).toLowerCase().replaceAll(" ", "-");
    return /* @__PURE__ */ h8("div", { class: "radio-item form-group" }, /* @__PURE__ */ h8("div", null, /* @__PURE__ */ h8(
      "input",
      {
        type: "radio",
        value: item.value,
        id,
        ...props["data-name"] ? { "data-name": props["data-name"] } : { name: props.name },
        onChange: changeHandler,
        "data-tag": props.tag
      }
    ), /* @__PURE__ */ h8("label", { for: id }, item.label)), /* @__PURE__ */ h8(Visible, { when: item?.controls?.length }, /* @__PURE__ */ h8(FormControl, { controls: item.controls, data: props.data })));
  })));
}

// src/components/repeatable.tsx
import { h as h9, Fragment as Fragment3 } from "preact";
import { useEffect as useEffect14, useRef as useRef4 } from "preact/hooks";
import { useSignal as useSignal14 } from "@preact/signals";
function Repeatable(props) {
  const uniqueId = useSignal14(generateUniqueId());
  const datas = useSignal14([]);
  const viewDatas = useSignal14([]);
  const formRef = useRef4(null);
  const formControls = useSignal14(props?.children || []);
  useEffect14(() => {
    const values = (props?.data || {})[props.name];
    if (values?.length) {
      viewDatas.value = values.map((value) => restructureControls(value));
      console.log("repeatable receives values");
    }
  }, [props.data]);
  useEffect14(() => {
    if (!submitSignal?.value?.id) {
      return;
    }
    const target = document.getElementById(submitSignal?.value?.id);
    if (!target) {
      return;
    }
    const container = target.closest(".repeatable-content");
    if (!container) {
      return;
    }
    const repeatableTarget = container.querySelectorAll(
      "[data-type=repeatable]"
    );
    Array.from(repeatableTarget).forEach((form) => {
      if (form.name != submitSignal.value.id && uniqueId.value != submitSignal.value.id) {
        datas.value = [];
      }
    });
  }, [submitSignal.value]);
  const deleteHandler = (e) => {
    const target = e.target;
    const key = target.dataset.key;
    const id = target.dataset.id;
    datas.value = datas.value.reduce((accu, item, index) => {
      if (id != index) {
        accu.push(item);
      }
      return accu;
    }, []);
    viewDatas.value = datas.value;
  };
  const addHandler = (e) => {
    e.preventDefault();
    const data = getFormData(formRef.current, {
      key: "data-name"
    });
    const reConstructControls = restructureControls(formControls.value);
    const controls2 = Object.keys(data).reduce((accu, key) => {
      let value = data[key];
      try {
        value = JSON.parse(value);
      } catch (err) {
      }
      accu[key] = value;
      return accu;
    }, {});
    datas.value = [...datas.value, controls2];
    viewDatas.value = datas.value.map((item) => {
      const controls3 = [];
      reConstructControls.forEach((control) => {
        controls3.push({
          ...control,
          value: item[control.name]
        });
      });
      return controls3;
    });
    formRef.current.reset();
    submitSignal.value = { id: uniqueId.value };
  };
  return /* @__PURE__ */ h9("div", { class: "repeatable-container card my-3" }, /* @__PURE__ */ h9("div", { class: "repeatable-content card-body" }, /* @__PURE__ */ h9("fieldset", null, /* @__PURE__ */ h9("legend", null, props.label), viewDatas.value.map((item, index) => {
    const value = item.reduce((accu, iter) => {
      accu[iter.name] = iter.value;
      return accu;
    }, {});
    console.log("rendering datas.value");
    return /* @__PURE__ */ h9("details", null, /* @__PURE__ */ h9("summary", null, `${props.label} - ${index + 1}`), /* @__PURE__ */ h9("div", null, /* @__PURE__ */ h9(
      FormControl,
      {
        controls: item,
        data: value,
        key: `values-${generateUniqueId()}`,
        is_from_repeatable: true,
        is_view: true
      }
    ), /* @__PURE__ */ h9("br", null), /* @__PURE__ */ h9(
      "button",
      {
        type: "button",
        onClick: deleteHandler,
        "data-id": index,
        class: "btn btn-danger"
      },
      "Remove"
    ), /* @__PURE__ */ h9("div", { style: "height:50px" })));
  }), !props.is_view && /* @__PURE__ */ h9("details", null, /* @__PURE__ */ h9("summary", null, props.label, " Form"), /* @__PURE__ */ h9(
    "form",
    {
      onSubmit: addHandler,
      ref: formRef,
      name: uniqueId.value,
      id: uniqueId.value,
      "data-type": "repeatable"
    },
    /* @__PURE__ */ h9(
      FormControl,
      {
        controls: formControls.value,
        key: "form-values",
        is_from_repeatable: true
      }
    ),
    /* @__PURE__ */ h9("br", null),
    /* @__PURE__ */ h9("button", { type: "reset", class: "btn btn-warning" }, "Reset"),
    "\xA0",
    /* @__PURE__ */ h9("button", { type: "submit", class: "btn btn-success" }, "Submit")
  ), /* @__PURE__ */ h9(
    "input",
    {
      type: "hidden",
      id: props.name,
      ...props.is_from_repeatable ? { "data-name": props.name } : { name: props.name },
      value: JSON.stringify(datas.value),
      "data-tag": props.tag
    }
  )), props.is_view && !viewDatas.value.length ? /* @__PURE__ */ h9("details", null, /* @__PURE__ */ h9("summary", null, "empty")) : /* @__PURE__ */ h9(Fragment3, null))));
}

// src/components/input-check.tsx
import { useSignal as useSignal15 } from "@preact/signals";
import { h as h10, Fragment as Fragment4 } from "preact";
import { useMemo as useMemo6, useRef as useRef5 } from "preact/hooks";
var InputCheck = (props) => {
  const { isView } = useIsView(props.is_view);
  const value = useSignal15(false);
  const inputRef = useRef5(null);
  const { data } = useData(props.data);
  const { name } = useName(props.name);
  const variants = useSignal15([]);
  useMemo6(() => {
    if (!(props.value == true || props.value == false)) return;
    value.value = props.value;
  }, [props.value]);
  const { controls: variantControls, data: variantData } = useVariants(props.variants, props.name, value.value, value.value, props.data);
  useMemo6(() => {
    data.value = variantData.value;
    variants.value = variantControls.value;
  }, [variantControls.value, variantData.value]);
  const onInput = (e) => {
    const checked = e.currentTarget.checked;
    value.value = checked;
  };
  return /* @__PURE__ */ h10("div", { class: " my-3" }, /* @__PURE__ */ h10("div", { class: "form-check" }, /* @__PURE__ */ h10(
    "input",
    {
      ref: inputRef,
      "data-tag": props.tag,
      onInput,
      class: "form-check-input",
      type: "checkbox",
      id: name.value,
      placeholder: props.placeholder || "",
      ...isView.value ? { "data-name": name.value } : { name: name.value },
      ...props.readonly || isView.value ? { readonly: true } : {},
      ...props.disabled ? { disabled: true } : {},
      ...props.validator ? { "data-validator": props.validator } : {}
    }
  ), props.label && /* @__PURE__ */ h10(Fragment4, null, "\xA0", /* @__PURE__ */ h10("label", { class: "form-check-label", for: name.value }, props.label))), /* @__PURE__ */ h10(Visible, { when: variants.value.length }, /* @__PURE__ */ h10(
    FormControl,
    {
      controls: variantControls.value,
      data: props.data
    }
  )));
};
var input_check_default = InputCheck;

// src/components/form-group.tsx
import { h as h11, Fragment as Fragment5 } from "preact";
function FormGroup(props) {
  return /* @__PURE__ */ h11(
    "div",
    {
      class: `
        form-control-item form-col-${props.col || 1}} 
        ${props.classes ?? ""} 
      `
    },
    props.label ? /* @__PURE__ */ h11("p", { class: "" }, props.label) : /* @__PURE__ */ h11(Fragment5, null),
    /* @__PURE__ */ h11("div", { class: "form-group-controls" }, props.children)
  );
}

// src/components/form-control.tsx
import { useEffect as useEffect18 } from "preact/hooks";

// src/components/row.tsx
import { h as h12, Fragment as Fragment6 } from "preact";
import { useEffect as useEffect15, useMemo as useMemo7, useRef as useRef6 } from "preact/hooks";
import { useSignal as useSignal16 } from "@preact/signals";
function Row(props) {
  const responsive = useMemo7(() => {
    return props.responsive;
  }, [props.responsive]);
  const id = useSignal16(window.crypto.randomUUID());
  const containerRef = useRef6(null);
  const prevBreak = useSignal16("");
  const hasBreak = useSignal16(false);
  const applyBreaks = (target, breaks, windowWidth) => {
    if (!target) return;
    const w = selectSize(breaks, windowWidth);
    let current = `form-cols-${w}`;
    if (prevBreak.value != current) {
      prevBreak.value && target.classList.remove(prevBreak.value);
      target.classList.add(current);
      prevBreak.value = current;
    } else {
      if (!target.classList.contains(current)) {
        target.classList.add(current);
      }
    }
    ;
  };
  useEffect15(() => {
    if (responsive && containerRef.current) {
      const windowWidth = getWindowWidth();
      const { breaks, width } = responsive;
      if (breaks) {
        hasBreak.value = true;
        applyBreaks(containerRef.current, breaks, windowWidth);
        pubsub().register(id.value, "def", ({ windowWidth: windowWidth2 }) => {
          applyBreaks(containerRef.current, breaks, windowWidth2);
        });
      }
    }
    return () => {
      pubsub().clean(id.value);
    };
  }, []);
  return /* @__PURE__ */ h12(
    "div",
    {
      class: `
        form-row
        ${props.classes ?? ""} 
      `,
      ref: containerRef
    },
    props.label ? /* @__PURE__ */ h12("p", { class: "" }, props.label) : /* @__PURE__ */ h12(Fragment6, null),
    /* @__PURE__ */ h12("div", { class: "form-cols" }, props.children)
  );
}

// src/components/col.tsx
import { h as h13, Fragment as Fragment7 } from "preact";
import { useEffect as useEffect16, useMemo as useMemo8, useRef as useRef7 } from "preact/hooks";
import { useSignal as useSignal17 } from "@preact/signals";
function Col(props) {
  const responsive = useMemo8(() => {
    return props.responsive;
  }, [props.responsive]);
  const id = useSignal17(window.crypto.randomUUID());
  const containerRef = useRef7(null);
  const prevWidth = useSignal17("");
  const applyWidth = (target, widths, windowWidth) => {
    if (!target) return;
    const w = selectSize(widths, windowWidth);
    if (prevWidth.value != w) {
      target.style.width = w;
      prevWidth.value = w;
    } else {
      if (!target.classList.contains(w)) {
        target.style.width = w;
      }
    }
    ;
  };
  useEffect16(() => {
    if (responsive && containerRef.current) {
      const windowWidth = getWindowWidth();
      const { breaks, width } = responsive;
      if (width) {
        applyWidth(containerRef.current, width, windowWidth);
        pubsub().register(id.value, "def", ({ windowWidth: windowWidth2 }) => {
          applyWidth(containerRef.current, width, windowWidth2);
        });
      }
    }
    return () => {
      pubsub().clean(id.value);
    };
  }, []);
  return /* @__PURE__ */ h13(
    "div",
    {
      class: `
        form-col form-col-${props.col || 1} 
        ${props.classes ?? ""} 
      `,
      ref: containerRef
    },
    props.label ? /* @__PURE__ */ h13("p", { class: "" }, props.label) : /* @__PURE__ */ h13(Fragment7, null),
    /* @__PURE__ */ h13("div", { class: "form-col-item" }, props.children)
  );
}

// src/hooks/controls.tsx
import { useSignal as useSignal18 } from "@preact/signals";
import { useEffect as useEffect17 } from "preact/hooks";
function useControls(controls2, data) {
  const { data: controlsData } = useData(controls2, []);
  const ctrls = useSignal18([]);
  useEffect17(() => {
    if (isFalsy(controlsData.value?.length)) return;
    ctrls.value = restructureControls(controlsData, data).map(
      (control) => {
        if (["group", "row", "col"].includes(control.tag)) {
          const controls3 = restructureControls(
            control.children.map((item) => {
              return item;
            }),
            data
          );
          return {
            control,
            child: controls3
          };
        } else {
          return { control };
        }
      }
    );
  }, [controlsData.value, data]);
  return {
    controls: ctrls
  };
}

// src/utils/instance.ts
var InstanceCount = class {
  constructor() {
    this._count = 0;
  }
  get count() {
    return this._count;
  }
  increment() {
    this._count += 1;
  }
  decrement() {
    this._count -= 1;
  }
};
function instanceCount() {
  const instanceCountName = "_instanceCount";
  return singleton(instanceCountName, new InstanceCount());
}

// src/components/form-control.tsx
function FormControl(props) {
  const { data } = useData(props.data);
  const { controls: controls2 } = useControls(props.controls, data.value);
  useEffect18(() => {
    instanceCount().increment();
    return () => {
      if (instanceCount().count > 0) {
        instanceCount().decrement();
      }
      caches().clear();
    };
  }, []);
  return /* @__PURE__ */ h14(Fragment8, null, controls2.value.map((ctrl) => {
    let { control, child, id } = ctrl;
    if (control.tag == "group") {
      return /* @__PURE__ */ h14(
        FormGroup,
        {
          key: id,
          col: child.length,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        },
        /* @__PURE__ */ h14(
          FormControl,
          {
            controls: child,
            data: data.value,
            is_from_repeatable: props.is_from_repeatable,
            is_view: props.is_view
          }
        )
      );
    } else if (control.tag == "row") {
      return /* @__PURE__ */ h14(
        Row,
        {
          key: id,
          col: child.length,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        },
        /* @__PURE__ */ h14(
          FormControl,
          {
            controls: child,
            data: data.value,
            is_from_repeatable: props.is_from_repeatable,
            is_view: props.is_view
          }
        )
      );
    } else if (control.tag == "col") {
      return /* @__PURE__ */ h14(
        Col,
        {
          key: id,
          ...control
        },
        /* @__PURE__ */ h14(
          FormControl,
          {
            controls: child,
            data: data.value,
            is_from_repeatable: props.is_from_repeatable,
            is_view: props.is_view
          }
        )
      );
    } else if (["input", "mobile", "input-inline"].includes(control.tag)) {
      return /* @__PURE__ */ h14(
        input_default,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "check") {
      return /* @__PURE__ */ h14(
        input_check_default,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "textarea") {
      return /* @__PURE__ */ h14(
        Textarea,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "label") {
      return /* @__PURE__ */ h14(Label, { key: id, label: control.label, name: control.name });
    } else if (["select", "select-inline"].includes(control.tag)) {
      return /* @__PURE__ */ h14(
        Select,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "datalist") {
      return /* @__PURE__ */ h14(
        DataList,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "checkbox") {
      return /* @__PURE__ */ h14(
        CheckboxGroup,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "radio") {
      return /* @__PURE__ */ h14(
        RadioGroup,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else if (control.tag == "repeatable") {
      return /* @__PURE__ */ h14(
        Repeatable,
        {
          key: id,
          data: data.value,
          is_view: props.is_view,
          is_from_repeatable: props.is_from_repeatable,
          ...control
        }
      );
    } else {
      return /* @__PURE__ */ h14(Fragment8, null);
    }
  }));
}

// src/components/form.tsx
import { h as h15 } from "preact";
import { useMemo as useMemo9 } from "preact/hooks";
var controlInputKey = {
  id: 1,
  tag: "input",
  label: "Key",
  properties: [
    {
      key: "type",
      value: "text"
    },
    {
      key: "placeholder",
      value: "key"
    },
    {
      key: "name",
      value: "key"
    }
  ]
};
var controlInputValue = {
  id: 1,
  tag: "input",
  label: "Value",
  properties: [
    {
      key: "type",
      value: "value"
    },
    {
      key: "placeholder",
      value: "value"
    },
    {
      key: "name",
      value: "value"
    }
  ]
};
var controlOptionApi = {
  id: 1,
  tag: "input",
  label: "Option API",
  properties: [
    {
      key: "type",
      value: "text"
    },
    {
      key: "name",
      value: "option_api"
    },
    {
      key: "placeholder",
      value: "option api"
    }
  ]
};
var controlOptionDefault = {
  id: 1,
  tag: "repeatable",
  label: "Options",
  properties: [
    {
      key: "type",
      value: "text"
    },
    {
      key: "name",
      value: "options"
    },
    {
      key: "placeholder",
      value: "options"
    }
  ],
  children: [
    {
      id: 1,
      tag: "input",
      label: "Label",
      properties: [
        {
          key: "type",
          value: "text"
        },
        {
          key: "name",
          value: "label"
        },
        {
          key: "placeholder",
          value: "label"
        }
      ]
    },
    {
      id: 1,
      tag: "input",
      label: "Value",
      properties: [
        {
          key: "type",
          value: "text"
        },
        {
          key: "name",
          value: "value"
        },
        {
          key: "placeholder",
          value: "value"
        }
      ]
    },
    {
      id: 1,
      tag: "check",
      label: "Is Selected",
      properties: [
        {
          key: "type",
          value: "checkbox"
        },
        {
          key: "name",
          value: "selected"
        }
      ]
    }
  ]
};
var selectOptionType = {
  id: 1,
  tag: "select",
  label: "Option Type",
  properties: [
    {
      key: "name",
      value: "option_type"
    }
  ],
  options: [
    {
      id: 1,
      label: "Default",
      value: "default"
    },
    {
      id: 1,
      label: "Api",
      value: "api"
    }
  ],
  variants: [
    {
      check_fn_str: "function (value){return value == 'default'}",
      ref_name: "option_type - default",
      controls: [controlOptionDefault]
    },
    {
      ref_name: "option_type - api",
      controls: [controlOptionApi]
    }
  ]
};
var orientationOption = {
  id: 4,
  tag: "select",
  label: "Orientation",
  properties: [
    {
      key: "type",
      value: "text"
    },
    {
      key: "name",
      value: "orientation"
    }
  ],
  options: [
    {
      id: 1,
      label: "Portrait",
      value: "portrait"
    },
    {
      id: 2,
      label: "Lanscape",
      value: "landscape"
    }
  ]
};
var controls = [
  {
    id: 1,
    tag: "select",
    label: "Tag",
    properties: [
      {
        key: "type",
        value: "text"
      },
      {
        key: "name",
        value: "tag"
      }
    ],
    options: [
      {
        id: 1,
        label: "Select",
        value: "select"
      },
      {
        id: 2,
        label: "Input",
        value: "input"
      },
      {
        id: 3,
        label: "Checkbox",
        value: "checkbox"
      },
      {
        id: 4,
        label: "Radio",
        value: "radio"
      },
      {
        id: 5,
        label: "Datalist",
        value: "datalist"
      },
      {
        id: 6,
        label: "Textarea",
        value: "textarea"
      },
      {
        id: 7,
        label: "Label",
        value: "label"
      },
      {
        id: 8,
        label: "Repeatable",
        value: "repeatable"
      },
      {
        id: 9,
        label: "Group",
        value: "group"
      },
      {
        id: 10,
        label: "Check",
        value: "check"
      }
    ],
    variants: [
      {
        check_fn_str: "function (value){return value == 'select'}",
        ref_name: "tag - select",
        controls: [selectOptionType]
      },
      {
        check_fn_str: "function (value){return ['checkbox','radio','group'].includes(value)}",
        ref_name: "tag - radio",
        controls: [orientationOption]
      }
    ]
  },
  {
    id: 2,
    tag: "input",
    label: "Label",
    properties: [
      {
        key: "placeholder",
        value: "label"
      },
      {
        key: "type",
        value: "text"
      },
      {
        key: "name",
        value: "label"
      }
    ]
  },
  {
    id: 3,
    tag: "repeatable",
    label: "Properties",
    properties: [
      {
        key: "type",
        value: "text"
      },
      {
        key: "name",
        value: "properties"
      }
    ],
    children: [controlInputKey, controlInputValue]
  }
];
var variantControl = {
  id: 3,
  tag: "repeatable",
  label: "Variants",
  properties: [
    {
      key: "type",
      value: "text"
    },
    {
      key: "name",
      value: "variants"
    }
  ],
  children: [
    {
      id: 1,
      tag: "input",
      label: "Check Function",
      properties: [
        {
          key: "type",
          value: "text"
        },
        {
          key: "placeholder",
          value: "check function"
        },
        {
          key: "name",
          value: "check_fn_str"
        }
      ]
    },
    {
      id: 1,
      tag: "input",
      label: "Ref Name",
      properties: [
        {
          key: "type",
          value: "text"
        },
        {
          key: "placeholder",
          value: "ref name"
        },
        {
          key: "name",
          value: "ref_name"
        }
      ]
    },
    {
      id: 3,
      tag: "repeatable",
      label: "Controls",
      properties: [
        {
          key: "type",
          value: "text"
        },
        {
          key: "name",
          value: "controls"
        }
      ],
      children: controls
    }
  ]
};
var allControls = [...controls, variantControl];
function Form(props) {
  const formControls = useMemo9(() => {
    return allControls;
  }, [props.data]);
  return /* @__PURE__ */ h15("form", null, /* @__PURE__ */ h15(FormControl, { controls: formControls, data: props.data }), /* @__PURE__ */ h15("button", { type: "submit", class: "btn btn-success" }, "Submit"));
}

// src/const/index.ts
var FORM_CHANGE_EVENT = "form-value-change";

// src/object/register-custom.ts
function registerCustomElement() {
  register(FormControl, "x-form-control", ["controls", "data"]);
  register(Form, "x-form", ["data"]);
  window.addEventListener("resize", (e) => {
    console.log("instanceCount.value", instanceCount().count);
    if (!instanceCount().count) {
      caches().clear();
      return;
    }
    ;
    const windowWidth = getWindowWidth();
    pubsub().broadcast("def", { windowWidth });
  });
  document.addEventListener(FORM_CHANGE_EVENT, (e) => {
    const detail = e.detail;
    if (!detail?.event) return;
    pubsub().broadcast(detail.event, detail);
  });
}

// src/utils/walker.ts
function walker(array, callback) {
  return array.map((item) => {
    const { children } = item;
    if (children) {
      return {
        ...item,
        children: children.map((child) => {
          const { variants } = child;
          if (variants) {
            return variants.map((variant) => {
              const { controls: controls2 } = variant;
              if (controls2) {
                return {
                  ...variant,
                  controls: controls2.map((control) => {
                    return callback(control);
                  })
                };
              }
              return variant;
            });
          }
          return child;
        })
      };
    }
    ;
    return callback(item);
  });
}
export {
  registerCustomElement,
  walker
};
