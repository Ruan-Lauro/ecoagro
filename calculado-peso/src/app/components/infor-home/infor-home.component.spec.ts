import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforHomeComponent } from './infor-home.component';

describe('InforHomeComponent', () => {
  let component: InforHomeComponent;
  let fixture: ComponentFixture<InforHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InforHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InforHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
