// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI);
Vue.use(VueResource);
Vue.config.productionTip = false;

// 为Date增加格式化日期的函数
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季
    "S": this.getMilliseconds() //毫秒
  };
  let week = {
    "0": "\u65e5",
    "1": "\u4e00",
    "2": "\u4e8c",
    "3": "\u4e09",
    "4": "\u56db",
    "5": "\u4e94",
    "6": "\u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

Vue.filter('dateFormat', function (value, pattern) {
  let date = null;
  if (null === value || typeof value === 'undefined') {
    return '';
  } else {
    date = new Date(value);
  }
  return date.format(pattern);
});

router.beforeEach((to, from, next) => {
  // if (to.meta.requireAuth) {
  //   let token = sessionStorage.getItem('token');
  //   let userData = sessionStorage.getItem('userData');
  //   if (null !== token && typeof token !== 'undefined' && '' !== token && null !== userData && typeof userData !== 'undefined' && '' !== userData) {
  //     next();
  //   } else {
  //     next({
  //       path: '/login',
  //       query: { redirect: to.fullPath },
  //     });
  //   }
  // } else {
  //   next();
  // }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
