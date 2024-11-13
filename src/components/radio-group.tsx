import { h, Fragment } from "preact";
import { getControlValue, restructureControls } from "../utils";
import FormControl from "./form-control";
import { useSignal, useSignalEffect } from "@preact/signals";
import Visible from "./visibile";

export default function RadioGroup(props: {
  name?: string;
  label: string;
  value?: string | number;
  options: any;
  placeholder: any;
  variants: any;
  validator?: string;
  help?: any;
  orientation?: any;
  option_api?: {
    url: string;
    map: any;
  };
  width?: string;
  tag?: string;
  event?: {
    trigger?: string[];
    subscribe?: string[];
  };
  is_view?: boolean;
  data: any;
}) {
  const currentId = useSignal(null);
  const variants = useSignal({});
  const orientation = useSignal(props.orientation || "vertical");
  const options = useSignal(props.options || []);

  const changeHandler = (e) => {
    const value = getControlValue(e.target);
    const key = `${e.target.name} - ${value}`;



    const id = String(e.target.value).toLowerCase().replaceAll(" ", "-");
    const variantConfig: any = props.variants.find((item) => {
      return item.ref_name == key;
    });


    if (!variantConfig) {
      return;
    }
    variants[currentId.value] = [];

    currentId.value = id;

    const controls = restructureControls(variantConfig?.controls || []);

    options.value = options.value.map((item) => {
      if (item.value == value) {
        item.controls = controls;
      } else {
        item.controls = [];
      }
      return item
    });
  };




  return (
    <div class="radio-container form-group" style={{ width: props.width }}>
      <label>{props.label}</label>
      <div class={`radio-item-container ${orientation.value}`}>
        {options.value.map((item) => {
          const id = String(item.value).toLowerCase().replaceAll(" ", "-");

          return (
            <div class="radio-item form-group">
              <div>
                <input
                  type="radio"
                  value={item.value}
                  id={id}
                  {...(props["data-name"]
                    ? { "data-name": props["data-name"] }
                    : { name: props.name })}
                  onChange={changeHandler}
                  data-tag={props.tag}
                />
                <label for={id}>{item.label}</label>
              </div>

              <Visible when={item?.controls?.length}>
                <FormControl controls={item.controls} data={props.data} />
              </Visible>


            </div>
          );
        })}
      </div>
    </div >
  );
}
