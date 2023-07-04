import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcourListComponent } from './parcour-list.component';

describe('ParcourListComponent', () => {
  let component: ParcourListComponent;
  let fixture: ComponentFixture<ParcourListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcourListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
