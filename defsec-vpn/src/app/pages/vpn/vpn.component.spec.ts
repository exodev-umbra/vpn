import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpnComponent } from './vpn.component';

describe('VpnComponent', () => {
  let component: VpnComponent;
  let fixture: ComponentFixture<VpnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
