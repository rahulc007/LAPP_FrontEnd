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
      loginApi: `http://3.17.182.133:8090/validateUser`,
      uploadApi: `http://3.17.182.133:8090/uploadSAPData`
  },
  votesLimit: 3,
  topHeroesLimit: 4,
  snackBarDuration: 3000,
  repositoryURL: '/'
};
