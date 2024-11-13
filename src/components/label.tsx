import { h } from "preact";
export default function Label(props: { name: string; label: string }) {
  return (
    <label class="form-label" for={props.name}>
      {props.label}
    </label>
  );
}
