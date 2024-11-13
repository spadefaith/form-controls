import { h } from "preact";
import { mergeTo } from "../utils";
import useValue from "../hooks/value";
import useName from "../hooks/name";
import useIsView from "../hooks/is-view";

export default function Textarea(props: {
  name?: string;
  label?: string;
  placeholder: string;
  validator?: string;
  height?: string;
  display?: string;
  value?: string;
  is_view?: boolean;
  is_from_repeatable?: boolean;
  tag?: string;
  readonly?: boolean;
  disabled?: boolean;
}) {
  const { isView } = useIsView(props.is_view);
  const { value } = useValue(props.value);
  const { name } = useName(props.name);

  const onInput = (e) => (value.value = e.currentTarget.value);

  return (
    <div class="form-group">
      <label for={props.name} class="form-label ">
        {props.display}
      </label>
      <textarea
        onInput={onInput}
        data-tag={props.tag}
        class="form-control"
        id={name.value}
        placeholder={props.placeholder || ""}
        value={value.value}
        {...(isView.value ? { 'data-name': name.value } : { name: name.value })}
        {...(props.readonly || isView.value ? { readonly: true } : {})}
        {...(props.disabled ? { disabled: true } : {})}
        {...(props.validator ? { "data-validator": props.validator } : {})}
        style={{
          ...mergeTo(props.height, {
            height: props.height,
          }),
        }}
      />
    </div>
  );
}
