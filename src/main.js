import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io'
import RouteSocket from './js/RouteSocket'
import bus from './bus'
import ApiRest from './js/Api'
let Api = new ApiRest()
const DEBUG = true
Vue.config.productionTip = false
Vue.config.devtools=DEBUG
Vue.use(new VueSocketIO({
  debug: DEBUG,
  connection: RouteSocket,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
  // options: { path: "/my-app/" } //Optional options
}))
let old_console_log = console.log;
console.log = function() {
    if ( DEBUG ) {
        old_console_log.apply(this, arguments);
    }
}
new Vue({
  router,
  store,
  vuetify,
  sockets: {
    connect: function () {
        console.log('socket connected')
        
        Api.searchMachine().then(res=>{
          if(res.status){
            this.$socket.emit('register-machine', res.data[0].PC);
            console.log('MAQUINA GLOBAL',res.data[0].PC)
          }else{
            console.error('ERROR MAQUINA GLOBAL',res)
          }
          
        })

        bus.$on('error-machine',(data)=>{
          // console.log('event buuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuus',data)
          this.$socket.emit('error-machine',data);
        })

    },
    customEmit: function (data) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  render: h => h(App)
}).$mount('#app')
