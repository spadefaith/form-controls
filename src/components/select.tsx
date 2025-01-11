import { useSignal } from "@preact/signals";
import { h } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import FormControl from "./form-control";
import { EventSubscriptionItemType, OptionApiType } from "../../types";
import useRemoteOptions from "../hooks/options-api";
import useLocalOptions from "../hooks/options";
import useVariants from "../hooks/variants";
import useData from "../hooks/data";
import useSubscribeOptions from "../hooks/subscribe";
import useTrigger from "../hooks/trigger";
import Visible from "./visibile";
import ControlLoader from "./control-loader";
import useValue from "../hooks/value";
import useIsView from "../hooks/is-view";
import useCache from "../hooks/cache";


export default function Select(props: {
  name?: string;
  label: string;
  value?: any;
  readonly?: boolean;
  is_view?: boolean;
  options: any;
  placeholder: any;
  variants: any;
  validator?: string;
  tag?: string;
  help?: any;
  option_api?: OptionApiType;
  width?: string;
  event?: {
    trigger?: string[];
    subscribe?: EventSubscriptionItemType[];
  };
  data: any;
  cache?: boolean;
}) {


  const { isView } = useIsView(props.is_view);
  const options = useSignal([]);
  const { value: selectedValue } = useValue(props.value);
  const { value: placeholder } = useValue(props.placeholder);
  const { value: name } = useValue(props.name);
  const selectedText = useSignal(null);
  const variants = useSignal([]);
  const controlRef = useRef(null);
  const isLoading = useSignal(false);
  const isChanged = useSignal(false);

  const { data } = useData(props.data);
  const { options: remoteOptions, isLoading: isRemoteOptionsLoading } = useRemoteOptions(props.option_api, selectedValue.value, name.value, isChanged.value);
  const { options: localOptions } = useLocalOptions(props.options, selectedValue.value, isChanged.value);
  const { options: subscribeOptions, isLoading: isSubscribeOptionsLoading } = useSubscribeOptions(props?.event?.subscribe, name.value);
  const { controls: variantControls, data: variantData, isLoading: isVariantLoading } = useVariants(props.variants, name.value, selectedValue.value, selectedText.value, props.data);

  useMemo(() => {
    if (isView.value) throw new Error(`Select component is not allowed in view mode`);
  }, [isView.value]);

  useMemo(() => {
    const opts = subscribeOptions.value || remoteOptions.value || localOptions.value || [];
    if (placeholder.value) {
      opts.unshift({ label: placeholder, value: null });
    }
    options.value = opts;
  }, [remoteOptions.value, localOptions.value, subscribeOptions.value]);


  useMemo(() => {
    isLoading.value = isRemoteOptionsLoading.value || isSubscribeOptionsLoading.value || isVariantLoading.value;
  }, [
    isRemoteOptionsLoading.value,
    isSubscribeOptionsLoading.value,
    isVariantLoading.value
  ]);

  useMemo(() => {
    data.value = { ...data.value, ...variantData.value };
    variants.value = variantControls.value;

    // console.log(86, name.value, selectedValue.value, variantControls.value)

    // console.log(86, data.value);
    // console.log(87, variants.value);


  }, [variantControls.value, variantData.value]);

  useTrigger(props?.event?.trigger, name.value, selectedValue.value);

  useCache(props.cache, name.value, selectedValue.value,selectedText.value);

  useEffect(() => {
    if (data.value[name.value] == undefined){
      selectedValue.value = null;
    } else {
      selectedValue.value = data.value[name.value];
    }
  }, [data.value, name.value]);

  const changeHandler = async (e) => {
    const target = e.target;
    if (!target) return;
    isChanged.value = true;
    selectedValue.value = target.value;
    selectedText.value = Array.from(target.selectedOptions).reduce((accu, iter: HTMLOptionElement, index) => accu + iter.text + (target.selectedOptions.length - 1 == index ? "" : ','), '');
  };

  return (
    <div
      class={`form-group control-select ${props.help ? "has-help" : ""} mb-3`}
      style={{ width: props.width }}
    >
      <label for={name.value} class="form-label fs-12 roboto-regular">
        {props.label}
      </label>

      <ControlLoader when={isLoading.value}>
        <select
          ref={controlRef}
          data-tag={props.tag}
          value={selectedValue.value}
          onChange={changeHandler}
          class="form-select form-control"
          aria-label="Default select example"
          data-name={name.value}
          {...(props.validator ? { "data-validator": props.validator } : {})}
          {...(props.readonly ? { disabled: true } : {})}
        >
          {options.value.map((item, index) => {
            if (item.selected) {
              return (
                <option key={item.id} value={item.value} selected>
                  {item.label}
                </option>
              );
            }
            return <option key={item.id} value={item.value}>{item.label}</option>;
          })}
        </select>

      </ControlLoader>

      <input
        type="hidden"
        id={name.value}
        name={name.value}
        value={selectedValue.value}
      />

      <Visible when={variants.value.length}>
        <FormControl
          controls={variants.value}
          data={data.value}
        />
      </Visible>

    </div>
  );
}
