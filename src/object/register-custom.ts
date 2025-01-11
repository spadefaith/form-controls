import register from "preact-custom-element";
import FormControl from "../components/form-control";
import Form from "../components/form";
import { caches, instanceCount, pubsub } from "..";
import { getWindowWidth } from "../utils";
import { FORM_CHANGE_EVENT } from "../const";

export default function registerCustomElement() {
    register(FormControl, "x-form-control", ["controls", "data"]);
    register(Form, "x-form", ["data"]);



    window.addEventListener("resize", (e) => {
        console.log("instanceCount.value", instanceCount.count);
        if (!instanceCount.count) {
            caches.clear();
            return;
        };
        const windowWidth = getWindowWidth();
        pubsub.broadcast('def', { windowWidth });
    });
    
    document.addEventListener(FORM_CHANGE_EVENT, (e: CustomEvent) => {
        const detail = e.detail;
        if (!detail?.event) return;
        pubsub.broadcast(detail.event, detail);
    });
}
