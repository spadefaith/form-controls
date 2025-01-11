
import { CacheData, InstanceCount, PubSub } from "./utils";
import registerCustomElement from "./object/register-custom";



export const pubsub = new PubSub();
export const instanceCount = new InstanceCount();
export const caches = new CacheData();


export {registerCustomElement};