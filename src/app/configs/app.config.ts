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
      // baseUrl: `http://52.206.130.36:8090`,
      //loginApi: `http://52.206.130.36:8090/validateUser`,
      baseUrl: `http://34.202.67.90:8090`,
      loginApi: `http://34.202.67.90:8090/validateUser`,
      // uploadApi: `http://52.206.130.36:8090/uploadSAPData`
  },
  ok:200,
  error: 'error'
};
