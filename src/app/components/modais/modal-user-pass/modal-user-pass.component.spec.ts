import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserPassComponent } from './modal-user-pass.component';

describe('ModalUserPassComponent', () => {
  let component: ModalUserPassComponent;
  let fixture: ComponentFixture<ModalUserPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUserPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUserPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
