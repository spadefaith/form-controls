import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { createOptions, fetchOptions, isFalsy, mergeTo, replace } from "../utils";
import { caches } from "..";



export default function useRemoteOptions(config, selectedValue, name, isChanged) {
    const options = useSignal(null);
    const isLoading = useSignal(false);
    useEffect(() => {
        if (isChanged) return;
        if (isFalsy(config)) return;
        if (isFalsy(config?.url)) return;
        if (!config?.url) return;
        if (isLoading.value) return;
        if (!name) return;


        isLoading.value = true;

        const { url, map, cache } = config;
        const data: any = { [name]: selectedValue, value: selectedValue };


        name && (data.name = name);

        if (cache) {
            cache.forEach(c => {
                !isFalsy(caches.get(c)) && (data[c] = caches.get(c).get("value"));
            })
        };

        const replacedUrl = replace(url, data);

        fetchOptions(replacedUrl, map)
            .then(res => {
                isLoading.value = false;
                if (!Array.isArray(res)) throw new Error('Invalid response, options should be an array of ({label:string, value:string})[]');


                options.value = createOptions(res, selectedValue);

            }).catch(err => isLoading.value = false);



    }, [config, selectedValue, isChanged, name]);

    return { options, isLoading };
}