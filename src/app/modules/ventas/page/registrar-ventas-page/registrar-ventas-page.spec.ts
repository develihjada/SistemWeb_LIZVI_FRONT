import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarVentasPage } from './registrar-ventas-page';

describe('RegistrarVentasPage', () => {
  let component: RegistrarVentasPage;
  let fixture: ComponentFixture<RegistrarVentasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarVentasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
