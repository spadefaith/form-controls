import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { isFalsy, restructureControls } from "../utils";
import useData from "./data";



export default function useControls(controls, data) {
    const { data: controlsData } = useData(controls, []);
    const ctrls = useSignal([]);


    useEffect(() => {
        if (isFalsy(controlsData.value?.length)) return;
        ctrls.value = restructureControls(controlsData, data).map(
            (control) => {
                if (["group", "row", "col"].includes(control.tag)) {
                    const controls = restructureControls(
                        control.children.map((item) => {
                            return item;
                        }),
                        data
                    );
                    return {
                        control,
                        child: controls,
                    };
                } else {
                    return { control };
                }
            }
        );

    }, [controlsData.value, data]);


    return {
        controls: ctrls,
    }

}