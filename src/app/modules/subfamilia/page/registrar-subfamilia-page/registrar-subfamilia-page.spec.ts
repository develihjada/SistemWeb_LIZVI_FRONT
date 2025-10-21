import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSubfamiliaPage } from './registrar-subfamilia-page';

describe('RegistrarSubfamiliaPage', () => {
  let component: RegistrarSubfamiliaPage;
  let fixture: ComponentFixture<RegistrarSubfamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarSubfamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarSubfamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
