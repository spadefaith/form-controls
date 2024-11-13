import { useEffect } from "preact/hooks";
import { EventSubscriptionItemType } from "../../types";
import { caches, pubsub } from "..";
import { useSignal } from "@preact/signals";
import { createOptions, fetchOptions, isFalsy, replace } from "../utils";

export default function useSubscribeOptions(config, name) {

    const options = useSignal(null);
    const isLoading = useSignal(false);

    useEffect(() => {
        if (isFalsy(config)) return;
        if (isFalsy(name)) return;
        if (isLoading.value) return;

        const propsName = name;
        config.forEach((subscribe: EventSubscriptionItemType) => {
            const { event, options: localOptions, option_api } = subscribe;

            pubsub.register(propsName, subscribe.event, (data) => {
                const { name, value, event } = data;
                if (option_api) {
                    const { url, cache, map } = option_api;
                    if (!url) return;
                    const data: any = {
                        value, name,
                    };

                    if (cache) {
                        cache.forEach(c => {
                            !isFalsy(caches.get(c)) && (data[c] = caches.get(c));
                        })
                    };

                    const replacedUrl = replace(url, data);
                    isLoading.value = true;
                    fetchOptions(replacedUrl, map)
                        .then(res => {
                            isLoading.value = false;
                            if (!Array.isArray(res)) throw new Error('Invalid response, options should be an array of ({label:string, value:string})[]');
                            options.value = createOptions(res, value);
                        }).catch(err => isLoading.value = false);
                } else if (localOptions?.length) {
                    options.value = createOptions(localOptions, value);
                }
            })
        })

        return () => {
            config.forEach((subscribe: EventSubscriptionItemType) => {
                pubsub.clean(subscribe.event);
            })
        }

    }, [config, name]);

    return { options, isLoading };
}