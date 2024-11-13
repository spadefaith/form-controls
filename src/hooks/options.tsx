import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { createOptions } from "../utils";



export default function useLocalOptions(opts, selectedValue, isChanged) {
    const options = useSignal(null);
    useEffect(() => {
        if (isChanged) return;
        if (!opts?.length) return;
        options.value = createOptions(opts, selectedValue);
    }, [opts, selectedValue, isChanged]);
    return { options };
}