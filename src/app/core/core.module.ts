import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionTimeOutComponent } from './modals/session-time-out/session-time-out.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  
  imports: [
    CommonModule,
    NgbModule
  ],
  entryComponents: [SessionTimeOutComponent],
  declarations: [SessionTimeOutComponent]
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
