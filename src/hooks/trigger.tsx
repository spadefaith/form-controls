import { useEffect } from "preact/hooks";
import { isFalsy } from "../utils";
import { FORM_CHANGE_EVENT } from "../const";
import { pubSignal } from "../signals";


export default function useTrigger(config, name, value) {


    useEffect(() => {
        if (isFalsy(config)) return;
        if (isFalsy(name)) return;
        if (isFalsy(value)) return;

        if (!config.length) {
            return console.error(`trigger config of ${name} must be an array`);
        }



        config.forEach((event) => {

            pubSignal.value = { value: value, name: name, event };

            // document.dispatchEvent(
            //     new CustomEvent(FORM_CHANGE_EVENT, {
            //         detail: { value: value, name: name, event },
            //     })
            // );
        })


    }, [config, name, value]);


}