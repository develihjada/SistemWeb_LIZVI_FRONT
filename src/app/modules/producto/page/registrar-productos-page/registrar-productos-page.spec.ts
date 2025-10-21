import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProductosPage } from './registrar-productos-page';

describe('RegistrarProductosPage', () => {
  let component: RegistrarProductosPage;
  let fixture: ComponentFixture<RegistrarProductosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarProductosPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
