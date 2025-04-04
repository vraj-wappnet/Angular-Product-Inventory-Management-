import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module'; // Import SharedModule instead
import { AdminModule } from './features/admin/admin.module';
import { NotificationComponent } from './shared/components/notification/notification.component';

@NgModule({
  declarations: [AppComponent, NotificationComponent],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    SharedModule,
    AdminModule,
    NotificationComponent,
    // AppointmentsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
