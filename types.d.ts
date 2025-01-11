export type FormControlType =
  | "number"
  | "text"
  | "email"
  | "hidden"
  | "date"
  | "file"
  | ""
  | null;

export type TagType =
  | "select"
  | "input"
  | "checkbox"
  | "check"
  | "radio"
  | "datalist"
  | "repeatable"
  | "group"
  | "label"
  | "textarea";
export type OptionType = {
  id?: number;
  label: string;
  value: string;
  selected?: boolean | null;
  hint?: null | boolean;
};
export type PropertyType = { key: string; value: string };
export type HelpType = {
  content: string;
  is_show: boolean;
  api: string;
  icon: any;
};

export interface LabelValue {
  label: string;
  value: string;
}

export type FormControlItemType = {
  id: number;
  tag: TagType;
  label?: string;
  default?: string;
  option_api?: any;
  properties?: PropertyType[];
  variants?: {
    check_fn_str?: string;
    ref_name?: string;
    controls: FormControlItemType[];
  }[];
  options?: OptionType[];
  children?: FormControlItemType[];
  help?: HelpType;

  name?: string;
  placeholder?: string;
  type?: FormControlType;
  value?: string;
  "data-name"?: string;
  values?: any[];
  validator?: string;
  height?: string;
  is_view?: boolean;

  width?: string;
  responsive?: number;
  event?: {
    trigger?: string[];
    subscribe?: SubscribeItemType[];
  };
  orientation?: "portrait" | "landscape";
};


export type OptionApiType = {
  url: string;
  map: any;
  cache: string[]
}

export interface SubscribeItemType {
  event: string;
  change: "value" | "options";
  config:SubscribeValue | SubscribeOptions
}

export interface SubscribeOptions {
  option_api?: OptionApiType & { query_key?: string };
  options?: LabelValue[];
}

export interface SubscribeValue {
  fields?: string[];
  macro?:"sum" | "concat" | "multiply" | "divide" | "subtract";
}

export type EventSubscriptionItemType = {
  event: string,
  option_api?: OptionApiType & { query_key: string },
  options?: OptionType[]
}