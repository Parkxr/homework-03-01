class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        //判断data是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        //遍历data对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        var that = this
        //负责收集依赖，并发送通知
        let dep = new Dep()
        //如果val是对象，则把val内部的属性转换成响应式数据
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                //收集依赖
                Dep.target && dep.addSub(Dep.target)
                //这里不能设置成obj[key]，否则会发生堆栈溢出的错误
                return val
            },
            set(newValue) {
                if (obj[key] === newValue) {
                    return
                }
                val = newValue
                console.log(this)
                //如果把data中的属性设置成对象类型的，需要把该对象也设置成响应式数据
                that.walk(val)
                //发送通知
                dep.notify()
            }
        })
    }
}