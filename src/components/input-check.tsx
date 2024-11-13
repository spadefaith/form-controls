import { useSignal } from "@preact/signals";
import { h, Fragment } from "preact";
import { FormControlType } from "../../types";
import { useMemo, useRef } from "preact/hooks";
import FormControl from "./form-control";
import useVariants from "../hooks/variants";
import useData from "../hooks/data";
import Visible from "./visibile";
import useIsView from "../hooks/is-view";
import useName from "../hooks/name";

const InputCheck = (props: {
  name?: string;
  type: FormControlType;
  label?: string;
  placeholder: string;
  value?: boolean;
  validator?: string;
  width?: string;
  readonly?: boolean;
  disabled?: boolean;
  is_view?: boolean;
  tag?: string;
  variants: any;
  data: any;
}) => {
  const { isView } = useIsView(props.is_view);
  const value = useSignal(false);
  const inputRef = useRef(null);
  const { data } = useData(props.data);
  const { name } = useName(props.name);
  const variants = useSignal([]);

  useMemo(() => {

    if (!(props.value == true || props.value == false)) return;
    value.value = props.value;

  }, [props.value]);

  const { controls: variantControls, data: variantData } = useVariants(props.variants, props.name, value.value, value.value, props.data);

  useMemo(() => {
    data.value = variantData.value;
    variants.value = variantControls.value;
  }, [variantControls.value, variantData.value]);


  const onInput = (e) => {
    const checked = e.currentTarget.checked;
    value.value = checked;
  };

  return (
    <div class=" my-3">
      <div class="form-check">
        <input
          ref={inputRef}
          data-tag={props.tag}
          onInput={onInput}
          class="form-check-input"
          type="checkbox"
          id={name.value}
          placeholder={props.placeholder || ""}
          {...(isView.value ? { 'data-name': name.value } : { name: name.value })}
          {...(props.readonly || isView.value ? { readonly: true } : {})}
          {...(props.disabled ? { disabled: true } : {})}
          {...(props.validator ? { "data-validator": props.validator } : {})}
        />

        {props.label && (
          <>
            &nbsp;
            <label class="form-check-label" for={name.value}>
              {props.label}
            </label>
          </>
        )}
      </div>

      <Visible when={variants.value.length}>
        <FormControl
          controls={variantControls.value}
          data={props.data}
        />
      </Visible>
    </div>
  );
};

export default InputCheck;
