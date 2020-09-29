class Compile {
    constructor(vm) {
        this.vm = vm
        this.el = this.vm.$el
        this.compile(this.el)
    }
    //遍历所有节点，编译模板，处理文本节点和元素节点。
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                //处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node))
                //处理元素节点
                this.compileElement(node)
                //判断node节点是否还有子节点，如果是，则递归调用compile
                if(node.childNodes && node.childNodes.length){
                    this.compile(node)
                }
        })
    }
    //编译元素节点，处理指令
    compileElement(node) {
        Array.from(node.attributes).forEach(attr =>{
            let attrName = attr.name
            if(this.isDirective(attrName)){
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node,key,attrName)

                //判断是否是处理事件的指令
                if(this.isEventDirective(attrName)){
                    this.eventHandler(node,this.vm,attrName,key)
                }
            }
        })
    }

    eventHandler (node,vm,attrName,fnName) {
        let eventType = attrName.substr(attrName.indexOf(':')+1)
        let fn = this.vm.$options.methods && this.vm.$options.methods[fnName]
        console.log(eventType)
        fn && node.addEventListener(eventType, fn.bind(this.vm))
    }

    update(node,key,attrname){
        let updateFn = this[attrname+'Updater']
        //改变this指向
        updateFn && updateFn.call(this,node,this.vm[key], key)
    }



    textUpdater(node, value, key){
        node.textContent = value
        //创建watcher对象，当数据改变更新视图
        new Watcher(this.vm, key, (newValue) =>{
            node.textContent = newValue
        })
    }

    modelUpdater(node, value, key){
        node.value = value
        //创建watcher对象，当数据改变更新视图
        new Watcher(this.vm, key, (newValue) =>{
            node.value = newValue
        })
        //双向绑定
        node.addEventListener('input',() =>{
            this.vm[key] = node.value
        })
    }

    //编译文本节点，处理差值表达式
    compileText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)){
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            //创建watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) =>{
                node.textContent = newValue
            })
        }
    }
    //判断是否是处理事件的指令
    isEventDirective (attrName){
        return attrName.indexOf('on') === 0
    }
    //判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    //判断是否是文本节点
    isTextNode(node) {
        // console.log(node)
        return node.nodeType === 3
    }
    //判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}