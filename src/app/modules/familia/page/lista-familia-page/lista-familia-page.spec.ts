import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaFamiliaPage } from './lista-familia-page';

describe('ListaFamiliaPage', () => {
  let component: ListaFamiliaPage;
  let fixture: ComponentFixture<ListaFamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaFamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaFamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
