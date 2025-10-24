import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarClientesPage } from './registrar-clientes-page';

describe('RegistrarClientesPage', () => {
  let component: RegistrarClientesPage;
  let fixture: ComponentFixture<RegistrarClientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarClientesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
