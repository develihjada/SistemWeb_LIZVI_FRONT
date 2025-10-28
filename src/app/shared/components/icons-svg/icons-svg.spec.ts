import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsSvg } from './icons-svg';

describe('IconsSvg', () => {
  let component: IconsSvg;
  let fixture: ComponentFixture<IconsSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsSvg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsSvg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
