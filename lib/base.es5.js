function Base() {
    this.events = {}
}
Base.extend = function (prototype, staticProperties) {
    var Parent = this;
    var Child = Object.assign(function(){
        // slice 方法可以用来将一个类数组（Array-like）对象/集合转换成一个数组。你只需将该方法绑定到这个对象上。
    // 参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    // var argsArr = Array.prototype.slice.call(arguments);
    // 从 ES5 开始 apply 第二个参数可以接受类数组对象，参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
        Parent.apply(this, arguments)
    }, Parent, staticProperties)
    Child.prototype = Object.create(Parent.prototype, {
        constructor: {
            configurable: true,
            enumerable: true,
            value: Child,
            writable: true
        }
    });
    Child.prototype = Object.assign(Child.prototype, prototype)
    return Child;
}

Base.prototype.on = function(types, fn){
    if(typeof types === "object"){
        for(var type in types){
            this.on(type, types[type])
        }
    }else if(typeof types === "string"){
        this.events[types] = fn.bind(this);
    }
}

Base.prototype.trigger = function(types, value){
    if(typeof types === "object"){
        for(var type in types){
            this.trigger(type, types[type])
        }
    }else if(typeof types === "string"){
        this.events[types](value)
    }
}
// 浅拷贝 assign 的 Polyfill
// 参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if(typeof Object.assign !== "function"){
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs){
            "use strict";
            if(target === null){
                throw new TypeError("cannot convert undefined or null to object");
            }

            var to = Object(target);
            for(var index = 1; index < arguments.length; index++){
                var nextSource = arguments[index];
                if(nextSource != null){
                    for(var nextKey in nextSource){
                        if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)){
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

module.exports = Base