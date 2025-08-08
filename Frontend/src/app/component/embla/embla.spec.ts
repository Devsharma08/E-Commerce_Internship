import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Embla } from './embla';

describe('Embla', () => {
  let component: Embla;
  let fixture: ComponentFixture<Embla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Embla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Embla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
