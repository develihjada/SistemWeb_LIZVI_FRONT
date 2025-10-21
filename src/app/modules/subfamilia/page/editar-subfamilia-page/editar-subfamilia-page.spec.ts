import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSubfamiliaPage } from './editar-subfamilia-page';

describe('EditarSubfamiliaPage', () => {
  let component: EditarSubfamiliaPage;
  let fixture: ComponentFixture<EditarSubfamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarSubfamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSubfamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
