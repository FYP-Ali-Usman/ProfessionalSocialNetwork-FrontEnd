import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSearchComponent } from './after-search.component';

describe('AfterSearchComponent', () => {
  let component: AfterSearchComponent;
  let fixture: ComponentFixture<AfterSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
