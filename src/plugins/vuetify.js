import Vue from 'vue';
import Vuetify, { colors } from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.teal,
    secondary: '#808080',
    accent: '#00cccc',
    error: '#ff0040',
    info: '#2196F3',
    success: '#00cc66',
    warning: '#ff9933',
    darkgrey: '#2e2e2e',
    background: colors.grey.lighten4,
  },
});
