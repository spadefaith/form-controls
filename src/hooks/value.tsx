import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";


export default function useValue(value) {
    const v = useSignal(null);

    useEffect(() => {
        if (value == undefined) return;
        v.value = value;
    }, [value]);


    return { value: v };
}