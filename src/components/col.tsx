import { h, Fragment } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { getWindowWidth, selectSize } from "../utils";
import { useSignal } from "@preact/signals";
import pubsub from "../utils/pubsub";




export default function Col(props: {
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
  const prevWidth = useSignal("");



  const applyWidth = (target, widths, windowWidth) => {
    if (!target) return;
    const w = selectSize(widths, windowWidth);
    if (prevWidth.value != w) {
      target.style.width = w;
      prevWidth.value = w
    } else {
      if (!target.classList.contains(w)) {
        target.style.width = w;
      }
    };
  }



  useEffect(() => {
    if (responsive && containerRef.current) {
      const windowWidth = getWindowWidth();

      const { breaks, width } = responsive;


      if (width) {
        applyWidth(containerRef.current, width, windowWidth);
        pubsub().register(id.value, "def", ({ windowWidth }) => {
          applyWidth(containerRef.current, width, windowWidth);
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
        form-col form-col-${props.col || 1} 
        ${props.classes ?? ""} 
      `}
      ref={containerRef}
    >
      {props.label ? <p class="">{props.label}</p> : <></>}


      <div class="form-col-item">
        {props.children}
      </div>
    </div>
  );
}
