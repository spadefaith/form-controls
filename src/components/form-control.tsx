import { h, Fragment } from "preact";
import { FormControlItemType } from "../../types";
import Input from "./input";
import Textarea from "./textarea";
import Label from "./label";
import Select from "./select";
import Datalist from "./data-list";
import CheckboxGroup from "./checkbox-group";
import RadioGroup from "./radio-group";
import Repeatable from "./repeatable";
import InputCheck from "./input-check";
import FormGroup from "./form-group";
import { useEffect } from "preact/hooks";
import Row from "./row";
import Col from "./col";
import useData from "../hooks/data";
import useControls from "../hooks/controls";
import instanceCount from "../utils/instance";
import caches from "../utils/caches";

export default function FormControl(props: {
  controls?: FormControlItemType[];
  data?: any;
  cache?: string;
  retry?: string;
  is_from_repeatable?: boolean;
  is_view?: boolean;
}) {
  const { data } = useData(props.data);
  const { controls } = useControls(props.controls, data.value);


  useEffect(() => {
    instanceCount().increment();
    return () => {
      if (instanceCount().count > 0) {
        instanceCount().decrement();
      }
      caches().clear();
    }
  }, [])

  return (
    <>
      {controls.value.map((ctrl) => {
        let { control, child, id } = ctrl;
        if (control.tag == "group") {
          return (
            <FormGroup
              key={id}
              col={child.length}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            >
              <FormControl
                controls={child}
                data={data.value}
                is_from_repeatable={props.is_from_repeatable}
                is_view={props.is_view}
              />
            </FormGroup>
          );
        } else if (control.tag == "row") {
          return (
            <Row
              key={id}
              col={child.length}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            >
              <FormControl
                controls={child}
                data={data.value}
                is_from_repeatable={props.is_from_repeatable}
                is_view={props.is_view}
              />
            </Row>
          );
        } else if (control.tag == "col") {
          return <Col
            key={id}
            {...control}
          >
            <FormControl
              controls={child}
              data={data.value}
              is_from_repeatable={props.is_from_repeatable}
              is_view={props.is_view}
            />
          </Col>
        } else if (["input", "mobile", "input-inline"].includes(control.tag)) {
          return (
            <Input
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else if (control.tag == "check") {
          return (
            <InputCheck
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else if (control.tag == "textarea") {
          return (
            <Textarea
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else if (control.tag == "label") {
          return <Label key={id} label={control.label} name={control.name} />;
        } else if (["select", "select-inline"].includes(control.tag)) {
          // console.log(control.name, data.value);
          return (
            <Select
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
            // <></>
          );
        } else if (control.tag == "datalist") {
          return (
            <Datalist
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else if (control.tag == "checkbox") {
          return (
            <CheckboxGroup
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else if (control.tag == "radio") {
          return (
            <RadioGroup
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else if (control.tag == "repeatable") {

          return (
            <Repeatable
              key={id}
              data={data.value}
              is_view={props.is_view}
              is_from_repeatable={props.is_from_repeatable}
              {...control}
            />
          );
        } else {
          return <></>;
        }
      })}
    </>
  );
}
