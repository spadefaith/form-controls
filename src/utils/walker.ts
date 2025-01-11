
export default function walker(array, callback){
    return array.map(item=>{
        const {children} = item;
        if(children){
            return {
                ...item,
                children:children.map(child=>{
                    const {variants} = child;
                    if(variants){
                        return variants.map(variant=>{
                            const {controls} = variant;
                            if(controls){
                                return {
                                    ...variant,
                                    controls:controls.map(control=>{
                                        return callback(control);
                                    })
                                }
                            }
                            return variant;
                        })
                    }
                    return child
                })
            }
        };
        return callback(item);
    })
}