export class HttpRequestProxy {
    constructor(obj){
        this.obj = obj;
    }

    getProxyInstance(){
        return new Proxy(this.obj, this.handler);
    }

    handler(target, propKey, receiver) {
        const targetValue = Reflect.get(target, propKey, receiver);
        if (typeof targetValue === 'function') {
            return function (...args) {
                console.log('Calling: ', propKey, args);
                return targetValue.apply(this, args);
            }
        } else {
            return targetValue;
        }
    }
}
