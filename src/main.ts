import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './assets/main.css'
import App from './App.vue'

import zh from './locals/zh'
import ja from './locals/ja'
import en from './locals/en'


const i18n=createI18n({

    locale:"zh",

    messages:{
        zh,
        ja,
        en
    }

})


createApp(App)
    .use(i18n)
    .mount('#app')