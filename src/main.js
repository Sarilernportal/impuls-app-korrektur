import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'v-calendar/dist/style.css'
import router from './router'
import store from './store'
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports.js'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

// Configure the AWS Amplify backend
Amplify.configure(aws_exports)

createApp(App).use(store).use(router).mount('#app')
