import singleton from "./singleton";


export class CacheData {
    cache: Map<string, any>;
    constructor() {
      this.cache = new Map;
    }
    set(key, value) {
      // console.log("set", key, value);
      this.cache.set(key, value);
    }
    get(key) {
      // console.log("get", key);
      return this.cache.get(key);
    }
    delete(key) {
      this.cache.delete(key);
    }
    has(key){
      return this.cache.has(key);
    }
    clear() {
      // console.log("cleared");
      this.cache.clear();
    }
}

export default function caches():CacheData{
    const cacheName = "_caches";
    return singleton<CacheData>(cacheName, new CacheData());
}