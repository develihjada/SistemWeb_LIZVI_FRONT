import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFamiliaPage } from './detalle-familia-page';

describe('DetalleFamiliaPage', () => {
  let component: DetalleFamiliaPage;
  let fixture: ComponentFixture<DetalleFamiliaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleFamiliaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFamiliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
