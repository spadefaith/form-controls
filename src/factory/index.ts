import appendAttr from "./attr/append";

export default class ControlBuilder {
    store :any;
    constructor(){
        this.store = {};
    }
    name(name: string){
        appendAttr(this.store,"name", name);
        return this;
    }
    type(type: string){
        appendAttr(this.store,"type", type);
        return this;
    }
    label(label: string){
        appendAttr(this.store,"label", label);
        return this;
    }
    placeholder(placeholder: string){
        appendAttr(this.store,"placeholder", placeholder);
        return this;
    }
    tag(tag: string){
        appendAttr(this.store,"tag", tag);
        return this;
    }
    properties(properties: any){
        appendAttr(this.store,"properties", properties);
        return this;
    }
    responsive(responsive: any){
        appendAttr(this.store,"responsive", responsive);
        return this;
    }
    children(children: any){
        appendAttr(this.store,"children", children);
        return this;
    }
    options(option: any){
        appendAttr(this.store,"options", option);
        return this;
    }
    optionApi(optionApi: any){
        appendAttr(this.store,"option_api", optionApi);
        return this;
    }
    variants(variants: any){
        appendAttr(this.store,"variants", variants);
        return this;
    }
    classes(classes: any){
        appendAttr(this.store,"classes", classes);
        return this;
    }
    events(events: any){
        appendAttr(this.store,"events", events);
        return this
    }
    build(){
        return this.store;
    }
}


/**
 * const formControls = new ControlBuilder();
 * formControls
 *  .name("first_name")
 *  .type("text")
 *  .label("First Name")
 *  .placeholder("Enter your first name")
 *  .build();
 */