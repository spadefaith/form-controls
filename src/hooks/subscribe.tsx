import { useEffect } from "preact/hooks";
import { EventSubscriptionItemType, SubscribeItemType, SubscribeOptions, SubscribeValue } from "../../types";
import { useSignal } from "@preact/signals";
import { createOptions, fetchOptions, isFalsy, replace } from "../utils";
import caches from "../utils/caches";
import pubsub from "../utils/pubsub";
import { pubSignal } from "../signals";

export default function useSubscribe(config, controlName,v?) {

    const options = useSignal(null);
    const isLoading = useSignal(false);
    const value = useSignal(null);
    const type = useSignal(null);

    useEffect(() => {
        if (isFalsy(config)) return;
        if (isFalsy(controlName)) return;
        if (isLoading.value) return;

        const {name,event} = pubSignal.value;



        config.forEach((subscribe: SubscribeItemType) => {
            const { change, config } = subscribe;
            

            type.value = change;
            if(change == "value"){
                const _config = config as SubscribeValue;
                const {fields, macro} = _config;

                if (fields) {
                    if (macro == "sum") {
                        value.value = fields.reduce((accu, field)=>{
                            if(caches().has(field)){
                                const val =  caches().get(field).get("value");
                                accu += parseInt(val) || 0;
                            }


                            return accu 
                        },0)
                    }
                }
            }else if(change == "options"){
                const _config = config as SubscribeOptions;
                const {options: localOptions, option_api} = _config;
                const value = pubSignal.value;

                if (option_api) {
                    const { url, cache, map } = option_api;
                    if (!url) return;
                    const data: any = {
                        value, name,
                    };

                    if (cache) {
                        cache.forEach(c => {
                            !isFalsy(caches().get(c)) && (data[c] = caches().get(c).get("value"));
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
            }


        })

        return () => {
            config.forEach((subscribe: EventSubscriptionItemType) => {
                pubsub().clean(subscribe.event);
            })
        }

    }, [config, controlName,v,pubSignal.value]);

    return { options, isLoading, value, type };
}