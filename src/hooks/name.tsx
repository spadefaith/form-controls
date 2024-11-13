import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { isFalsy } from "../utils";


export default function useName(value) {
    const v = useSignal(null);

    useEffect(() => {
        if (isFalsy(value)) return;
        v.value = value;
    }, [value]);


    return { name: v };
}