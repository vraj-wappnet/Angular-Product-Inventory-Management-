import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [HeaderComponent, NotificationComponent],
  imports: [CommonModule, FormsModule],
  exports: [HeaderComponent, NotificationComponent, CommonModule, FormsModule],
})
export class SharedModule {}
