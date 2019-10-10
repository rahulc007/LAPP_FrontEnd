import {InjectionToken} from '@angular/core';
import {environment} from '../../environments/environment';

export let APP_CONFIG = new InjectionToken('app.config');


//const apiBaseIntegrationUrl = environment.apiBaseIntegrationUrl;

export const AppConfig: any = {
  routes: {
    heroes: 'heroes',
    error404: '404'
  },
  endpoints: {  
       baseUrl: `http://18.222.218.117:8090`,
      loginApi: `http://18.222.218.117:8090/validateUser`,
      uploadApi: `http://18.222.218.117:8090/uploadSAPData`
  },
  ok:200,
  error: 'error'
};
