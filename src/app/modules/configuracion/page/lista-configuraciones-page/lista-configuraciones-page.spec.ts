import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConfiguracionesPage } from './lista-configuraciones-page';

describe('ListaConfiguracionesPage', () => {
  let component: ListaConfiguracionesPage;
  let fixture: ComponentFixture<ListaConfiguracionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaConfiguracionesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaConfiguracionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
