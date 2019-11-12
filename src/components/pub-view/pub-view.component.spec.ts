import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubViewComponent } from './pub-view.component';

describe('PubViewComponent', () => {
  let component: PubViewComponent;
  let fixture: ComponentFixture<PubViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
