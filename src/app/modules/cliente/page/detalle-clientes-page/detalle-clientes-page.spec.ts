import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleClientesPage } from './detalle-clientes-page';

describe('DetalleClientesPage', () => {
  let component: DetalleClientesPage;
  let fixture: ComponentFixture<DetalleClientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleClientesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
