import { signal } from "@preact/signals";

export const submitSignal = signal(null);


export const pubSignal = signal({
    value:null,
    name:null,
    event:null,
})
