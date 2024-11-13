import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { reviveData } from "../utils";


export default function useData(propsData, def?: any) {
    const data = useSignal(def || {});

    useEffect(() => {
        data.value = reviveData(propsData);
    }, [propsData])

    return { data };
} 