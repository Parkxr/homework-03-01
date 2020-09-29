#####1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})

答：可以通过this.$set(this.dog,'name,'Trump')来实现。其内部的原理是将该属性添加到观察者数组里，然后将新增属性设置成响应式数据，然后手动触发dep.notify()方法。

#####2、请简述 Diff 算法的执行过程

答：
