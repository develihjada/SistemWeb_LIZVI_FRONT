import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorConexionApi } from './error-conexion-api';

describe('ErrorConexionApi', () => {
  let component: ErrorConexionApi;
  let fixture: ComponentFixture<ErrorConexionApi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorConexionApi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorConexionApi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
