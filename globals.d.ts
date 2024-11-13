declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "x-select": any;
      "x-input": any;
      "x-datalist": any;
      "x-form-child-controls": any;
      "x-textarea": any;
      "x-label": any;
      "x-form-group": any;
      "x-checkbox": any;
      "x-radio": any;
      "x-form": any;
      "x-form-control": any;
    }
  }
}

// This empty export is important! It tells TS to treat this as a module
export {};
