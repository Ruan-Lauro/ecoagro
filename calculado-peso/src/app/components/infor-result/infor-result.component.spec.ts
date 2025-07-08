import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforResultComponent } from './infor-result.component';

describe('InforResultComponent', () => {
  let component: InforResultComponent;
  let fixture: ComponentFixture<InforResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InforResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InforResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
