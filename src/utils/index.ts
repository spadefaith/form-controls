import RecursiveIterator from "recursive-iterator";

let index = 0;
export const generateIndex = () => {
  return index++;
};

export const mergeTo = (value, obj) => {
  if (isFalsy(value)) {
    return {};
  }

  return obj || {};
};

export function isFalsy(val, len?) {
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

export const cloneObj = (ctx) => {
  if (!ctx) return ctx;
  try {
    if (typeof ctx == "string") {
      return JSON.parse(ctx);
    } else {
      return JSON.parse(JSON.stringify(ctx));
    }
  } catch (e) { }

  return ctx;
};



export const parseUpdateData = (ctx) => {
  if (!ctx) {
    return {};
  }

  const parsedUpdate = cloneObj(ctx);
  return Object.keys(parsedUpdate).reduce((accu, key) => {
    accu[key] = cloneObj(parsedUpdate[key]);

    return accu;
  }, {});
};

export const restructureControls = (data, update?) => {
  update = parseUpdateData(update);

  data = cloneObj(data);

  // console.log(63, data, update);

  return data
    .filter((item) => item)
    .map((item) => {
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

      item.properties &&
        item.properties.forEach(({ key, value }) => {
          item[key] = value;
        });


      if (update && update[item.name]) {
        item.value = update[item.name]?.value || update[item.name];
      }


      return item;
    });
};

export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows() ||
      []
    );
  },
};

export const getWindowWidth = () => {
  const [mobileType] = isMobile.any();

  return mobileType ? window.screen.width : window.innerWidth;
};

export const sanitize = (str) =>
  decodeURIComponent(String(str).replace(/<.*>/, ""));
export const getControlValue = (control) => {
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

export function getFormData<T>(
  form: HTMLFormElement,
  opts?: {
    trim?: boolean;
    json?: boolean;
    is_sanitize?: boolean;
    key?: "name" | "data-name";
  }
): T {
  const o = {
    trim: false,
    json: true,
    key: "name",
  };
  if (opts && opts.trim != undefined) {
    o.trim = opts.trim;
  }

  if (opts && opts.json != undefined) {
    o.json = opts.json;
  }

  if (opts && opts.key != undefined) {
    o.key = opts.key;
  }

  const formData = new FormData(form);
  const data: any = {};
  const isTrim = o.trim;

  Array.from(form.elements).forEach((item: any) => {
    const value =
      opts?.is_sanitize == undefined || opts?.is_sanitize
        ? sanitize(item["value"])
        : item["value"];

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

    return formData as T;
  }

  return data as T;
}

export const generateUniqueId = () => crypto.randomUUID();

export const createOptions = (arr, selectedValue) => {

  return cloneObj(arr).map((item) => {
    if (selectedValue && item.value == selectedValue) {
      item.selected = true;
    }

    item.id = generateIndex();


    return item;
  });
};

export const loopItem = (array, callback?) => {
  for (const { node, path } of new RecursiveIterator(array)) {
    // if (["boolean", "number", "string"].includes(typeof node)) {

    // }
    callback(path, node);
  }
};

export const filterObj = (obj, exclude) => {
  return Object.keys(obj).reduce((accu, key) => {
    if (!exclude.includes(key)) {
      accu[key] = obj[key];
    }
    return accu;
  }, {});
};


export const selectSize = (dic, size) => {
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

export class PubSub {
  callbacks: object;
  constructor() {
    this.callbacks = {}
  }
  /**
   * 
   * @param key - ensures that the subscriber has a unique handler for the event 
   * @param event - subscriber event
   * @param handler - subscriber handler to event 
   */
  register(key, event: string, handler: (a: any) => void) {
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
    //it compiles all handlers in a event;
    const callbacks = Object.keys(this.callbacks).reduce((accu, key) => {
      const config = this.callbacks[key];
      if (config[event]) {
        accu.push(config[event]);
      }
      return accu;
    }, []);

    if (callbacks && callbacks.length) {
      callbacks.forEach(callback => {
        callback(payload);
      })
    }
  }

  clean(id) {
    delete this.callbacks[id];
  }
}

export const InstanceCount = class {
  _count: number;
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
}

const toBool = (test, a, b) => {
  switch (test) {
    case 'eq': {
      return a == b;
    };
    case 'ne': {
      return a != b;
    };
    case 'gt': {
      return a > b;
    };
    case 'lt': {
      return a < b;
    };
    case 'gte': {
      return a >= b;
    };
    case 'lte': {
      return a <= b;
    };
    case 'in': {
      return a.includes(b);
    };
    case 'notIn': {
      return !a.includes(b);
    };
    case 'truthy': {
      const test = !!b || b == "0";
      // console.log(test, b, !!b, b == "0")
      return test;
    }
    case 'contains': {
      return a.includes(b);
    };
    case 'notContains': {
      return !a.includes(b);
    }
    case 'startsWith': {
      return a.startsWith(b);
    }
    case 'endsWith': {
      return a.endsWith(b);
    }
    case "any": {
      return true;
    }
    default: {
      throw new Error(`Invalid test type - ${test}`);
    }
  }
}


export const getVariant = (variants, payload) => {
  if (!variants || !variants.length) return;


  const testCtx = (target, ctx) => {

    let exp = {} as any;
    if (['string', 'number', 'boolean'].includes(typeof target)) {
      exp.eq = target;
    } else if (typeof target == 'object') {
      exp = Object.assign(exp, target);
    };
    const [[key, value]] = Object.entries(exp);

    // console.log(399, target, key, value, ctx);


    return toBool(key, value, ctx);
  }

  const variant = variants.filter((item) => {
    const { test, data } = item?.fn || {};

    let t = false;
    if (typeof test == 'boolean') {
      t = test;
    } else if (typeof test == 'object') {

      t = Object.keys(test).every((key) => {
        return testCtx(test[key], payload[key]);
      })
    }
    return t;
  });

  return variant;
}


export const replace = (str, obj) => {
  str = decodeURIComponent(str);

  return str.replace(/{(.*?)}/g, (match, key) => {
    return obj[key] !== undefined ? obj[key] : "";
  });
}

export const fetchOptions = (url, map) => {
  return fetch(url)
    .then(async (resp) => {
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
    })
    .catch((err) => { console.log(err); return [] });
};

export const reviveData = (data) => {
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
}

export class CacheData {
  cache: Map<string, any>;
  constructor() {
    this.cache = new Map;
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
  clear() {
    this.cache.clear();
  }
}

export function Stack(array, callback) {
  const l = array.length;
  let index = 0;
  const cache = [];

  function recurse(callback, rej, res) {
    if (index < l) {
      const item = array[index];
      callback(item, index)
        .then((result) => {
          index += 1;
          cache.push(result);
          recurse(callback, rej, res);
        })
        .catch((err) => {
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