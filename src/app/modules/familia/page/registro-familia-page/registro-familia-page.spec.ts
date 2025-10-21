import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFamiliaPage } from './registro-familia-page';

describe('RegistroFamiliaPage', () => {
  let component: RegistroFamiliaPage;
  let fixture: ComponentFixture<RegistroFamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroFamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroFamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
