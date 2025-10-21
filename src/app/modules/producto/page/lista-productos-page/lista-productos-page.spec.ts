import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductosPage } from './lista-productos-page';

describe('ListaProductosPage', () => {
  let component: ListaProductosPage;
  let fixture: ComponentFixture<ListaProductosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductosPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
