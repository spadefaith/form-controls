(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/recursive-iterator@3.3.0/node_modules/recursive-iterator/src/lang.js
  var require_lang = __commonJS({
    "node_modules/.pnpm/recursive-iterator@3.3.0/node_modules/recursive-iterator/src/lang.js"(exports) {
      "use strict";
      function isObject(any) {
        return any !== null && typeof any === "object";
      }
      var { isArray } = Array;
      function isArrayLike(any) {
        if (!isObject(any)) return false;
        if (!("length" in any)) return false;
        const length = any.length;
        if (!isNumber(length)) return false;
        if (length > 0) {
          return length - 1 in any;
        } else {
          for (const key in any) {
            return false;
          }
        }
      }
      function isNumber(any) {
        return typeof any === "number";
      }
      function getKeys(object) {
        const keys_ = Object.keys(object);
        if (isArray(object)) {
        } else if (isArrayLike(object)) {
          const index2 = keys_.indexOf("length");
          if (index2 > -1) {
            keys_.splice(index2, 1);
          }
        } else {
          keys_.sort();
        }
        return keys_;
      }
      exports.getKeys = getKeys;
      exports.isArray = isArray;
      exports.isArrayLike = isArrayLike;
      exports.isObject = isObject;
      exports.isNumber = isNumber;
    }
  });

  // node_modules/.pnpm/recursive-iterator@3.3.0/node_modules/recursive-iterator/src/RecursiveIterator.js
  var require_RecursiveIterator = __commonJS({
    "node_modules/.pnpm/recursive-iterator@3.3.0/node_modules/recursive-iterator/src/RecursiveIterator.js"(exports, module) {
      "use strict";
      var { isObject, getKeys } = require_lang();
      var BYPASS_MODE = "__bypassMode";
      var IGNORE_CIRCULAR = "__ignoreCircular";
      var MAX_DEEP = "__maxDeep";
      var CACHE = "__cache";
      var QUEUE = "__queue";
      var STATE = "__state";
      var EMPTY_STATE = {};
      var RecursiveIterator2 = class {
        /**
         * @param {Object|Array} root
         * @param {Number} [bypassMode=0]
         * @param {Boolean} [ignoreCircular=false]
         * @param {Number} [maxDeep=100]
         */
        constructor(root, bypassMode = 0, ignoreCircular = false, maxDeep = 100) {
          this[BYPASS_MODE] = bypassMode;
          this[IGNORE_CIRCULAR] = ignoreCircular;
          this[MAX_DEEP] = maxDeep;
          this[CACHE] = [];
          this[QUEUE] = [];
          this[STATE] = this.getState(void 0, root);
        }
        /**
         * @returns {Object}
         */
        next() {
          const { node, path, deep } = this[STATE] || EMPTY_STATE;
          if (this[MAX_DEEP] > deep) {
            if (this.isNode(node)) {
              if (this.isCircular(node)) {
                if (this[IGNORE_CIRCULAR]) {
                } else {
                  throw new Error("Circular reference");
                }
              } else {
                if (this.onStepInto(this[STATE])) {
                  const descriptors = this.getStatesOfChildNodes(node, path, deep);
                  const method = this[BYPASS_MODE] ? "push" : "unshift";
                  this[QUEUE][method](...descriptors);
                  this[CACHE].push(node);
                }
              }
            }
          }
          const value = this[QUEUE].shift();
          const done = !value;
          this[STATE] = value;
          if (done) this.destroy();
          return { value, done };
        }
        /**
         *
         */
        destroy() {
          this[QUEUE].length = 0;
          this[CACHE].length = 0;
          this[STATE] = null;
        }
        /**
         * @param {*} any
         * @returns {Boolean}
         */
        isNode(any) {
          return isObject(any);
        }
        /**
         * @param {*} any
         * @returns {Boolean}
         */
        isLeaf(any) {
          return !this.isNode(any);
        }
        /**
         * @param {*} any
         * @returns {Boolean}
         */
        isCircular(any) {
          return this[CACHE].indexOf(any) !== -1;
        }
        /**
         * Returns states of child nodes
         * @param {Object} node
         * @param {Array} path
         * @param {Number} deep
         * @returns {Array<Object>}
         */
        getStatesOfChildNodes(node, path, deep) {
          return getKeys(node).map(
            (key) => this.getState(node, node[key], key, path.concat(key), deep + 1)
          );
        }
        /**
         * Returns state of node. Calls for each node
         * @param {Object} [parent]
         * @param {*} [node]
         * @param {String} [key]
         * @param {Array} [path]
         * @param {Number} [deep]
         * @returns {Object}
         */
        getState(parent, node, key, path = [], deep = 0) {
          return { parent, node, key, path, deep };
        }
        /**
         * Callback
         * @param {Object} state
         * @returns {Boolean}
         */
        onStepInto(state) {
          return true;
        }
        /**
         * @returns {RecursiveIterator}
         */
        [Symbol.iterator]() {
          return this;
        }
      };
      module.exports = RecursiveIterator2;
    }
  });

  // node_modules/.pnpm/preact@10.24.3/node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t;
  var i;
  var o;
  var r;
  var f;
  var e;
  var c;
  var s;
  var a;
  var h = {};
  var v = [];
  var p = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var y = Array.isArray;
  function d(n3, l6) {
    for (var u5 in l6) n3[u5] = l6[u5];
    return n3;
  }
  function w(n3) {
    n3 && n3.parentNode && n3.parentNode.removeChild(n3);
  }
  function _(l6, u5, t4) {
    var i5, o4, r5, f4 = {};
    for (r5 in u5) "key" == r5 ? i5 = u5[r5] : "ref" == r5 ? o4 = u5[r5] : f4[r5] = u5[r5];
    if (arguments.length > 2 && (f4.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l6 && null != l6.defaultProps) for (r5 in l6.defaultProps) void 0 === f4[r5] && (f4[r5] = l6.defaultProps[r5]);
    return g(l6, f4, i5, o4, null);
  }
  function g(n3, t4, i5, o4, r5) {
    var f4 = { type: n3, props: t4, key: i5, ref: o4, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r5 ? ++u : r5, __i: -1, __u: 0 };
    return null == r5 && null != l.vnode && l.vnode(f4), f4;
  }
  function b(n3) {
    return n3.children;
  }
  function k(n3, l6) {
    this.props = n3, this.context = l6;
  }
  function x(n3, l6) {
    if (null == l6) return n3.__ ? x(n3.__, n3.__i + 1) : null;
    for (var u5; l6 < n3.__k.length; l6++) if (null != (u5 = n3.__k[l6]) && null != u5.__e) return u5.__e;
    return "function" == typeof n3.type ? x(n3) : null;
  }
  function C(n3) {
    var l6, u5;
    if (null != (n3 = n3.__) && null != n3.__c) {
      for (n3.__e = n3.__c.base = null, l6 = 0; l6 < n3.__k.length; l6++) if (null != (u5 = n3.__k[l6]) && null != u5.__e) {
        n3.__e = n3.__c.base = u5.__e;
        break;
      }
      return C(n3);
    }
  }
  function S(n3) {
    (!n3.__d && (n3.__d = true) && i.push(n3) && !M.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(M);
  }
  function M() {
    var n3, u5, t4, o4, r5, e4, c5, s6;
    for (i.sort(f); n3 = i.shift(); ) n3.__d && (u5 = i.length, o4 = void 0, e4 = (r5 = (t4 = n3).__v).__e, c5 = [], s6 = [], t4.__P && ((o4 = d({}, r5)).__v = r5.__v + 1, l.vnode && l.vnode(o4), O(t4.__P, o4, r5, t4.__n, t4.__P.namespaceURI, 32 & r5.__u ? [e4] : null, c5, null == e4 ? x(r5) : e4, !!(32 & r5.__u), s6), o4.__v = r5.__v, o4.__.__k[o4.__i] = o4, j(c5, o4, s6), o4.__e != e4 && C(o4)), i.length > u5 && i.sort(f));
    M.__r = 0;
  }
  function P(n3, l6, u5, t4, i5, o4, r5, f4, e4, c5, s6) {
    var a5, p5, y4, d5, w4, _4 = t4 && t4.__k || v, g3 = l6.length;
    for (u5.__d = e4, $(u5, l6, _4), e4 = u5.__d, a5 = 0; a5 < g3; a5++) null != (y4 = u5.__k[a5]) && (p5 = -1 === y4.__i ? h : _4[y4.__i] || h, y4.__i = a5, O(n3, y4, p5, i5, o4, r5, f4, e4, c5, s6), d5 = y4.__e, y4.ref && p5.ref != y4.ref && (p5.ref && N(p5.ref, null, y4), s6.push(y4.ref, y4.__c || d5, y4)), null == w4 && null != d5 && (w4 = d5), 65536 & y4.__u || p5.__k === y4.__k ? e4 = I(y4, e4, n3) : "function" == typeof y4.type && void 0 !== y4.__d ? e4 = y4.__d : d5 && (e4 = d5.nextSibling), y4.__d = void 0, y4.__u &= -196609);
    u5.__d = e4, u5.__e = w4;
  }
  function $(n3, l6, u5) {
    var t4, i5, o4, r5, f4, e4 = l6.length, c5 = u5.length, s6 = c5, a5 = 0;
    for (n3.__k = [], t4 = 0; t4 < e4; t4++) null != (i5 = l6[t4]) && "boolean" != typeof i5 && "function" != typeof i5 ? (r5 = t4 + a5, (i5 = n3.__k[t4] = "string" == typeof i5 || "number" == typeof i5 || "bigint" == typeof i5 || i5.constructor == String ? g(null, i5, null, null, null) : y(i5) ? g(b, { children: i5 }, null, null, null) : void 0 === i5.constructor && i5.__b > 0 ? g(i5.type, i5.props, i5.key, i5.ref ? i5.ref : null, i5.__v) : i5).__ = n3, i5.__b = n3.__b + 1, o4 = null, -1 !== (f4 = i5.__i = L(i5, u5, r5, s6)) && (s6--, (o4 = u5[f4]) && (o4.__u |= 131072)), null == o4 || null === o4.__v ? (-1 == f4 && a5--, "function" != typeof i5.type && (i5.__u |= 65536)) : f4 !== r5 && (f4 == r5 - 1 ? a5-- : f4 == r5 + 1 ? a5++ : (f4 > r5 ? a5-- : a5++, i5.__u |= 65536))) : i5 = n3.__k[t4] = null;
    if (s6) for (t4 = 0; t4 < c5; t4++) null != (o4 = u5[t4]) && 0 == (131072 & o4.__u) && (o4.__e == n3.__d && (n3.__d = x(o4)), V(o4, o4));
  }
  function I(n3, l6, u5) {
    var t4, i5;
    if ("function" == typeof n3.type) {
      for (t4 = n3.__k, i5 = 0; t4 && i5 < t4.length; i5++) t4[i5] && (t4[i5].__ = n3, l6 = I(t4[i5], l6, u5));
      return l6;
    }
    n3.__e != l6 && (l6 && n3.type && !u5.contains(l6) && (l6 = x(n3)), u5.insertBefore(n3.__e, l6 || null), l6 = n3.__e);
    do {
      l6 = l6 && l6.nextSibling;
    } while (null != l6 && 8 === l6.nodeType);
    return l6;
  }
  function L(n3, l6, u5, t4) {
    var i5 = n3.key, o4 = n3.type, r5 = u5 - 1, f4 = u5 + 1, e4 = l6[u5];
    if (null === e4 || e4 && i5 == e4.key && o4 === e4.type && 0 == (131072 & e4.__u)) return u5;
    if (t4 > (null != e4 && 0 == (131072 & e4.__u) ? 1 : 0)) for (; r5 >= 0 || f4 < l6.length; ) {
      if (r5 >= 0) {
        if ((e4 = l6[r5]) && 0 == (131072 & e4.__u) && i5 == e4.key && o4 === e4.type) return r5;
        r5--;
      }
      if (f4 < l6.length) {
        if ((e4 = l6[f4]) && 0 == (131072 & e4.__u) && i5 == e4.key && o4 === e4.type) return f4;
        f4++;
      }
    }
    return -1;
  }
  function T(n3, l6, u5) {
    "-" === l6[0] ? n3.setProperty(l6, null == u5 ? "" : u5) : n3[l6] = null == u5 ? "" : "number" != typeof u5 || p.test(l6) ? u5 : u5 + "px";
  }
  function A(n3, l6, u5, t4, i5) {
    var o4;
    n: if ("style" === l6) if ("string" == typeof u5) n3.style.cssText = u5;
    else {
      if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l6 in t4) u5 && l6 in u5 || T(n3.style, l6, "");
      if (u5) for (l6 in u5) t4 && u5[l6] === t4[l6] || T(n3.style, l6, u5[l6]);
    }
    else if ("o" === l6[0] && "n" === l6[1]) o4 = l6 !== (l6 = l6.replace(/(PointerCapture)$|Capture$/i, "$1")), l6 = l6.toLowerCase() in n3 || "onFocusOut" === l6 || "onFocusIn" === l6 ? l6.toLowerCase().slice(2) : l6.slice(2), n3.l || (n3.l = {}), n3.l[l6 + o4] = u5, u5 ? t4 ? u5.u = t4.u : (u5.u = e, n3.addEventListener(l6, o4 ? s : c, o4)) : n3.removeEventListener(l6, o4 ? s : c, o4);
    else {
      if ("http://www.w3.org/2000/svg" == i5) l6 = l6.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l6 && "height" != l6 && "href" != l6 && "list" != l6 && "form" != l6 && "tabIndex" != l6 && "download" != l6 && "rowSpan" != l6 && "colSpan" != l6 && "role" != l6 && "popover" != l6 && l6 in n3) try {
        n3[l6] = null == u5 ? "" : u5;
        break n;
      } catch (n4) {
      }
      "function" == typeof u5 || (null == u5 || false === u5 && "-" !== l6[4] ? n3.removeAttribute(l6) : n3.setAttribute(l6, "popover" == l6 && 1 == u5 ? "" : u5));
    }
  }
  function F(n3) {
    return function(u5) {
      if (this.l) {
        var t4 = this.l[u5.type + n3];
        if (null == u5.t) u5.t = e++;
        else if (u5.t < t4.u) return;
        return t4(l.event ? l.event(u5) : u5);
      }
    };
  }
  function O(n3, u5, t4, i5, o4, r5, f4, e4, c5, s6) {
    var a5, h3, v5, p5, w4, _4, g3, m2, x2, C3, S2, M2, $2, I2, H, L2, T3 = u5.type;
    if (void 0 !== u5.constructor) return null;
    128 & t4.__u && (c5 = !!(32 & t4.__u), r5 = [e4 = u5.__e = t4.__e]), (a5 = l.__b) && a5(u5);
    n: if ("function" == typeof T3) try {
      if (m2 = u5.props, x2 = "prototype" in T3 && T3.prototype.render, C3 = (a5 = T3.contextType) && i5[a5.__c], S2 = a5 ? C3 ? C3.props.value : a5.__ : i5, t4.__c ? g3 = (h3 = u5.__c = t4.__c).__ = h3.__E : (x2 ? u5.__c = h3 = new T3(m2, S2) : (u5.__c = h3 = new k(m2, S2), h3.constructor = T3, h3.render = q), C3 && C3.sub(h3), h3.props = m2, h3.state || (h3.state = {}), h3.context = S2, h3.__n = i5, v5 = h3.__d = true, h3.__h = [], h3._sb = []), x2 && null == h3.__s && (h3.__s = h3.state), x2 && null != T3.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, T3.getDerivedStateFromProps(m2, h3.__s))), p5 = h3.props, w4 = h3.state, h3.__v = u5, v5) x2 && null == T3.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), x2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
      else {
        if (x2 && null == T3.getDerivedStateFromProps && m2 !== p5 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(m2, S2), !h3.__e && (null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(m2, h3.__s, S2) || u5.__v === t4.__v)) {
          for (u5.__v !== t4.__v && (h3.props = m2, h3.state = h3.__s, h3.__d = false), u5.__e = t4.__e, u5.__k = t4.__k, u5.__k.some(function(n4) {
            n4 && (n4.__ = u5);
          }), M2 = 0; M2 < h3._sb.length; M2++) h3.__h.push(h3._sb[M2]);
          h3._sb = [], h3.__h.length && f4.push(h3);
          break n;
        }
        null != h3.componentWillUpdate && h3.componentWillUpdate(m2, h3.__s, S2), x2 && null != h3.componentDidUpdate && h3.__h.push(function() {
          h3.componentDidUpdate(p5, w4, _4);
        });
      }
      if (h3.context = S2, h3.props = m2, h3.__P = n3, h3.__e = false, $2 = l.__r, I2 = 0, x2) {
        for (h3.state = h3.__s, h3.__d = false, $2 && $2(u5), a5 = h3.render(h3.props, h3.state, h3.context), H = 0; H < h3._sb.length; H++) h3.__h.push(h3._sb[H]);
        h3._sb = [];
      } else do {
        h3.__d = false, $2 && $2(u5), a5 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
      } while (h3.__d && ++I2 < 25);
      h3.state = h3.__s, null != h3.getChildContext && (i5 = d(d({}, i5), h3.getChildContext())), x2 && !v5 && null != h3.getSnapshotBeforeUpdate && (_4 = h3.getSnapshotBeforeUpdate(p5, w4)), P(n3, y(L2 = null != a5 && a5.type === b && null == a5.key ? a5.props.children : a5) ? L2 : [L2], u5, t4, i5, o4, r5, f4, e4, c5, s6), h3.base = u5.__e, u5.__u &= -161, h3.__h.length && f4.push(h3), g3 && (h3.__E = h3.__ = null);
    } catch (n4) {
      if (u5.__v = null, c5 || null != r5) {
        for (u5.__u |= c5 ? 160 : 128; e4 && 8 === e4.nodeType && e4.nextSibling; ) e4 = e4.nextSibling;
        r5[r5.indexOf(e4)] = null, u5.__e = e4;
      } else u5.__e = t4.__e, u5.__k = t4.__k;
      l.__e(n4, u5, t4);
    }
    else null == r5 && u5.__v === t4.__v ? (u5.__k = t4.__k, u5.__e = t4.__e) : u5.__e = z(t4.__e, u5, t4, i5, o4, r5, f4, c5, s6);
    (a5 = l.diffed) && a5(u5);
  }
  function j(n3, u5, t4) {
    u5.__d = void 0;
    for (var i5 = 0; i5 < t4.length; i5++) N(t4[i5], t4[++i5], t4[++i5]);
    l.__c && l.__c(u5, n3), n3.some(function(u6) {
      try {
        n3 = u6.__h, u6.__h = [], n3.some(function(n4) {
          n4.call(u6);
        });
      } catch (n4) {
        l.__e(n4, u6.__v);
      }
    });
  }
  function z(u5, t4, i5, o4, r5, f4, e4, c5, s6) {
    var a5, v5, p5, d5, _4, g3, m2, b3 = i5.props, k3 = t4.props, C3 = t4.type;
    if ("svg" === C3 ? r5 = "http://www.w3.org/2000/svg" : "math" === C3 ? r5 = "http://www.w3.org/1998/Math/MathML" : r5 || (r5 = "http://www.w3.org/1999/xhtml"), null != f4) {
      for (a5 = 0; a5 < f4.length; a5++) if ((_4 = f4[a5]) && "setAttribute" in _4 == !!C3 && (C3 ? _4.localName === C3 : 3 === _4.nodeType)) {
        u5 = _4, f4[a5] = null;
        break;
      }
    }
    if (null == u5) {
      if (null === C3) return document.createTextNode(k3);
      u5 = document.createElementNS(r5, C3, k3.is && k3), c5 && (l.__m && l.__m(t4, f4), c5 = false), f4 = null;
    }
    if (null === C3) b3 === k3 || c5 && u5.data === k3 || (u5.data = k3);
    else {
      if (f4 = f4 && n.call(u5.childNodes), b3 = i5.props || h, !c5 && null != f4) for (b3 = {}, a5 = 0; a5 < u5.attributes.length; a5++) b3[(_4 = u5.attributes[a5]).name] = _4.value;
      for (a5 in b3) if (_4 = b3[a5], "children" == a5) ;
      else if ("dangerouslySetInnerHTML" == a5) p5 = _4;
      else if (!(a5 in k3)) {
        if ("value" == a5 && "defaultValue" in k3 || "checked" == a5 && "defaultChecked" in k3) continue;
        A(u5, a5, null, _4, r5);
      }
      for (a5 in k3) _4 = k3[a5], "children" == a5 ? d5 = _4 : "dangerouslySetInnerHTML" == a5 ? v5 = _4 : "value" == a5 ? g3 = _4 : "checked" == a5 ? m2 = _4 : c5 && "function" != typeof _4 || b3[a5] === _4 || A(u5, a5, _4, b3[a5], r5);
      if (v5) c5 || p5 && (v5.__html === p5.__html || v5.__html === u5.innerHTML) || (u5.innerHTML = v5.__html), t4.__k = [];
      else if (p5 && (u5.innerHTML = ""), P(u5, y(d5) ? d5 : [d5], t4, i5, o4, "foreignObject" === C3 ? "http://www.w3.org/1999/xhtml" : r5, f4, e4, f4 ? f4[0] : i5.__k && x(i5, 0), c5, s6), null != f4) for (a5 = f4.length; a5--; ) w(f4[a5]);
      c5 || (a5 = "value", "progress" === C3 && null == g3 ? u5.removeAttribute("value") : void 0 !== g3 && (g3 !== u5[a5] || "progress" === C3 && !g3 || "option" === C3 && g3 !== b3[a5]) && A(u5, a5, g3, b3[a5], r5), a5 = "checked", void 0 !== m2 && m2 !== u5[a5] && A(u5, a5, m2, b3[a5], r5));
    }
    return u5;
  }
  function N(n3, u5, t4) {
    try {
      if ("function" == typeof n3) {
        var i5 = "function" == typeof n3.__u;
        i5 && n3.__u(), i5 && null == u5 || (n3.__u = n3(u5));
      } else n3.current = u5;
    } catch (n4) {
      l.__e(n4, t4);
    }
  }
  function V(n3, u5, t4) {
    var i5, o4;
    if (l.unmount && l.unmount(n3), (i5 = n3.ref) && (i5.current && i5.current !== n3.__e || N(i5, null, u5)), null != (i5 = n3.__c)) {
      if (i5.componentWillUnmount) try {
        i5.componentWillUnmount();
      } catch (n4) {
        l.__e(n4, u5);
      }
      i5.base = i5.__P = null;
    }
    if (i5 = n3.__k) for (o4 = 0; o4 < i5.length; o4++) i5[o4] && V(i5[o4], u5, t4 || "function" != typeof n3.type);
    t4 || w(n3.__e), n3.__c = n3.__ = n3.__e = n3.__d = void 0;
  }
  function q(n3, l6, u5) {
    return this.constructor(n3, u5);
  }
  function B(u5, t4, i5) {
    var o4, r5, f4, e4;
    l.__ && l.__(u5, t4), r5 = (o4 = "function" == typeof i5) ? null : i5 && i5.__k || t4.__k, f4 = [], e4 = [], O(t4, u5 = (!o4 && i5 || t4).__k = _(b, null, [u5]), r5 || h, h, t4.namespaceURI, !o4 && i5 ? [i5] : r5 ? null : t4.firstChild ? n.call(t4.childNodes) : null, f4, !o4 && i5 ? i5 : r5 ? r5.__e : t4.firstChild, o4, e4), j(f4, u5, e4);
  }
  function D(n3, l6) {
    B(n3, l6, D);
  }
  function E(l6, u5, t4) {
    var i5, o4, r5, f4, e4 = d({}, l6.props);
    for (r5 in l6.type && l6.type.defaultProps && (f4 = l6.type.defaultProps), u5) "key" == r5 ? i5 = u5[r5] : "ref" == r5 ? o4 = u5[r5] : e4[r5] = void 0 === u5[r5] && void 0 !== f4 ? f4[r5] : u5[r5];
    return arguments.length > 2 && (e4.children = arguments.length > 3 ? n.call(arguments, 2) : t4), g(l6.type, e4, i5 || l6.key, o4 || l6.ref, null);
  }
  n = v.slice, l = { __e: function(n3, l6, u5, t4) {
    for (var i5, o4, r5; l6 = l6.__; ) if ((i5 = l6.__c) && !i5.__) try {
      if ((o4 = i5.constructor) && null != o4.getDerivedStateFromError && (i5.setState(o4.getDerivedStateFromError(n3)), r5 = i5.__d), null != i5.componentDidCatch && (i5.componentDidCatch(n3, t4 || {}), r5 = i5.__d), r5) return i5.__E = i5;
    } catch (l7) {
      n3 = l7;
    }
    throw n3;
  } }, u = 0, t = function(n3) {
    return null != n3 && null == n3.constructor;
  }, k.prototype.setState = function(n3, l6) {
    var u5;
    u5 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n3 && (n3 = n3(d({}, u5), this.props)), n3 && d(u5, n3), null != n3 && this.__v && (l6 && this._sb.push(l6), S(this));
  }, k.prototype.forceUpdate = function(n3) {
    this.__v && (this.__e = true, n3 && this.__h.push(n3), S(this));
  }, k.prototype.render = b, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n3, l6) {
    return n3.__v.__b - l6.__v.__b;
  }, M.__r = 0, e = 0, c = F(false), s = F(true), a = 0;

  // node_modules/.pnpm/preact-custom-element@4.3.0_preact@10.24.3/node_modules/preact-custom-element/dist/preact-custom-element.esm.js
  function r2() {
    return (r2 = Object.assign ? Object.assign.bind() : function(t4) {
      for (var e4 = 1; e4 < arguments.length; e4++) {
        var n3 = arguments[e4];
        for (var o4 in n3) Object.prototype.hasOwnProperty.call(n3, o4) && (t4[o4] = n3[o4]);
      }
      return t4;
    }).apply(this, arguments);
  }
  var i2 = ["context", "children"];
  function a2(t4) {
    this.getChildContext = function() {
      return t4.context;
    };
    var e4 = t4.children, n3 = function(t5, e5) {
      if (null == t5) return {};
      var n4, o4, r5 = {}, i5 = Object.keys(t5);
      for (o4 = 0; o4 < i5.length; o4++) e5.indexOf(n4 = i5[o4]) >= 0 || (r5[n4] = t5[n4]);
      return r5;
    }(t4, i2);
    return E(e4, n3);
  }
  function s2() {
    var o4 = new CustomEvent("_preact", { detail: {}, bubbles: true, cancelable: true });
    this.dispatchEvent(o4), this._vdom = _(a2, r2({}, this._props, { context: o4.detail.context }), function e4(n3, o5) {
      if (3 === n3.nodeType) return n3.data;
      if (1 !== n3.nodeType) return null;
      var r5 = [], i5 = {}, a5 = 0, s6 = n3.attributes, l6 = n3.childNodes;
      for (a5 = s6.length; a5--; ) "slot" !== s6[a5].name && (i5[s6[a5].name] = s6[a5].value, i5[c2(s6[a5].name)] = s6[a5].value);
      for (a5 = l6.length; a5--; ) {
        var u5 = e4(l6[a5], null), d5 = l6[a5].slot;
        d5 ? i5[d5] = _(p2, { name: d5 }, u5) : r5[a5] = u5;
      }
      var h3 = o5 ? _(p2, null, r5) : r5;
      return _(o5 || n3.nodeName.toLowerCase(), i5, h3);
    }(this, this._vdomComponent)), (this.hasAttribute("hydrate") ? D : B)(this._vdom, this._root);
  }
  function c2(t4) {
    return t4.replace(/-(\w)/g, function(t5, e4) {
      return e4 ? e4.toUpperCase() : "";
    });
  }
  function l2(t4, e4, r5) {
    if (this._vdom) {
      var i5 = {};
      i5[t4] = r5 = null == r5 ? void 0 : r5, i5[c2(t4)] = r5, this._vdom = E(this._vdom, i5), B(this._vdom, this._root);
    }
  }
  function u2() {
    B(this._vdom = null, this._root);
  }
  function p2(e4, n3) {
    var o4 = this;
    return _("slot", r2({}, e4, { ref: function(t4) {
      t4 ? (o4.ref = t4, o4._listener || (o4._listener = function(t5) {
        t5.stopPropagation(), t5.detail.context = n3;
      }, t4.addEventListener("_preact", o4._listener))) : o4.ref.removeEventListener("_preact", o4._listener);
    } }));
  }
  function preact_custom_element_esm_default(t4, e4, n3, o4) {
    function r5() {
      var e5 = Reflect.construct(HTMLElement, [], r5);
      return e5._vdomComponent = t4, e5._root = o4 && o4.shadow ? e5.attachShadow({ mode: o4.mode || "open" }) : e5, e5;
    }
    return (r5.prototype = Object.create(HTMLElement.prototype)).constructor = r5, r5.prototype.connectedCallback = s2, r5.prototype.attributeChangedCallback = l2, r5.prototype.disconnectedCallback = u2, n3 = n3 || t4.observedAttributes || Object.keys(t4.propTypes || {}), r5.observedAttributes = n3, n3.forEach(function(t5) {
      Object.defineProperty(r5.prototype, t5, { get: function() {
        return this._vdom.props[t5];
      }, set: function(e5) {
        this._vdom ? this.attributeChangedCallback(t5, null, e5) : (this._props || (this._props = {}), this._props[t5] = e5, this.connectedCallback());
        var n4 = typeof e5;
        null != e5 && "string" !== n4 && "boolean" !== n4 && "number" !== n4 || this.setAttribute(t5, e5);
      } });
    }), customElements.define(e4 || t4.tagName || t4.displayName || t4.name, r5);
  }

  // node_modules/.pnpm/preact@10.24.3/node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var r3;
  var u3;
  var i3;
  var o2 = 0;
  var f2 = [];
  var c3 = l;
  var e2 = c3.__b;
  var a3 = c3.__r;
  var v2 = c3.diffed;
  var l3 = c3.__c;
  var m = c3.unmount;
  var s3 = c3.__;
  function d2(n3, t4) {
    c3.__h && c3.__h(r3, n3, o2 || t4), o2 = 0;
    var u5 = r3.__H || (r3.__H = { __: [], __h: [] });
    return n3 >= u5.__.length && u5.__.push({}), u5.__[n3];
  }
  function y2(n3, u5) {
    var i5 = d2(t2++, 3);
    !c3.__s && C2(i5.__H, u5) && (i5.__ = n3, i5.i = u5, r3.__H.__h.push(i5));
  }
  function A2(n3) {
    return o2 = 5, T2(function() {
      return { current: n3 };
    }, []);
  }
  function T2(n3, r5) {
    var u5 = d2(t2++, 7);
    return C2(u5.__H, r5) && (u5.__ = n3(), u5.__H = r5, u5.__h = n3), u5.__;
  }
  function j2() {
    for (var n3; n3 = f2.shift(); ) if (n3.__P && n3.__H) try {
      n3.__H.__h.forEach(z2), n3.__H.__h.forEach(B2), n3.__H.__h = [];
    } catch (t4) {
      n3.__H.__h = [], c3.__e(t4, n3.__v);
    }
  }
  c3.__b = function(n3) {
    r3 = null, e2 && e2(n3);
  }, c3.__ = function(n3, t4) {
    n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s3 && s3(n3, t4);
  }, c3.__r = function(n3) {
    a3 && a3(n3), t2 = 0;
    var i5 = (r3 = n3.__c).__H;
    i5 && (u3 === r3 ? (i5.__h = [], r3.__h = [], i5.__.forEach(function(n4) {
      n4.__N && (n4.__ = n4.__N), n4.i = n4.__N = void 0;
    })) : (i5.__h.forEach(z2), i5.__h.forEach(B2), i5.__h = [], t2 = 0)), u3 = r3;
  }, c3.diffed = function(n3) {
    v2 && v2(n3);
    var t4 = n3.__c;
    t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i3 === c3.requestAnimationFrame || ((i3 = c3.requestAnimationFrame) || w2)(j2)), t4.__H.__.forEach(function(n4) {
      n4.i && (n4.__H = n4.i), n4.i = void 0;
    })), u3 = r3 = null;
  }, c3.__c = function(n3, t4) {
    t4.some(function(n4) {
      try {
        n4.__h.forEach(z2), n4.__h = n4.__h.filter(function(n5) {
          return !n5.__ || B2(n5);
        });
      } catch (r5) {
        t4.some(function(n5) {
          n5.__h && (n5.__h = []);
        }), t4 = [], c3.__e(r5, n4.__v);
      }
    }), l3 && l3(n3, t4);
  }, c3.unmount = function(n3) {
    m && m(n3);
    var t4, r5 = n3.__c;
    r5 && r5.__H && (r5.__H.__.forEach(function(n4) {
      try {
        z2(n4);
      } catch (n5) {
        t4 = n5;
      }
    }), r5.__H = void 0, t4 && c3.__e(t4, r5.__v));
  };
  var k2 = "function" == typeof requestAnimationFrame;
  function w2(n3) {
    var t4, r5 = function() {
      clearTimeout(u5), k2 && cancelAnimationFrame(t4), setTimeout(n3);
    }, u5 = setTimeout(r5, 100);
    k2 && (t4 = requestAnimationFrame(r5));
  }
  function z2(n3) {
    var t4 = r3, u5 = n3.__c;
    "function" == typeof u5 && (n3.__c = void 0, u5()), r3 = t4;
  }
  function B2(n3) {
    var t4 = r3;
    n3.__c = n3.__(), r3 = t4;
  }
  function C2(n3, t4) {
    return !n3 || n3.length !== t4.length || t4.some(function(t5, r5) {
      return t5 !== n3[r5];
    });
  }

  // node_modules/.pnpm/@preact+signals-core@1.8.0/node_modules/@preact/signals-core/dist/signals-core.module.js
  var i4 = Symbol.for("preact-signals");
  function t3() {
    if (!(s4 > 1)) {
      var i5, t4 = false;
      while (void 0 !== h2) {
        var r5 = h2;
        h2 = void 0;
        f3++;
        while (void 0 !== r5) {
          var o4 = r5.o;
          r5.o = void 0;
          r5.f &= -3;
          if (!(8 & r5.f) && c4(r5)) try {
            r5.c();
          } catch (r6) {
            if (!t4) {
              i5 = r6;
              t4 = true;
            }
          }
          r5 = o4;
        }
      }
      f3 = 0;
      s4--;
      if (t4) throw i5;
    } else s4--;
  }
  var o3 = void 0;
  var h2 = void 0;
  var s4 = 0;
  var f3 = 0;
  var v3 = 0;
  function e3(i5) {
    if (void 0 !== o3) {
      var t4 = i5.n;
      if (void 0 === t4 || t4.t !== o3) {
        t4 = { i: 0, S: i5, p: o3.s, n: void 0, t: o3, e: void 0, x: void 0, r: t4 };
        if (void 0 !== o3.s) o3.s.n = t4;
        o3.s = t4;
        i5.n = t4;
        if (32 & o3.f) i5.S(t4);
        return t4;
      } else if (-1 === t4.i) {
        t4.i = 0;
        if (void 0 !== t4.n) {
          t4.n.p = t4.p;
          if (void 0 !== t4.p) t4.p.n = t4.n;
          t4.p = o3.s;
          t4.n = void 0;
          o3.s.n = t4;
          o3.s = t4;
        }
        return t4;
      }
    }
  }
  function u4(i5) {
    this.v = i5;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
  }
  u4.prototype.brand = i4;
  u4.prototype.h = function() {
    return true;
  };
  u4.prototype.S = function(i5) {
    if (this.t !== i5 && void 0 === i5.e) {
      i5.x = this.t;
      if (void 0 !== this.t) this.t.e = i5;
      this.t = i5;
    }
  };
  u4.prototype.U = function(i5) {
    if (void 0 !== this.t) {
      var t4 = i5.e, r5 = i5.x;
      if (void 0 !== t4) {
        t4.x = r5;
        i5.e = void 0;
      }
      if (void 0 !== r5) {
        r5.e = t4;
        i5.x = void 0;
      }
      if (i5 === this.t) this.t = r5;
    }
  };
  u4.prototype.subscribe = function(i5) {
    var t4 = this;
    return E2(function() {
      var r5 = t4.value, n3 = o3;
      o3 = void 0;
      try {
        i5(r5);
      } finally {
        o3 = n3;
      }
    });
  };
  u4.prototype.valueOf = function() {
    return this.value;
  };
  u4.prototype.toString = function() {
    return this.value + "";
  };
  u4.prototype.toJSON = function() {
    return this.value;
  };
  u4.prototype.peek = function() {
    var i5 = o3;
    o3 = void 0;
    try {
      return this.value;
    } finally {
      o3 = i5;
    }
  };
  Object.defineProperty(u4.prototype, "value", { get: function() {
    var i5 = e3(this);
    if (void 0 !== i5) i5.i = this.i;
    return this.v;
  }, set: function(i5) {
    if (i5 !== this.v) {
      if (f3 > 100) throw new Error("Cycle detected");
      this.v = i5;
      this.i++;
      v3++;
      s4++;
      try {
        for (var r5 = this.t; void 0 !== r5; r5 = r5.x) r5.t.N();
      } finally {
        t3();
      }
    }
  } });
  function d3(i5) {
    return new u4(i5);
  }
  function c4(i5) {
    for (var t4 = i5.s; void 0 !== t4; t4 = t4.n) if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i) return true;
    return false;
  }
  function a4(i5) {
    for (var t4 = i5.s; void 0 !== t4; t4 = t4.n) {
      var r5 = t4.S.n;
      if (void 0 !== r5) t4.r = r5;
      t4.S.n = t4;
      t4.i = -1;
      if (void 0 === t4.n) {
        i5.s = t4;
        break;
      }
    }
  }
  function l4(i5) {
    var t4 = i5.s, r5 = void 0;
    while (void 0 !== t4) {
      var o4 = t4.p;
      if (-1 === t4.i) {
        t4.S.U(t4);
        if (void 0 !== o4) o4.n = t4.n;
        if (void 0 !== t4.n) t4.n.p = o4;
      } else r5 = t4;
      t4.S.n = t4.r;
      if (void 0 !== t4.r) t4.r = void 0;
      t4 = o4;
    }
    i5.s = r5;
  }
  function y3(i5) {
    u4.call(this, void 0);
    this.x = i5;
    this.s = void 0;
    this.g = v3 - 1;
    this.f = 4;
  }
  (y3.prototype = new u4()).h = function() {
    this.f &= -3;
    if (1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    this.f &= -5;
    if (this.g === v3) return true;
    this.g = v3;
    this.f |= 1;
    if (this.i > 0 && !c4(this)) {
      this.f &= -2;
      return true;
    }
    var i5 = o3;
    try {
      a4(this);
      o3 = this;
      var t4 = this.x();
      if (16 & this.f || this.v !== t4 || 0 === this.i) {
        this.v = t4;
        this.f &= -17;
        this.i++;
      }
    } catch (i6) {
      this.v = i6;
      this.f |= 16;
      this.i++;
    }
    o3 = i5;
    l4(this);
    this.f &= -2;
    return true;
  };
  y3.prototype.S = function(i5) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.S(t4);
    }
    u4.prototype.S.call(this, i5);
  };
  y3.prototype.U = function(i5) {
    if (void 0 !== this.t) {
      u4.prototype.U.call(this, i5);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
      }
    }
  };
  y3.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i5 = this.t; void 0 !== i5; i5 = i5.x) i5.t.N();
    }
  };
  Object.defineProperty(y3.prototype, "value", { get: function() {
    if (1 & this.f) throw new Error("Cycle detected");
    var i5 = e3(this);
    this.h();
    if (void 0 !== i5) i5.i = this.i;
    if (16 & this.f) throw this.v;
    return this.v;
  } });
  function w3(i5) {
    return new y3(i5);
  }
  function _2(i5) {
    var r5 = i5.u;
    i5.u = void 0;
    if ("function" == typeof r5) {
      s4++;
      var n3 = o3;
      o3 = void 0;
      try {
        r5();
      } catch (t4) {
        i5.f &= -2;
        i5.f |= 8;
        g2(i5);
        throw t4;
      } finally {
        o3 = n3;
        t3();
      }
    }
  }
  function g2(i5) {
    for (var t4 = i5.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
    i5.x = void 0;
    i5.s = void 0;
    _2(i5);
  }
  function p3(i5) {
    if (o3 !== this) throw new Error("Out-of-order effect");
    l4(this);
    o3 = i5;
    this.f &= -2;
    if (8 & this.f) g2(this);
    t3();
  }
  function b2(i5) {
    this.x = i5;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
  }
  b2.prototype.c = function() {
    var i5 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var t4 = this.x();
      if ("function" == typeof t4) this.u = t4;
    } finally {
      i5();
    }
  };
  b2.prototype.S = function() {
    if (1 & this.f) throw new Error("Cycle detected");
    this.f |= 1;
    this.f &= -9;
    _2(this);
    a4(this);
    s4++;
    var i5 = o3;
    o3 = this;
    return p3.bind(this, i5);
  };
  b2.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = h2;
      h2 = this;
    }
  };
  b2.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f)) g2(this);
  };
  function E2(i5) {
    var t4 = new b2(i5);
    try {
      t4.c();
    } catch (i6) {
      t4.d();
      throw i6;
    }
    return t4.d.bind(t4);
  }

  // node_modules/.pnpm/@preact+signals@1.3.0_preact@10.24.3/node_modules/@preact/signals/dist/signals.module.js
  var v4;
  var s5;
  function l5(n3, i5) {
    l[n3] = i5.bind(null, l[n3] || function() {
    });
  }
  function d4(n3) {
    if (s5) s5();
    s5 = n3 && n3.S();
  }
  function p4(n3) {
    var r5 = this, f4 = n3.data, o4 = useSignal(f4);
    o4.value = f4;
    var e4 = T2(function() {
      var n4 = r5.__v;
      while (n4 = n4.__) if (n4.__c) {
        n4.__c.__$f |= 4;
        break;
      }
      r5.__$u.c = function() {
        var n5;
        if (!t(e4.peek()) && 3 === (null == (n5 = r5.base) ? void 0 : n5.nodeType)) r5.base.data = e4.peek();
        else {
          r5.__$f |= 1;
          r5.setState({});
        }
      };
      return w3(function() {
        var n5 = o4.value.value;
        return 0 === n5 ? 0 : true === n5 ? "" : n5 || "";
      });
    }, []);
    return e4.value;
  }
  p4.displayName = "_st";
  Object.defineProperties(u4.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: p4 }, props: { configurable: true, get: function() {
    return { data: this };
  } }, __b: { configurable: true, value: 1 } });
  l5("__b", function(n3, r5) {
    if ("string" == typeof r5.type) {
      var i5, t4 = r5.props;
      for (var f4 in t4) if ("children" !== f4) {
        var o4 = t4[f4];
        if (o4 instanceof u4) {
          if (!i5) r5.__np = i5 = {};
          i5[f4] = o4;
          t4[f4] = o4.peek();
        }
      }
    }
    n3(r5);
  });
  l5("__r", function(n3, r5) {
    d4();
    var i5, t4 = r5.__c;
    if (t4) {
      t4.__$f &= -2;
      if (void 0 === (i5 = t4.__$u)) t4.__$u = i5 = function(n4) {
        var r6;
        E2(function() {
          r6 = this;
        });
        r6.c = function() {
          t4.__$f |= 1;
          t4.setState({});
        };
        return r6;
      }();
    }
    v4 = t4;
    d4(i5);
    n3(r5);
  });
  l5("__e", function(n3, r5, i5, t4) {
    d4();
    v4 = void 0;
    n3(r5, i5, t4);
  });
  l5("diffed", function(n3, r5) {
    d4();
    v4 = void 0;
    var i5;
    if ("string" == typeof r5.type && (i5 = r5.__e)) {
      var t4 = r5.__np, f4 = r5.props;
      if (t4) {
        var o4 = i5.U;
        if (o4) for (var e4 in o4) {
          var u5 = o4[e4];
          if (void 0 !== u5 && !(e4 in t4)) {
            u5.d();
            o4[e4] = void 0;
          }
        }
        else i5.U = o4 = {};
        for (var a5 in t4) {
          var c5 = o4[a5], s6 = t4[a5];
          if (void 0 === c5) {
            c5 = _3(i5, a5, s6, f4);
            o4[a5] = c5;
          } else c5.o(s6, f4);
        }
      }
    }
    n3(r5);
  });
  function _3(n3, r5, i5, t4) {
    var f4 = r5 in n3 && void 0 === n3.ownerSVGElement, o4 = d3(i5);
    return { o: function(n4, r6) {
      o4.value = n4;
      t4 = r6;
    }, d: E2(function() {
      var i6 = o4.value.value;
      if (t4[r5] !== i6) {
        t4[r5] = i6;
        if (f4) n3[r5] = i6;
        else if (i6) n3.setAttribute(r5, i6);
        else n3.removeAttribute(r5);
      }
    }) };
  }
  l5("unmount", function(n3, r5) {
    if ("string" == typeof r5.type) {
      var i5 = r5.__e;
      if (i5) {
        var t4 = i5.U;
        if (t4) {
          i5.U = void 0;
          for (var f4 in t4) {
            var o4 = t4[f4];
            if (o4) o4.d();
          }
        }
      }
    } else {
      var e4 = r5.__c;
      if (e4) {
        var u5 = e4.__$u;
        if (u5) {
          e4.__$u = void 0;
          u5.d();
        }
      }
    }
    n3(r5);
  });
  l5("__h", function(n3, r5, i5, t4) {
    if (t4 < 3 || 9 === t4) r5.__$f |= 2;
    n3(r5, i5, t4);
  });
  k.prototype.shouldComponentUpdate = function(n3, r5) {
    var i5 = this.__$u;
    if (!(i5 && void 0 !== i5.s || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
    for (var t4 in r5) return true;
    for (var f4 in n3) if ("__source" !== f4 && n3[f4] !== this.props[f4]) return true;
    for (var o4 in this.props) if (!(o4 in n3)) return true;
    return false;
  };
  function useSignal(n3) {
    return T2(function() {
      return d3(n3);
    }, []);
  }

  // src/hooks/value.tsx
  function useValue(value) {
    const v5 = useSignal(null);
    y2(() => {
      if (value == void 0) return;
      v5.value = value;
    }, [value]);
    return { value: v5 };
  }

  // src/utils/index.ts
  var import_recursive_iterator = __toESM(require_RecursiveIterator());
  var index = 0;
  var generateIndex = () => {
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
    } catch (e4) {
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
    const o4 = {
      trim: false,
      json: true,
      key: "name"
    };
    if (opts && opts.trim != void 0) {
      o4.trim = opts.trim;
    }
    if (opts && opts.json != void 0) {
      o4.json = opts.json;
    }
    if (opts && opts.key != void 0) {
      o4.key = opts.key;
    }
    const formData = new FormData(form);
    const data = {};
    const isTrim = o4.trim;
    Array.from(form.elements).forEach((item) => {
      const value = opts?.is_sanitize == void 0 || opts?.is_sanitize ? sanitize(item["value"]) : item["value"];
      let name = item["name"];
      if (o4.key == "data-name") {
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
    if (o4.json == false) {
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
    let v5 = null;
    const keys = Object.keys(dic).sort((a5, b3) => Number(a5) > Number(b3) ? 1 : -1);
    for (let i5 = 0; i5 < keys.length; i5++) {
      const key = keys[i5];
      const value = Number(key);
      if (size <= value) {
        v5 = dic[key];
        break;
      }
      if (keys.length - 1 === i5) {
        v5 = dic[key];
      }
    }
    return v5;
  };
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
  var toBool = (test, a5, b3) => {
    switch (test) {
      case "eq":
        {
          return a5 == b3;
        }
        ;
      case "ne":
        {
          return a5 != b3;
        }
        ;
      case "gt":
        {
          return a5 > b3;
        }
        ;
      case "lt":
        {
          return a5 < b3;
        }
        ;
      case "gte":
        {
          return a5 >= b3;
        }
        ;
      case "lte":
        {
          return a5 <= b3;
        }
        ;
      case "in":
        {
          return a5.includes(b3);
        }
        ;
      case "notIn":
        {
          return !a5.includes(b3);
        }
        ;
      case "truthy": {
        const test2 = !!b3 || b3 == "0";
        return test2;
      }
      case "contains":
        {
          return a5.includes(b3);
        }
        ;
      case "notContains": {
        return !a5.includes(b3);
      }
      case "startsWith": {
        return a5.startsWith(b3);
      }
      case "endsWith": {
        return a5.endsWith(b3);
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
      let t4 = false;
      if (typeof test == "boolean") {
        t4 = test;
      } else if (typeof test == "object") {
        t4 = Object.keys(test).every((key) => {
          return testCtx(test[key], payload[key]);
        });
      }
      return t4;
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
    clear() {
      this.cache.clear();
    }
  };
  function Stack(array, callback) {
    const l6 = array.length;
    let index2 = 0;
    const cache = [];
    function recurse(callback2, rej, res) {
      if (index2 < l6) {
        const item = array[index2];
        callback2(item, index2).then((result) => {
          index2 += 1;
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
    const v5 = useSignal(null);
    y2(() => {
      if (isFalsy(value)) return;
      v5.value = value;
    }, [value]);
    return { name: v5 };
  }

  // src/hooks/is-view.tsx
  function useIsView(value) {
    const v5 = useSignal(false);
    y2(() => {
      v5.value = value || false;
    }, [value]);
    return { isView: v5 };
  }

  // src/components/input.tsx
  var Input = (props) => {
    const { value } = useValue(props.value);
    const { name } = useName(props.name);
    const { isView } = useIsView(props.is_view);
    const onInput = (e4) => value.value = e4.currentTarget.value;
    return /* @__PURE__ */ _("div", { class: "form-group" }, props.label && /* @__PURE__ */ _("label", { class: "form-label", for: name.value }, props.label), /* @__PURE__ */ _(
      "input",
      {
        "data-tag": props.tag,
        onInput,
        value: value.value,
        class: "form-control",
        type: props.type,
        placeholder: props.placeholder || "",
        id: name.value,
        ...isView.value ? { "data-name": name.value } : { name: name.value },
        ...props.readonly || isView.value ? { readonly: true } : {},
        ...props.disabled ? { disabled: true } : {},
        ...props.validator ? { "data-validator": props.validator } : {}
      }
    ));
  };
  var input_default = Input;

  // src/components/textarea.tsx
  function Textarea(props) {
    const { isView } = useIsView(props.is_view);
    const { value } = useValue(props.value);
    const { name } = useName(props.name);
    const onInput = (e4) => value.value = e4.currentTarget.value;
    return /* @__PURE__ */ _("div", { class: "form-group" }, /* @__PURE__ */ _("label", { for: props.name, class: "form-label " }, props.display), /* @__PURE__ */ _(
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
  function Label(props) {
    return /* @__PURE__ */ _("label", { class: "form-label", for: props.name }, props.label);
  }

  // src/hooks/options-api.tsx
  function useRemoteOptions(config, selectedValue, name, isChanged) {
    const options = useSignal(null);
    const isLoading = useSignal(false);
    y2(() => {
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
        cache.forEach((c5) => {
          !isFalsy(caches.get(c5)) && (data[c5] = caches.get(c5));
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
  function useLocalOptions(opts, selectedValue, isChanged) {
    const options = useSignal(null);
    y2(() => {
      if (isChanged) return;
      if (!opts?.length) return;
      options.value = createOptions(opts, selectedValue);
    }, [opts, selectedValue, isChanged]);
    return { options };
  }

  // src/hooks/variants.tsx
  function useVariants(config, name, value, text, initialData) {
    const controls2 = useSignal([]);
    const data = useSignal({});
    const isLoading = useSignal(false);
    y2(() => {
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

  // src/hooks/data.tsx
  function useData(propsData, def) {
    const data = useSignal(def || {});
    y2(() => {
      data.value = reviveData(propsData);
    }, [propsData]);
    return { data };
  }

  // src/hooks/options-subscribe.tsx
  function useSubscribeOptions(config, name) {
    const options = useSignal(null);
    const isLoading = useSignal(false);
    y2(() => {
      if (isFalsy(config)) return;
      if (isFalsy(name)) return;
      if (isLoading.value) return;
      const propsName = name;
      config.forEach((subscribe) => {
        const { event, options: localOptions, option_api } = subscribe;
        pubsub.register(propsName, subscribe.event, (data) => {
          const { name: name2, value, event: event2 } = data;
          if (option_api) {
            const { url, cache, map } = option_api;
            if (!url) return;
            const data2 = {
              value,
              name: name2
            };
            if (cache) {
              cache.forEach((c5) => {
                !isFalsy(caches.get(c5)) && (data2[c5] = caches.get(c5));
              });
            }
            ;
            const replacedUrl = replace(url, data2);
            isLoading.value = true;
            fetchOptions(replacedUrl, map).then((res) => {
              isLoading.value = false;
              if (!Array.isArray(res)) throw new Error("Invalid response, options should be an array of ({label:string, value:string})[]");
              options.value = createOptions(res, value);
            }).catch((err) => isLoading.value = false);
          } else if (localOptions?.length) {
            options.value = createOptions(localOptions, value);
          }
        });
      });
      return () => {
        config.forEach((subscribe) => {
          pubsub.clean(subscribe.event);
        });
      };
    }, [config, name]);
    return { options, isLoading };
  }

  // src/const/index.ts
  var FORM_CHANGE_EVENT = "form-value-change";

  // src/hooks/trigger.tsx
  function useTrigger(config, name, value) {
    y2(() => {
      if (isFalsy(config)) return;
      if (isFalsy(name)) return;
      if (isFalsy(value)) return;
      if (!config.length) {
        return console.error(`trigger config of ${name} must be an array`);
      }
      config.forEach((event) => {
        document.dispatchEvent(
          new CustomEvent(FORM_CHANGE_EVENT, {
            detail: { value, name, event }
          })
        );
      });
    }, [config, name, value]);
  }

  // src/components/visibile.tsx
  function Visible({ children, when }) {
    const isVisible = T2(() => !isFalsy(when), [when]);
    return isVisible ? children : null;
  }

  // src/components/control-loader.tsx
  function ControlLoader({ children, when }) {
    const isLoading = T2(() => !isFalsy(when), [when]);
    return /* @__PURE__ */ _("div", { style: {
      display: "grid",
      gridAutoFlow: "column",
      gridTemplateColumns: "1fr max-content",
      alignContent: "center",
      alignItems: "center",
      gridGap: "4px"
    } }, children, /* @__PURE__ */ _(Visible, { when: isLoading }, /* @__PURE__ */ _("div", null, /* @__PURE__ */ _("div", { class: "spinner-border text-secondary spinner-border-sm", role: "status" }, /* @__PURE__ */ _("span", { class: "visually-hidden" })))));
  }

  // src/hooks/cache.tsx
  function useCache(cache, name, value) {
    y2(() => {
      if (isFalsy(cache)) return;
      caches.set(name, value);
      return () => {
        caches.delete(name);
      };
    }, [cache, name, value]);
  }

  // src/components/select.tsx
  function Select(props) {
    const { isView } = useIsView(props.is_view);
    const options = useSignal([]);
    const { value: selectedValue } = useValue(props.value);
    const { value: placeholder } = useValue(props.placeholder);
    const { value: name } = useValue(props.name);
    const selectedText = useSignal(null);
    const variants = useSignal([]);
    const controlRef = A2(null);
    const isLoading = useSignal(false);
    const isChanged = useSignal(false);
    const { data } = useData(props.data);
    const { options: remoteOptions, isLoading: isRemoteOptionsLoading } = useRemoteOptions(props.option_api, selectedValue.value, name.value, isChanged.value);
    const { options: localOptions } = useLocalOptions(props.options, selectedValue.value, isChanged.value);
    const { options: subscribeOptions, isLoading: isSubscribeOptionsLoading } = useSubscribeOptions(props?.event?.subscribe, name.value);
    const { controls: variantControls, data: variantData, isLoading: isVariantLoading } = useVariants(props.variants, name.value, selectedValue.value, selectedText.value, props.data);
    T2(() => {
      if (isView.value) throw new Error(`Select component is not allowed in view mode`);
    }, [isView.value]);
    T2(() => {
      const opts = subscribeOptions.value || remoteOptions.value || localOptions.value || [];
      if (placeholder.value) {
        opts.unshift({ label: placeholder, value: null });
      }
      options.value = opts;
    }, [remoteOptions.value, localOptions.value, subscribeOptions.value]);
    T2(() => {
      isLoading.value = isRemoteOptionsLoading.value || isSubscribeOptionsLoading.value || isVariantLoading.value;
    }, [
      isRemoteOptionsLoading.value,
      isSubscribeOptionsLoading.value,
      isVariantLoading.value
    ]);
    T2(() => {
      data.value = { ...data.value, ...variantData.value };
      variants.value = variantControls.value;
    }, [variantControls.value, variantData.value]);
    useTrigger(props?.event?.trigger, name.value, selectedValue.value);
    useCache(props.cache, name.value, selectedValue.value);
    y2(() => {
      if (data.value[name.value] == void 0) return;
      selectedValue.value = data.value[name.value];
    }, [data.value, name.value]);
    const changeHandler = async (e4) => {
      const target = e4.target;
      if (!target) return;
      isChanged.value = true;
      selectedValue.value = target.value;
      selectedText.value = Array.from(target.selectedOptions).reduce((accu, iter, index2) => accu + iter.text + (target.selectedOptions.length - 1 == index2 ? "" : ","), "");
    };
    return /* @__PURE__ */ _(
      "div",
      {
        class: `form-group control-select ${props.help ? "has-help" : ""} mb-3`,
        style: { width: props.width }
      },
      /* @__PURE__ */ _("label", { for: name.value, class: "form-label fs-12 roboto-regular" }, props.label),
      /* @__PURE__ */ _(ControlLoader, { when: isLoading.value }, /* @__PURE__ */ _(
        "select",
        {
          ref: controlRef,
          "data-tag": props.tag,
          value: selectedValue.value,
          onChange: changeHandler,
          class: "form-select form-control",
          "aria-label": "Default select example",
          ...props.validator ? { "data-validator": props.validator } : {},
          ...props.readonly ? { disabled: true } : {}
        },
        options.value.map((item, index2) => {
          if (item.selected) {
            return /* @__PURE__ */ _("option", { key: item.id, value: item.value, selected: true }, item.label);
          }
          return /* @__PURE__ */ _("option", { key: item.id, value: item.value }, item.label);
        })
      )),
      /* @__PURE__ */ _(
        "input",
        {
          type: "hidden",
          id: name.value,
          name: name.value,
          value: selectedValue.value
        }
      ),
      /* @__PURE__ */ _(Visible, { when: variants.value.length }, /* @__PURE__ */ _(
        FormControl,
        {
          controls: variants.value,
          data: data.value
        }
      ))
    );
  }

  // src/components/data-list.tsx
  function DataList(props) {
    const { isView } = useIsView(props.is_view);
    const options = useSignal([]);
    const { value } = useValue(props.value);
    const { value: name } = useValue(props.name);
    const variants = useSignal([]);
    const isLoading = useSignal(false);
    const isChanged = useSignal(false);
    const { data } = useData(props.data);
    const { options: remoteOptions, isLoading: isRemoteOptionsLoading } = useRemoteOptions(props.option_api, value.value, name.value, isChanged.value);
    const { options: localOptions } = useLocalOptions(props.options, value.value, isChanged.value);
    const { options: subscribeOptions, isLoading: isSubscribeOptionsLoading } = useSubscribeOptions(props?.event?.subscribe, name.value);
    const { controls: variantControls, data: variantData, isLoading: isVariantLoading } = useVariants(props.variants, name.value, value.value, value.value, props.data);
    T2(() => {
      if (isView.value) throw new Error(`Select component is not allowed in view mode`);
    }, [isView.value]);
    T2(() => {
      options.value = subscribeOptions.value || remoteOptions.value || localOptions.value || [];
    }, [remoteOptions.value, localOptions.value, subscribeOptions.value]);
    T2(() => {
      isLoading.value = isRemoteOptionsLoading.value || isSubscribeOptionsLoading.value || isVariantLoading.value;
    }, [
      isRemoteOptionsLoading.value,
      isSubscribeOptionsLoading.value,
      isVariantLoading.value
    ]);
    T2(() => {
      data.value = { ...data.value, ...variantData.value };
      variants.value = variantControls.value;
    }, [variantControls.value, variantData.value]);
    useTrigger(props?.event?.trigger, name.value, value.value);
    y2(() => {
      if (data.value[name.value] == void 0) return;
      value.value = data.value[name.value];
    }, [data.value, name.value]);
    y2(() => {
      if (props.readonly == true) {
        throw new Error("datalist cannot be readonly, use input instead");
      }
    }, []);
    const changeHandler = async (e4) => {
      const target = e4.target;
      if (!target) return;
      isChanged.value = true;
      value.value = target.value;
    };
    return /* @__PURE__ */ _(
      "div",
      {
        class: `form-group  ${props.help ? "has-help" : ""} mb-3`,
        style: { width: props.width }
      },
      /* @__PURE__ */ _("label", { for: name.value, class: "form-label fs-12 roboto-regular" }, props.label),
      /* @__PURE__ */ _(ControlLoader, { when: isLoading.value }, /* @__PURE__ */ _(
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
      ), /* @__PURE__ */ _("datalist", { id: `${name.value}s` }, options.value.map((item) => /* @__PURE__ */ _(
        "option",
        {
          value: item.value,
          key: String(item.value).split(" ").join("")
        }
      )))),
      /* @__PURE__ */ _(Visible, { when: variants.value.length }, /* @__PURE__ */ _(
        FormControl,
        {
          controls: variants.value,
          data: data.value
        }
      ))
    );
  }

  // src/components/checkbox-group.tsx
  function CheckboxGroup(props) {
    const variants = useSignal({});
    const changeHandler = (e4) => {
      const value = getControlValue(e4.target);
      const id = String(e4.target.value).toLowerCase().replaceAll(" ", "-");
      if (!value) {
        variants[id] = [];
        return;
      }
      const variantConfig = props.variants.find(
        (item) => item.ref_name == e4.target.name
      );
      variants[id] = restructureControls(variantConfig?.controls?.data || []);
    };
    return /* @__PURE__ */ _("div", { class: "checkbox-group-container" }, /* @__PURE__ */ _("label", { class: "" }, props.label), props.options.map((item) => {
      const id = String(item.value).toLowerCase().replaceAll(" ", "-");
      return /* @__PURE__ */ _("div", { class: "checkbox-group-item form-group" }, /* @__PURE__ */ _("div", { class: "form-check form-switch" }, /* @__PURE__ */ _(
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
      ), /* @__PURE__ */ _("label", { for: id, class: "form-check-label" }, item.label)), /* @__PURE__ */ _(Visible, { when: (variants[id] || []).length }, /* @__PURE__ */ _(FormControl, { controls: variants[id] })));
    }));
  }

  // src/components/radio-group.tsx
  function RadioGroup(props) {
    const currentId = useSignal(null);
    const variants = useSignal({});
    const orientation = useSignal(props.orientation || "vertical");
    const options = useSignal(props.options || []);
    const changeHandler = (e4) => {
      const value = getControlValue(e4.target);
      const key = `${e4.target.name} - ${value}`;
      const id = String(e4.target.value).toLowerCase().replaceAll(" ", "-");
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
    return /* @__PURE__ */ _("div", { class: "radio-container form-group", style: { width: props.width } }, /* @__PURE__ */ _("label", null, props.label), /* @__PURE__ */ _("div", { class: `radio-item-container ${orientation.value}` }, options.value.map((item) => {
      const id = String(item.value).toLowerCase().replaceAll(" ", "-");
      return /* @__PURE__ */ _("div", { class: "radio-item form-group" }, /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(
        "input",
        {
          type: "radio",
          value: item.value,
          id,
          ...props["data-name"] ? { "data-name": props["data-name"] } : { name: props.name },
          onChange: changeHandler,
          "data-tag": props.tag
        }
      ), /* @__PURE__ */ _("label", { for: id }, item.label)), /* @__PURE__ */ _(Visible, { when: item?.controls?.length }, /* @__PURE__ */ _(FormControl, { controls: item.controls, data: props.data })));
    })));
  }

  // src/signals/index.ts
  var submitSignal = d3(null);

  // src/components/repeatable.tsx
  function Repeatable(props) {
    const uniqueId = useSignal(generateUniqueId());
    const datas = useSignal([]);
    const viewDatas = useSignal([]);
    const formRef = A2(null);
    const formControls = useSignal(props?.children || []);
    y2(() => {
      const values = (props?.data || {})[props.name];
      if (values?.length) {
        viewDatas.value = values.map((value) => restructureControls(value));
        console.log("repeatable receives values");
      }
    }, [props.data]);
    y2(() => {
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
    const deleteHandler = (e4) => {
      const target = e4.target;
      const key = target.dataset.key;
      const id = target.dataset.id;
      datas.value = datas.value.reduce((accu, item, index2) => {
        if (id != index2) {
          accu.push(item);
        }
        return accu;
      }, []);
      viewDatas.value = datas.value;
    };
    const addHandler = (e4) => {
      e4.preventDefault();
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
    return /* @__PURE__ */ _("div", { class: "repeatable-container card my-3" }, /* @__PURE__ */ _("div", { class: "repeatable-content card-body" }, /* @__PURE__ */ _("fieldset", null, /* @__PURE__ */ _("legend", null, props.label), viewDatas.value.map((item, index2) => {
      const value = item.reduce((accu, iter) => {
        accu[iter.name] = iter.value;
        return accu;
      }, {});
      console.log("rendering datas.value");
      return /* @__PURE__ */ _("details", null, /* @__PURE__ */ _("summary", null, `${props.label} - ${index2 + 1}`), /* @__PURE__ */ _("div", null, /* @__PURE__ */ _(
        FormControl,
        {
          controls: item,
          data: value,
          key: `values-${generateUniqueId()}`,
          is_from_repeatable: true,
          is_view: true
        }
      ), /* @__PURE__ */ _("br", null), /* @__PURE__ */ _(
        "button",
        {
          type: "button",
          onClick: deleteHandler,
          "data-id": index2,
          class: "btn btn-danger"
        },
        "Remove"
      ), /* @__PURE__ */ _("div", { style: "height:50px" })));
    }), !props.is_view && /* @__PURE__ */ _("details", null, /* @__PURE__ */ _("summary", null, props.label, " Form"), /* @__PURE__ */ _(
      "form",
      {
        onSubmit: addHandler,
        ref: formRef,
        name: uniqueId.value,
        id: uniqueId.value,
        "data-type": "repeatable"
      },
      /* @__PURE__ */ _(
        FormControl,
        {
          controls: formControls.value,
          key: "form-values",
          is_from_repeatable: true
        }
      ),
      /* @__PURE__ */ _("br", null),
      /* @__PURE__ */ _("button", { type: "reset", class: "btn btn-warning" }, "Reset"),
      "\xA0",
      /* @__PURE__ */ _("button", { type: "submit", class: "btn btn-success" }, "Submit")
    ), /* @__PURE__ */ _(
      "input",
      {
        type: "hidden",
        id: props.name,
        ...props.is_from_repeatable ? { "data-name": props.name } : { name: props.name },
        value: JSON.stringify(datas.value),
        "data-tag": props.tag
      }
    )), props.is_view && !viewDatas.value.length ? /* @__PURE__ */ _("details", null, /* @__PURE__ */ _("summary", null, "empty")) : /* @__PURE__ */ _(b, null))));
  }

  // src/components/input-check.tsx
  var InputCheck = (props) => {
    const { isView } = useIsView(props.is_view);
    const value = useSignal(false);
    const inputRef = A2(null);
    const { data } = useData(props.data);
    const { name } = useName(props.name);
    const variants = useSignal([]);
    T2(() => {
      if (!(props.value == true || props.value == false)) return;
      value.value = props.value;
    }, [props.value]);
    const { controls: variantControls, data: variantData } = useVariants(props.variants, props.name, value.value, value.value, props.data);
    T2(() => {
      data.value = variantData.value;
      variants.value = variantControls.value;
    }, [variantControls.value, variantData.value]);
    const onInput = (e4) => {
      const checked = e4.currentTarget.checked;
      value.value = checked;
    };
    return /* @__PURE__ */ _("div", { class: " my-3" }, /* @__PURE__ */ _("div", { class: "form-check" }, /* @__PURE__ */ _(
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
    ), props.label && /* @__PURE__ */ _(b, null, "\xA0", /* @__PURE__ */ _("label", { class: "form-check-label", for: name.value }, props.label))), /* @__PURE__ */ _(Visible, { when: variants.value.length }, /* @__PURE__ */ _(
      FormControl,
      {
        controls: variantControls.value,
        data: props.data
      }
    )));
  };
  var input_check_default = InputCheck;

  // src/components/form-group.tsx
  function FormGroup(props) {
    return /* @__PURE__ */ _(
      "div",
      {
        class: `
        form-control-item form-col-${props.col || 1}} 
        ${props.classes ?? ""} 
      `
      },
      props.label ? /* @__PURE__ */ _("p", { class: "" }, props.label) : /* @__PURE__ */ _(b, null),
      /* @__PURE__ */ _("div", { class: "form-group-controls" }, props.children)
    );
  }

  // src/components/row.tsx
  function Row(props) {
    const responsive = T2(() => {
      return props.responsive;
    }, [props.responsive]);
    const id = useSignal(window.crypto.randomUUID());
    const containerRef = A2(null);
    const prevBreak = useSignal("");
    const hasBreak = useSignal(false);
    const applyBreaks = (target, breaks, windowWidth) => {
      if (!target) return;
      const w4 = selectSize(breaks, windowWidth);
      let current = `form-cols-${w4}`;
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
    y2(() => {
      if (responsive && containerRef.current) {
        const windowWidth = getWindowWidth();
        const { breaks, width } = responsive;
        if (breaks) {
          hasBreak.value = true;
          applyBreaks(containerRef.current, breaks, windowWidth);
          pubsub.register(id.value, "def", ({ windowWidth: windowWidth2 }) => {
            applyBreaks(containerRef.current, breaks, windowWidth2);
          });
        }
      }
      return () => {
        pubsub.clean(id.value);
      };
    }, []);
    return /* @__PURE__ */ _(
      "div",
      {
        class: `
        form-row
        ${props.classes ?? ""} 
      `,
        ref: containerRef
      },
      props.label ? /* @__PURE__ */ _("p", { class: "" }, props.label) : /* @__PURE__ */ _(b, null),
      /* @__PURE__ */ _("div", { class: "form-cols" }, props.children)
    );
  }

  // src/components/col.tsx
  function Col(props) {
    const responsive = T2(() => {
      return props.responsive;
    }, [props.responsive]);
    const id = useSignal(window.crypto.randomUUID());
    const containerRef = A2(null);
    const prevWidth = useSignal("");
    const applyWidth = (target, widths, windowWidth) => {
      if (!target) return;
      const w4 = selectSize(widths, windowWidth);
      if (prevWidth.value != w4) {
        target.style.width = w4;
        prevWidth.value = w4;
      } else {
        if (!target.classList.contains(w4)) {
          target.style.width = w4;
        }
      }
      ;
    };
    y2(() => {
      if (responsive && containerRef.current) {
        const windowWidth = getWindowWidth();
        const { breaks, width } = responsive;
        if (width) {
          applyWidth(containerRef.current, width, windowWidth);
          pubsub.register(id.value, "def", ({ windowWidth: windowWidth2 }) => {
            applyWidth(containerRef.current, width, windowWidth2);
          });
        }
      }
      return () => {
        pubsub.clean(id.value);
      };
    }, []);
    return /* @__PURE__ */ _(
      "div",
      {
        class: `
        form-col form-col-${props.col || 1} 
        ${props.classes ?? ""} 
      `,
        ref: containerRef
      },
      props.label ? /* @__PURE__ */ _("p", { class: "" }, props.label) : /* @__PURE__ */ _(b, null),
      /* @__PURE__ */ _("div", { class: "form-col-item" }, props.children)
    );
  }

  // src/hooks/controls.tsx
  function useControls(controls2, data) {
    const { data: controlsData } = useData(controls2, []);
    const ctrls = useSignal([]);
    y2(() => {
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

  // src/components/form-control.tsx
  function FormControl(props) {
    const { data } = useData(props.data);
    const { controls: controls2 } = useControls(props.controls, data.value);
    y2(() => {
      instanceCount.increment();
      return () => {
        if (instanceCount.count > 0) {
          instanceCount.decrement();
        }
      };
    }, []);
    return /* @__PURE__ */ _(b, null, controls2.value.map((ctrl) => {
      let { control, child, id } = ctrl;
      if (control.tag == "group") {
        return /* @__PURE__ */ _(
          FormGroup,
          {
            key: id,
            col: child.length,
            data: data.value,
            is_view: props.is_view,
            is_from_repeatable: props.is_from_repeatable,
            ...control
          },
          /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
          Row,
          {
            key: id,
            col: child.length,
            data: data.value,
            is_view: props.is_view,
            is_from_repeatable: props.is_from_repeatable,
            ...control
          },
          /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
          Col,
          {
            key: id,
            ...control
          },
          /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(Label, { key: id, label: control.label, name: control.name });
      } else if (["select", "select-inline"].includes(control.tag)) {
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(
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
        return /* @__PURE__ */ _(b, null);
      }
    }));
  }

  // src/components/form.tsx
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
    const formControls = T2(() => {
      return allControls;
    }, [props.data]);
    return /* @__PURE__ */ _("form", null, /* @__PURE__ */ _(FormControl, { controls: formControls, data: props.data }), /* @__PURE__ */ _("button", { type: "submit", class: "btn btn-success" }, "Submit"));
  }

  // src/index.ts
  preact_custom_element_esm_default(FormControl, "x-form-control", ["controls", "data"]);
  preact_custom_element_esm_default(Form, "x-form", ["data"]);
  var pubsub = new PubSub();
  var instanceCount = new InstanceCount();
  var caches = new CacheData();
  window.addEventListener("resize", (e4) => {
    console.log("instanceCount.value", instanceCount.count);
    if (!instanceCount.count) {
      caches.clear();
      return;
    }
    ;
    const windowWidth = getWindowWidth();
    pubsub.broadcast("def", { windowWidth });
  });
  document.addEventListener(FORM_CHANGE_EVENT, (e4) => {
    const detail = e4.detail;
    if (!detail?.event) return;
    pubsub.broadcast(detail.event, detail);
  });
})();
