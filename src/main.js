import Vue from 'vue'
import App from './App'
import utilRequest from './utils/request'

Vue.config.productionTip = false

Vue.prototype.request = utilRequest.request;
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
