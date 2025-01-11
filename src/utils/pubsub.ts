import singleton from "./singleton";

class PubSub {
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

export default function pubsub(){
    const cacheName = "_pubsub";
    return singleton<PubSub>(cacheName, new PubSub());
}