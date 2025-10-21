import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSubfamiliaPage } from './listar-subfamilia-page';

describe('ListarSubfamiliaPage', () => {
  let component: ListarSubfamiliaPage;
  let fixture: ComponentFixture<ListarSubfamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSubfamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarSubfamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
