import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsGrantedDirective } from './directives/is-granted.directive';

@NgModule({
  declarations: [IsGrantedDirective],
  imports: [CommonModule],
  exports: [IsGrantedDirective],
})
export class SharedModule {}
