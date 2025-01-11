import { useSignal } from "@preact/signals";
import { h } from "preact";
import {
  isFalsy,
} from "../utils";
import { useEffect, useMemo, useRef } from "preact/hooks";
import FormControl from "./form-control";
import { EventSubscriptionItemType, OptionApiType } from "../../types";
import useRemoteOptions from "../hooks/options-api";
import useLocalOptions from "../hooks/options";
import useVariants from "../hooks/variants";
import useData from "../hooks/data";
import useSubscribe from "../hooks/subscribe";
import useTrigger from "../hooks/trigger";
import Visible from "./visibile";
import ControlLoader from "./control-loader";
import useValue from "../hooks/value";
import useName from "../hooks/name";
import useIsView from "../hooks/is-view";


export default function DataList(props: {
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
}) {
  const { isView } = useIsView(props.is_view);
  const options = useSignal([]);
  const { value } = useValue(props.value);
  const { value: name } = useValue(props.name);
  const variants = useSignal([]);
  const isLoading = useSignal(false);
  const isChanged = useSignal(false);
  const { data } = useData(props.data);
  const { options: remoteOptions, isLoading: isRemoteOptionsLoading } = useRemoteOptions(props.option_api, value.value, name.value, isChanged.value);
  const { options: localOptions } = useLocalOptions(props.options, value.value, isChanged.value);
  const { options: subscribeOptions, isLoading: isSubscribeOptionsLoading, value:macroValue } = useSubscribe(props?.event?.subscribe, name.value);
  const { controls: variantControls, data: variantData, isLoading: isVariantLoading } = useVariants(props.variants, name.value, value.value, value.value, props.data);

  useMemo(() => {
    if (isView.value) throw new Error(`Select component is not allowed in view mode`);
  }, [isView.value]);

  useMemo(() => {
    options.value = subscribeOptions.value || remoteOptions.value || localOptions.value || [];
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
  }, [variantControls.value, variantData.value]);

  useTrigger(props?.event?.trigger, name.value, value.value);


  useEffect(() => {
    if (data.value[name.value] == undefined) return;
    value.value = data.value[name.value];
  }, [data.value, name.value]);


  useEffect(() => {
    /**
     * this scenario is usually when in view mode,
     * instead of datalist, input should be used
     */
    if (props.readonly == true) {
      throw new Error('datalist cannot be readonly, use input instead');
    }
  }, [])

  const changeHandler = async (e) => {
    const target = e.target;
    if (!target) return;
    isChanged.value = true;
    value.value = target.value;
  };

  return (
    <div
      class={`form-group  ${props.help ? "has-help" : ""} mb-3`}
      style={{ width: props.width }}
    >
      <label for={name.value} class="form-label fs-12 roboto-regular">
        {props.label}
      </label>

      <ControlLoader when={isLoading.value}>
        <input
          data-tag={props.tag}
          class="form-control"
          id={name.value}
          name={name.value}
          placeholder={props.placeholder || ""}
          value={value.value}
          list={`${name.value}s`}
          {...(props.validator ? { "data-validator": props.validator } : {})}
          onChange={changeHandler}
        />
        <datalist id={`${name.value}s`}>
          {options.value.map((item) => (
            <option
              value={item.value}
              key={String(item.value).split(" ").join("")}
            />
          ))}
        </datalist>

      </ControlLoader>

      <Visible when={variants.value.length}>
        <FormControl
          controls={variants.value}
          data={data.value}
        />
      </Visible>

    </div>
  );
}
