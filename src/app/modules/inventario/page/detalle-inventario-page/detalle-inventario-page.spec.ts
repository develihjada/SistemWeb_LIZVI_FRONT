import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleInventarioPage } from './detalle-inventario-page';

describe('DetalleInventarioPage', () => {
  let component: DetalleInventarioPage;
  let fixture: ComponentFixture<DetalleInventarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleInventarioPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleInventarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
