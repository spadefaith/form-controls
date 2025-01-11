import { h } from "preact";
import { EventSubscriptionItemType, FormControlType, SubscribeItemType } from "../../types";
import useValue from "../hooks/value";
import useName from "../hooks/name";
import useIsView from "../hooks/is-view";
import useTrigger from "../hooks/trigger";
import useSubscribe from "../hooks/subscribe";
import { useEffect, useMemo, useRef } from "preact/hooks";
import useCache from "../hooks/cache";
import useData from "../hooks/data";

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
  event?: {
    trigger?: string[];
    subscribe?: SubscribeItemType[];
  };
  cache?: boolean;
}) => {
  const inputRef = useRef(null);
  const { value } = useValue(props.value);
  const { name } = useName(props.name);
  const { isView } = useIsView(props.is_view);
  const { data } = useData(props.data);
  

  useTrigger(props?.event?.trigger, name.value, value.value);

  const {cacheValue} = useCache(props.cache, name.value, value.value,name.value);

  const { value:macroValue } = useSubscribe(props?.event?.subscribe, name.value,cacheValue.value);
  
  useMemo(()=>{
    value.value = macroValue.value;
    // console.log("macroValue",name.value,macroValue.value)
  },[macroValue.value])

  const onInput = (e) => (value.value = e.currentTarget.value);

  useEffect(()=>{

    const observer = new MutationObserver( (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          if(mutation.attributeName === "value"){
            value.value = mutation.target.getAttribute("value");
            observer.disconnect();
          }
        }
      }
    });

    observer.observe(inputRef.current,{
      attributes: true, childList: false, subtree: false
    })

    return ()=>{
      observer.disconnect();
    }
  },[value.value])

  useEffect(() => {
    if (data.value[name.value] == undefined){
      value.value = null;
    } else {
      value.value = data.value[name.value];
    }
  }, [data.value, name.value]);

  return (
    <div class="form-group">
      {props.label && (
        <label class="form-label" for={name.value}>
          {props.label}
        </label>
      )}
      <input
        ref={inputRef}
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
