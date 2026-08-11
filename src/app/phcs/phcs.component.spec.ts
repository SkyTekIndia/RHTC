import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhcsComponent } from './phcs.component';

describe('PhcsComponent', () => {
  let component: PhcsComponent;
  let fixture: ComponentFixture<PhcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
