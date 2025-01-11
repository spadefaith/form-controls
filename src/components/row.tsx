import { h, Fragment } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { getWindowWidth, selectSize } from "../utils";
import { useSignal } from "@preact/signals";
import pubsub from "../utils/pubsub";



export default function Row(props: {
  col?: number;
  classes?: string;
  label?: string;
  name?: string;
  responsive?: { [key: string]: number };
  children: any;
}) {
  const responsive = useMemo(() => {
    return props.responsive;
  }, [props.responsive])

  const id = useSignal(window.crypto.randomUUID());
  const containerRef = useRef(null);
  const prevBreak = useSignal("");
  const hasBreak = useSignal(false);

  const applyBreaks = (target, breaks, windowWidth) => {
    if (!target) return;
    const w = selectSize(breaks, windowWidth);
    let current = `form-cols-${w}`;
    if (prevBreak.value != current) {
      prevBreak.value && target.classList.remove(prevBreak.value);
      target.classList.add(current);
      prevBreak.value = current
    } else {
      if (!target.classList.contains(current)) {
        target.classList.add(current);
      }
    };
  }



  useEffect(() => {

    if (responsive && containerRef.current) {
      const windowWidth = getWindowWidth();

      const { breaks, width } = responsive;

      if (breaks) {
        hasBreak.value = true;
        applyBreaks(containerRef.current, breaks, windowWidth);
        pubsub().register(id.value, "def", ({ windowWidth }) => {
          applyBreaks(containerRef.current, breaks, windowWidth);

        });
      }


    }

    return () => {
      pubsub().clean(id.value);
    }

  }, []);


  return (
    <div
      class={`
        form-row
        ${props.classes ?? ""} 
      `}
      ref={containerRef}
    >
      {props.label ? <p class="">{props.label}</p> : <></>}
      <div class="form-cols" >
        {props.children}
      </div>
    </div>
  );
}
