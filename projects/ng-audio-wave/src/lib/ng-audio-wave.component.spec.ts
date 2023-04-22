import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAudioWaveComponent } from './ng-audio-wave.component';

describe('NgAudioWaveComponent', () => {
  let component: NgAudioWaveComponent;
  let fixture: ComponentFixture<NgAudioWaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgAudioWaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgAudioWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
