import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDatos } from './loading-datos';

describe('LoadingDatos', () => {
  let component: LoadingDatos;
  let fixture: ComponentFixture<LoadingDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingDatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingDatos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
