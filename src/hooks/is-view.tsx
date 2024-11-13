import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";


export default function useIsView(value) {
    const v = useSignal(false);

    useEffect(() => {
        v.value = value || false;
    }, [value]);


    return { isView: v };
}