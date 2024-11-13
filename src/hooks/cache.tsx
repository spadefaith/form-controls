import { useEffect } from "preact/hooks";
import { isFalsy } from "../utils";
import { caches } from "..";


export default function useCache(cache, name, value) {
    useEffect(() => {
        if (isFalsy(cache)) return;
        caches.set(name, value);
        return () => {
            caches.delete(name);
        }

    }, [cache, name, value]);
}