import { h, Fragment } from "preact";
import { useRef } from "preact/hooks";

export default function FormGroup(props: {
  col?: number;
  classes?: string;
  label?: string;
  name?: string;
  responsive?: { [key: string]: number };
  children: any;
}) {
  return (
    <div
      class={`
        form-control-item form-col-${props.col || 1}} 
        ${props.classes ?? ""} 
      `}
    >
      {props.label ? <p class="">{props.label}</p> : <></>}
      <div class="form-group-controls" >
        {props.children}
      </div>
    </div>
  );
}
