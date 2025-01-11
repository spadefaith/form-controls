import { useEffect } from "preact/hooks";
import { isFalsy } from "../utils";
import caches from "../utils/caches";
import { useSignal } from "@preact/signals";


export default function useCache(cache, name, value,text) {

    const t = useSignal(new Map);



    useEffect(() => {
        if (isFalsy(cache)) return;
        if(name == null) return;

        const data = new Map;
        data.set("name",name);
        data.set("value",value);
        data.set("text",text);
        caches().set(name, data);

        t.value = data;


        return () => {
            // caches().delete(name);
            // console.log("cache deleted",name);
            t.value = null;
        }

    }, [cache, name, value,text]);

    return {cacheValue:t}
}