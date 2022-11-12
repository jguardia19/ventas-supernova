import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme:{
        themes:{
            light:{
                primary:'#2057a5',
                ticket:"#2057a5",
                light:"#ffffff"
            },
            dark:{
              primary:'#0288D1',
              ticket:"#18FFFF",
              light:"#1E1E1E"
            }
        }
    }
});
