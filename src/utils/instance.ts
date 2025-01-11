import singleton from "./singleton";

class InstanceCount {
    _count: number;
    constructor() {
      this._count = 0;
    }
    get count() {
      return this._count;
    }
    increment() {
      this._count += 1;
    }
    decrement() {
      this._count -= 1;
    }
}


export default function instanceCount():InstanceCount{
    const instanceCountName = "_instanceCount";
    return singleton<InstanceCount>(instanceCountName, new InstanceCount());
}
