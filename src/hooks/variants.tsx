import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getVariant, isFalsy, replace, restructureControls, reviveData, Stack } from "../utils";


export default function useVariants(config, name, value, text, initialData) {
    const controls = useSignal([]);
    const data = useSignal({});
    const isLoading = useSignal(false);

    useEffect(() => {
        if (!config) return;
        if (!name) return;
        // if (isFalsy(value)) return;
        if (isLoading.value) return;


        ; (async () => {
            const selected = getVariant(config, { name, value, text });
            let currentData = { value, name, text, [name]: value };
            if (!selected.length) {
                controls.value = [];
                data.value = {};
                return;
            };


            const reviveInitialData = reviveData(initialData);


            let updateData = { ...reviveInitialData, ...data.value };

            isLoading.value = true;

            const dataConfigs = selected.map(({ fn }) => fn?.data || []);
            const remoteDataConfigs = dataConfigs.filter(({ type }) => type == 'api');
            const localDataConfigs = dataConfigs.filter(({ type }) => type == 'local' || type != 'api');

            localDataConfigs.length && localDataConfigs.forEach(({ data: localData }) => {
                updateData = { ...updateData, ...localData };
            });


            await Stack(remoteDataConfigs, async ({ url }) => {
                const replacedUrl = replace(url, currentData);
                if (!replacedUrl) return
                return fetch(replacedUrl)
                    .then(res => res.ok && res.json())
                    .then(remoteData => {
                        if (!remoteData) return;
                        if (remoteData.constructor !== Object) return;
                        updateData = { ...updateData, ...remoteData };
                    })
                    .catch(err => { console.log(err) });
            });


            const selectedControls = selected.reduce((accu, item) => {
                if (!item?.controls) return accu;
                if (!Array.isArray(item.controls)) return accu;
                return accu.concat(item.controls);
            }, []);



            controls.value = restructureControls(selectedControls, data.value);
            data.value = updateData;

            // console.log('data', name, data.value);


            isLoading.value = false;

        })();

    }, [config, name, value, initialData]);

    return {
        data, controls, isLoading
    }
} 