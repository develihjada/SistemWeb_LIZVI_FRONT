import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarClientesPage } from './editar-clientes-page';

describe('EditarClientesPage', () => {
  let component: EditarClientesPage;
  let fixture: ComponentFixture<EditarClientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarClientesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
