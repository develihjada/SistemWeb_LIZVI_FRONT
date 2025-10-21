import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSubfamiliaPage } from './detalle-subfamilia-page';

describe('DetalleSubfamiliaPage', () => {
  let component: DetalleSubfamiliaPage;
  let fixture: ComponentFixture<DetalleSubfamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleSubfamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSubfamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
