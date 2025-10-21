import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFamiliaPage } from './editar-familia-page';

describe('EditarFamiliaPage', () => {
  let component: EditarFamiliaPage;
  let fixture: ComponentFixture<EditarFamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarFamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarFamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
