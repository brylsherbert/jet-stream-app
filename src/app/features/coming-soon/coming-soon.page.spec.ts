import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonPage } from './coming-soon.page';

describe('Tab2Page', () => {
  let component: ComingSoonPage;
  let fixture: ComponentFixture<ComingSoonPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ComingSoonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
