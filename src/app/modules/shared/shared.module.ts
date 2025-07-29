import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsGrantedDirective } from './directives/is-granted.directive';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [IsGrantedDirective, NotFoundComponent],
  imports: [CommonModule],
  exports: [IsGrantedDirective, NotFoundComponent],
})
export class SharedModule {}
