import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCartItemsComponent } from './display-cart-items.component';

describe('DisplayCartItemsComponent', () => {
  let component: DisplayCartItemsComponent;
  let fixture: ComponentFixture<DisplayCartItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayCartItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayCartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
