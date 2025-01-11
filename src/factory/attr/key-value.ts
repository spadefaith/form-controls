

export default class KeyValue {
    store:any
    data:any
    constructor(){
        this.data = [];
    }
    set(key, value){
        this.data.push({key, value});
    }
    build(){
        return this.data;
    }
}