import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchPipe } from '../main/products/pipes/search.pipe';

@NgModule({
  declarations: [NotFoundComponent, SearchPipe],
  imports: [CommonModule],
  exports: [NotFoundComponent, SearchPipe],
})
export class SharedModule {}
