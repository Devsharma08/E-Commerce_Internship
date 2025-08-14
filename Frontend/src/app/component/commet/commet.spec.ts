import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commet } from './commet';

describe('Commet', () => {
  let component: Commet;
  let fixture: ComponentFixture<Commet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
