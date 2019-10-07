import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSearchComponent } from './other-search.component';

describe('OtherSearchComponent', () => {
  let component: OtherSearchComponent;
  let fixture: ComponentFixture<OtherSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
