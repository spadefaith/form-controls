import { useEffect } from "preact/hooks";
import { isFalsy } from "../utils";
import { caches } from "..";


export default function useCache(cache, name, value,text) {
    useEffect(() => {
        if (isFalsy(cache)) return;
        const data = new Map;
        data.set("name",name);
        data.set("value",value);
        data.set("text",text);
        caches.set(name, data);
        return () => {
            caches.delete(name);
        }

    }, [cache, name, value,text]);
}