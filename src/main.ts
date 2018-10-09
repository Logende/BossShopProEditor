import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// @ts-ignore
import SemanticUI from 'semantic-ui-vue';
Vue.use(SemanticUI);
import 'semantic-ui-css/semantic.min.css';
import YAMLJS from 'yamljs';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
