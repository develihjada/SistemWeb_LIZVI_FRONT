import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRolesPage } from './lista-roles-page';

describe('ListaRolesPage', () => {
  let component: ListaRolesPage;
  let fixture: ComponentFixture<ListaRolesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaRolesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaRolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
