import { h, Fragment } from "preact";
import { getControlValue, restructureControls } from "../utils";
import FormControl from "./form-control";
import { useSignal } from "@preact/signals";
import Visible from "./visibile";

export default function CheckboxGroup(props: {
  name?: string;
  label: string;
  value?: string | number;
  options: any;
  placeholder: any;
  variants: any;
  validator?: string;
  help?: any;
  option_api?: {
    url: string;
    map: any;
  };
  width?: string;
  event?: {
    trigger?: string[];
    subscribe?: string[];
  };
  tag?: string;
}) {
  const variants = useSignal({});

  const changeHandler = (e) => {
    const value = getControlValue(e.target);

    const id = String(e.target.value).toLowerCase().replaceAll(" ", "-");

    if (!value) {
      variants[id] = [];
      return;
    }

    const variantConfig: any = props.variants.find(
      (item) => item.ref_name == e.target.name
    );

    variants[id] = restructureControls(variantConfig?.controls?.data || []);
  };
  return (
    <div class="checkbox-group-container">
      <label class="">{props.label}</label>
      {props.options.map((item) => {
        const id = String(item.value).toLowerCase().replaceAll(" ", "-");

        return (
          <div class="checkbox-group-item form-group">
            <div class="form-check form-switch">
              <input
                data-tag={props.tag}
                onChange={changeHandler}
                type="checkbox"
                value={item.value}
                id={id}
                name={props.name}
                class="form-check-input"
              />
              <label for={id} class="form-check-label">
                {item.label}
              </label>
            </div>

            <Visible when={(variants[id] || []).length}>
              <FormControl controls={variants[id]} />
            </Visible>
          </div>
        );
      })}
    </div>
  );
}
