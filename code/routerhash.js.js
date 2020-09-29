let _Vue = null

export default class VueRouter {
    static install(Vue){
        //如果已经注册则不进行注册
        if(VueRouter.install.installed){
            return
        }
        VueRouter.install.installed = true
        //将Vue实例赋值给_Vue，拿到_Vue实例
        _Vue = Vue
        //添加混入，并在beforeCreate钩子函数里将vue实例选项里的router属性添加到Vue构造函数的原型上。
        _Vue.mixin({
            beforeCreate(){
                if(this.$options.router){
                    _Vue.prototype.$router = this.$options.router
                    //执行初始化方法，在$router上可以获取到vueRouter的实例，并执行init()方法
                    _Vue.prototype.$router.init()
                }
            }
        })
    }
    //创建构造函数，1）获取参数里的路由规则，2）创建地址与对应组件的映射关系的对象， 3）设置data，data为响应式，里面的current属性记录当前的路由路径
    constructor(options){
        this.routes = options.routes;
        this.routerMap = {}
        this.data = _Vue.observable({
            current : "/"
        })
    }
    //创建总的初始化方法
    init(){
        this.initRouterMap()
        this.initComponents(_Vue)
        this.initEvent()
    }
    //初始化routerMap，创建地址与组件的映射关系
    initRouterMap(){
        this.routes.forEach((route) =>{
            this.routerMap[route.path] = route.component
        })
    }
    //初始化router-link和router-view组件
    initComponents(Vue){
        Vue.component('router-link',{
            props:{
                to:String
            },
            render(h){
                return h('a',{
                    attrs: {
                        href: `/#${this.to}`
                    },
                },[this.$slots.default])
            }
        })
        let self = this
        Vue.component('router-view',{
            render(h){
                const component = self.routerMap[self.data.current]
                return h(component)
            }
        })
    }
    //添加hashchange时间监听，当hash变化时，找到该路径对应的组件，然后重新渲染。
    initEvent(){
        window.addEventListener('hashchange',() =>{
            if (window.location.hash ===''){
                this.data.current = '/'
            }else{
                this.data.current = window.location.hash.substr(1)
            }
        })
    }
}