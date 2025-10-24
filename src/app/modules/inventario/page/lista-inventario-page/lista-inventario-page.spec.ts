import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInventarioPage } from './lista-inventario-page';

describe('ListaInventarioPage', () => {
  let component: ListaInventarioPage;
  let fixture: ComponentFixture<ListaInventarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaInventarioPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInventarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
