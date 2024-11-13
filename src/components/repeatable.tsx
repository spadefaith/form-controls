import { h, Fragment } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useSignal, useSignalEffect } from "@preact/signals";
import {
  filterObj,
  generateUniqueId,
  getFormData,
  restructureControls,
} from "../utils";
import FormControl from "./form-control";
import { submitSignal } from "../signals";

export default function Repeatable(props: {
  name?: string;
  label: string;
  value?: string | number;
  options: any;
  placeholder: any;
  variants: any;
  is_view?: boolean;
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
  values?: any[];
  children: any[];
  orientation: string;
  tag?: string;
  is_from_repeatable?: boolean;
  data: any;
}) {
  const uniqueId = useSignal(generateUniqueId());
  const datas = useSignal([]);

  const viewDatas = useSignal([]);
  const formRef = useRef<any>(null);
  const formControls = useSignal(props?.children || []);
  useEffect(() => {
    const values: any = (props?.data || {})[props.name];

    if (values?.length) {
      /**
       * for some reason, it is not re-rendering if the values is assigned to datas.value;
       * that is why viewDatas.value is used, to trigger re-rendering
       */

      viewDatas.value = values.map((value) => restructureControls(value));

      console.log("repeatable receives values");
    }
  }, [props.data]);

  useEffect(() => {
    if (!submitSignal?.value?.id) {
      return;
    }
    /**
     * get children repeatable
     * and empty it upon submission
     */

    const target = document.getElementById(submitSignal?.value?.id);

    if (!target) {
      return;
    }

    const container = target.closest(".repeatable-content");
    if (!container) {
      return;
    }

    const repeatableTarget = container.querySelectorAll(
      "[data-type=repeatable]"
    );

    Array.from(repeatableTarget).forEach((form: HTMLFormElement) => {
      if (
        form.name != submitSignal.value.id &&
        uniqueId.value != submitSignal.value.id
      ) {
        datas.value = [];
      }
    });
  }, [submitSignal.value]);

  const deleteHandler = (e) => {
    const target = e.target;
    const key = target.dataset.key;
    const id = target.dataset.id;

    datas.value = datas.value.reduce((accu, item, index) => {
      if (id != index) {
        accu.push(item);
      }

      return accu;
    }, []);

    viewDatas.value = datas.value;
  };

  const addHandler = (e) => {
    e.preventDefault();
    const data = getFormData(formRef.current, {
      key: "data-name",
    });

    const reConstructControls = restructureControls(formControls.value);

    const controls = Object.keys(data).reduce((accu, key) => {
      let value = data[key];
      try {
        value = JSON.parse(value);
      } catch (err) {}

      accu[key] = value;

      return accu;
    }, {});

    datas.value = [...datas.value, controls];
    viewDatas.value = datas.value.map((item) => {
      const controls = [];
      reConstructControls.forEach((control) => {
        controls.push({
          ...control,
          value: item[control.name],
        });
      });

      return controls;
    });

    formRef.current.reset();

    submitSignal.value = { id: uniqueId.value };
  };

  return (
    <div class="repeatable-container card my-3">
      <div class="repeatable-content card-body">
        <fieldset>
          <legend>{props.label}</legend>

          {viewDatas.value.map((item, index) => {
            const value = item.reduce((accu, iter) => {
              accu[iter.name] = iter.value;
              return accu;
            }, {});
            console.log("rendering datas.value");

            return (
              <details>
                <summary>{`${props.label} - ${index + 1}`}</summary>
                <div>
                  <FormControl
                    controls={item}
                    data={value}
                    key={`values-${generateUniqueId()}`}
                    is_from_repeatable={true}
                    is_view={true}
                  />
                  <br />
                  <button
                    type="button"
                    onClick={deleteHandler}
                    data-id={index}
                    class="btn btn-danger"
                  >
                    Remove
                  </button>
                  <div style="height:50px"></div>
                </div>
              </details>
            );
          })}

          {!props.is_view && (
            <details>
              <summary>{props.label} Form</summary>
              <form
                onSubmit={addHandler}
                ref={formRef}
                name={uniqueId.value}
                id={uniqueId.value}
                data-type="repeatable"
              >
                <FormControl
                  controls={formControls.value}
                  key="form-values"
                  is_from_repeatable={true}
                />
                <br />
                <button type="reset" class="btn btn-warning">
                  Reset
                </button>
                &nbsp;
                <button type="submit" class="btn btn-success">
                  Submit
                </button>
              </form>
              <input
                type="hidden"
                id={props.name}
                {...(props.is_from_repeatable
                  ? { "data-name": props.name }
                  : { name: props.name })}
                value={JSON.stringify(datas.value)}
                data-tag={props.tag}
              />
            </details>
          )}
          {props.is_view && !viewDatas.value.length ? (
            <details>
              <summary>empty</summary>
            </details>
          ) : (
            <></>
          )}
        </fieldset>
      </div>
    </div>
  );
}
