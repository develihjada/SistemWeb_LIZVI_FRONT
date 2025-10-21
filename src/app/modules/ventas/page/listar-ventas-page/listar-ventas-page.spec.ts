import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarVentasPage } from './listar-ventas-page';

describe('ListarVentasPage', () => {
  let component: ListarVentasPage;
  let fixture: ComponentFixture<ListarVentasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarVentasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
