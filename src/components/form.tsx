import { h } from "preact";
import { FormControlItemType } from "../../types";
import FormControl from "./form-control";
import { useMemo } from "preact/hooks";

const controlInputKey: FormControlItemType = {
  id: 1,
  tag: "input",
  label: "Key",
  properties: [
    {
      key: "type",
      value: "text",
    },
    {
      key: "placeholder",
      value: "key",
    },
    {
      key: "name",
      value: "key",
    },
  ],
};

const controlInputValue: FormControlItemType = {
  id: 1,
  tag: "input",
  label: "Value",
  properties: [
    {
      key: "type",
      value: "value",
    },
    {
      key: "placeholder",
      value: "value",
    },
    {
      key: "name",
      value: "value",
    },
  ],
};

const controlOptionApi: FormControlItemType = {
  id: 1,
  tag: "input",
  label: "Option API",
  properties: [
    {
      key: "type",
      value: "text",
    },
    {
      key: "name",
      value: "option_api",
    },
    {
      key: "placeholder",
      value: "option api",
    },
  ],
};
const controlOptionDefault: FormControlItemType = {
  id: 1,
  tag: "repeatable",
  label: "Options",
  properties: [
    {
      key: "type",
      value: "text",
    },
    {
      key: "name",
      value: "options",
    },
    {
      key: "placeholder",
      value: "options",
    },
  ],
  children: [
    {
      id: 1,
      tag: "input",
      label: "Label",
      properties: [
        {
          key: "type",
          value: "text",
        },
        {
          key: "name",
          value: "label",
        },
        {
          key: "placeholder",
          value: "label",
        },
      ],
    },
    {
      id: 1,
      tag: "input",
      label: "Value",
      properties: [
        {
          key: "type",
          value: "text",
        },
        {
          key: "name",
          value: "value",
        },
        {
          key: "placeholder",
          value: "value",
        },
      ],
    },
    {
      id: 1,
      tag: "check",
      label: "Is Selected",
      properties: [
        {
          key: "type",
          value: "checkbox",
        },
        {
          key: "name",
          value: "selected",
        },
      ],
    },
  ],
};

const selectOptionType: FormControlItemType = {
  id: 1,
  tag: "select",
  label: "Option Type",
  properties: [
    {
      key: "name",
      value: "option_type",
    },
  ],
  options: [
    {
      id: 1,
      label: "Default",
      value: "default",
    },
    {
      id: 1,
      label: "Api",
      value: "api",
    },
  ],
  variants: [
    {
      check_fn_str: "function (value){return value == 'default'}",
      ref_name: "option_type - default",
      controls: [controlOptionDefault],
    },
    {
      ref_name: "option_type - api",
      controls: [controlOptionApi],
    },
  ],
};

const orientationOption: FormControlItemType = {
  id: 4,
  tag: "select",
  label: "Orientation",
  properties: [
    {
      key: "type",
      value: "text",
    },
    {
      key: "name",
      value: "orientation",
    },
  ],
  options: [
    {
      id: 1,
      label: "Portrait",
      value: "portrait",
    },
    {
      id: 2,
      label: "Lanscape",
      value: "landscape",
    },
  ],
};

const controls: FormControlItemType[] = [
  {
    id: 1,
    tag: "select",
    label: "Tag",
    properties: [
      {
        key: "type",
        value: "text",
      },
      {
        key: "name",
        value: "tag",
      },
    ],
    options: [
      {
        id: 1,
        label: "Select",
        value: "select",
      },
      {
        id: 2,
        label: "Input",
        value: "input",
      },
      {
        id: 3,
        label: "Checkbox",
        value: "checkbox",
      },
      {
        id: 4,
        label: "Radio",
        value: "radio",
      },
      {
        id: 5,
        label: "Datalist",
        value: "datalist",
      },
      {
        id: 6,
        label: "Textarea",
        value: "textarea",
      },
      {
        id: 7,
        label: "Label",
        value: "label",
      },
      {
        id: 8,
        label: "Repeatable",
        value: "repeatable",
      },
      {
        id: 9,
        label: "Group",
        value: "group",
      },
      {
        id: 10,
        label: "Check",
        value: "check",
      },
    ],
    variants: [
      {
        check_fn_str: "function (value){return value == 'select'}",
        ref_name: "tag - select",
        controls: [selectOptionType],
      },
      {
        check_fn_str:
          "function (value){return ['checkbox','radio','group'].includes(value)}",
        ref_name: "tag - radio",
        controls: [orientationOption],
      },
    ],
  },
  {
    id: 2,
    tag: "input",
    label: "Label",
    properties: [
      {
        key: "placeholder",
        value: "label",
      },
      {
        key: "type",
        value: "text",
      },
      {
        key: "name",
        value: "label",
      },
    ],
  },
  {
    id: 3,
    tag: "repeatable",
    label: "Properties",
    properties: [
      {
        key: "type",
        value: "text",
      },
      {
        key: "name",
        value: "properties",
      },
    ],
    children: [controlInputKey, controlInputValue],
  },
];

const variantControl: FormControlItemType = {
  id: 3,
  tag: "repeatable",
  label: "Variants",
  properties: [
    {
      key: "type",
      value: "text",
    },
    {
      key: "name",
      value: "variants",
    },
  ],
  children: [
    {
      id: 1,
      tag: "input",
      label: "Check Function",
      properties: [
        {
          key: "type",
          value: "text",
        },
        {
          key: "placeholder",
          value: "check function",
        },
        {
          key: "name",
          value: "check_fn_str",
        },
      ],
    },
    {
      id: 1,
      tag: "input",
      label: "Ref Name",
      properties: [
        {
          key: "type",
          value: "text",
        },
        {
          key: "placeholder",
          value: "ref name",
        },
        {
          key: "name",
          value: "ref_name",
        },
      ],
    },
    {
      id: 3,
      tag: "repeatable",
      label: "Controls",
      properties: [
        {
          key: "type",
          value: "text",
        },
        {
          key: "name",
          value: "controls",
        },
      ],
      children: controls,
    },
  ],
};

const allControls = [...controls, variantControl];

export default function Form(props: { data: any }) {
  const formControls = useMemo(() => {
    return allControls;
  }, [props.data]);

  return (
    <form>
      <FormControl controls={formControls} data={props.data} />
      <button type="submit" class="btn btn-success">
        Submit
      </button>
    </form>
  );
}
