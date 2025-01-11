import { h } from "preact";
import { FormControlType } from "../../types";
import useValue from "../hooks/value";
import useName from "../hooks/name";
import useIsView from "../hooks/is-view";

const Input = (props: {
  name?: string;
  type: FormControlType;
  label?: string;
  placeholder: string;
  value?: any;
  validator?: string;
  width?: string;
  readonly?: boolean;
  disabled?: boolean;
  is_view?: boolean;
  tag?: string;
  data?: any;
}) => {
  const { value } = useValue(props.value);
  const { name } = useName(props.name);
  const { isView } = useIsView(props.is_view);

  const onInput = (e) => (value.value = e.currentTarget.value);

  return (
    <div class="form-group">
      {props.label && (
        <label class="form-label" for={name.value}>
          {props.label}
        </label>
      )}
      <input
        data-name={name.value}
        data-tag={props.tag}
        onInput={onInput}
        value={value.value}
        class="form-control"
        type={props.type}
        placeholder={props.placeholder || ""}
        id={name.value}
        {...(isView.value ? { } : { name: name.value })}
        {...(props.readonly || isView.value ? { readonly: true } : {})}
        {...(props.disabled ? { disabled: true } : {})}
        {...(props.validator ? { "data-validator": props.validator } : {})}
      />
    </div>
  );
};

export default Input;
