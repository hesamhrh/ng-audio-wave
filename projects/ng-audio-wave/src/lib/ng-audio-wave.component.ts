import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

@Component({
  selector: 'ng-audio-wave',
  templateUrl: './ng-audio-wave.component.html',
  styleUrls: ['./ng-audio-wave.component.css'],
})
export class NgAudioWaveComponent implements AfterViewInit, OnDestroy {
  @Input() audioSrc: string = '';
  @Input() options = {
    height: 100,
    barLineWidth: 2,
    barLineSpaceBetween: 1,
    barLineColor: 'rgba(69, 123, 157, 0.3)',
    barLineProgressColor: '#E42535',
    barLineHoverColor: 'rgba(228, 37, 53, 0.3)',
  };

  width = 0;
  get barLineCount(): number {
    return (
      Math.floor(
        this.width /
          (this.options.barLineWidth + this.options.barLineSpaceBetween)
      ) - 1
    );
  }

  @ViewChild('audioCanvas') audioCanvas!: ElementRef<HTMLCanvasElement>;
  drawingContext: CanvasRenderingContext2D | null = null;
  waveContext: CanvasRenderingContext2D | null = null;
  hlWaveContext: CanvasRenderingContext2D | null = null;
  hoverWaveContext: CanvasRenderingContext2D | null = null;

  playTimer: ReturnType<typeof setTimeout> = null!;
  playStart = 0;
  previousPlayTime = 0;
  playTime = 0;

  audioContext: AudioContext = new AudioContext();
  audioSource: AudioBufferSourceNode = this.audioContext.createBufferSource();
  audioBuffer: AudioBuffer = this.audioContext.createBuffer(2, 44100, 44100);
  sampledData: number[] = [];

  loaded: boolean = false;
  playing: boolean = false;
  isAudioAvailable: boolean = false;
  isLoading: boolean = true;

  mouseX: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  @HostListener('window:resize', ['$event'])
  onResizeHandler(): void {
    this.width = this.elementRef.nativeElement.offsetWidth;
    this.audioCanvas.nativeElement.width = this.width;
    if (this.loaded) {
      this.generateWaveFormLayout();
    }
  }

  ngAfterViewInit(): void {
    this.onResizeHandler();
    if (isPlatformBrowser(this.platformId)) {
      this.createWaveformAndAudioPlayer();
    }
  }

  createWaveformAndAudioPlayer() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.drawingContext = this.audioCanvas.nativeElement.getContext('2d');
    this.audioCanvas.nativeElement.width = this.width;
    this.loadAudioFile();
  }

  loadAudioFile(): void {
    const request = new XMLHttpRequest();
    request.open('GET', this.audioSrc, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      if (request.status === 200) {
        this.isAudioAvailable = true;
        this.audioContext.decodeAudioData(
          request.response,
          (decodedData: AudioBuffer) => {
            this.audioBuffer = decodedData;
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.connect(this.audioContext.destination);
            this.cd.detectChanges();
            this.generateWaveFormLayout();
          }
        );
      } else {
        this.isAudioAvailable = false;
        this.isLoading = false;
      }
    };
    request.send();
  }

  generateWaveFormLayout(): void {
    this.setAudioBufferSamples(this.audioBuffer.getChannelData(0));
    this.generateLayers();
    this.loaded = true;
    this.drawCanvas();
  }

  setAudioBufferSamples(audioBuffer: Float32Array) {
    this.sampledData = [];

    const blockSize = Math.floor(audioBuffer.length / this.barLineCount);

    for (let i = 0; i < this.barLineCount; i++) {
      const blockStart = blockSize * i;
      let avgSample = 0;
      for (let j = 0; j < blockSize; j++) {
        avgSample += Math.abs(audioBuffer[blockStart + j]);
      }
      const scaledSample = avgSample / blockSize;
      this.sampledData.push(scaledSample);
    }

    const multiplier = Math.pow(Math.max(...this.sampledData), -1);
    this.sampledData = this.sampledData.map(
      (n) => n * multiplier * this.options.height
    );
  }

  generateLayers(): void {
    const waveCanvas = this.createCanvas(this.width, this.options.height);
    const hlWaveCanvas = this.createCanvas(this.width, this.options.height);
    const hoverWaveCanvas = this.createCanvas(this.width, this.options.height);
    this.waveContext = this.setCanvasContext(waveCanvas);
    this.hlWaveContext = this.setCanvasContext(hlWaveCanvas);
    this.hoverWaveContext = this.setCanvasContext(hoverWaveCanvas);

    let currentX = 0;

    this.sampledData.forEach((data, index) => {
      const scaledSample = data;
      this.createBarLine(
        this.waveContext,
        currentX,
        (this.options.height - scaledSample) / 2,
        this.options.barLineWidth,
        scaledSample,
        this.options.barLineColor
      );
      this.createBarLine(
        this.hlWaveContext,
        currentX,
        (this.options.height - scaledSample) / 2,
        this.options.barLineWidth,
        scaledSample,
        this.options.barLineProgressColor
      );
      this.createBarLine(
        this.hoverWaveContext,
        currentX,
        (this.options.height - scaledSample) / 2,
        this.options.barLineWidth,
        scaledSample,
        this.options.barLineHoverColor
      );
      currentX += this.options.barLineWidth + this.options.barLineSpaceBetween;
    });
  }

  createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  setCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    return canvas.getContext('2d');
  }

  createBarLine(
    ctx: CanvasRenderingContext2D | null,
    upperLeftCornerX: number,
    upperLeftCornerY: number,
    width: number,
    height: number,
    color: string
  ): void {
    if (ctx) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
      ctx.restore();
    }
  }

  drawCanvas(): void {
    const backCanvas = document.createElement('canvas');
    backCanvas.width = this.width;
    backCanvas.height = this.options.height;
    const backContext = backCanvas.getContext('2d');

    if (backContext) {
      backContext.clearRect(0, 0, this.width, this.options.height);
      if (this.loaded) {
        let waveImage!: ImageData;
        let hlWaveImage!: ImageData;
        let hoverWaveImage!: ImageData;

        if (this.waveContext) {
          waveImage = this.waveContext.getImageData(
            0,
            0,
            this.width,
            this.options.height
          );
          backContext.putImageData(waveImage, 0, 0);
        }

        if (this.hlWaveContext) {
          hlWaveImage = this.hlWaveContext.getImageData(
            0,
            0,
            this.width,
            this.options.height
          );
          const hlWaveX =
            (this.width / this.audioBuffer.duration) * this.playTime;
          backContext.putImageData(
            hlWaveImage,
            0,
            0,
            0,
            0,
            hlWaveX,
            this.options.height
          );

          if (this.mouseX > hlWaveX && this.hoverWaveContext) {
            hoverWaveImage = this.hoverWaveContext.getImageData(
              0,
              0,
              this.width,
              this.options.height
            );
            backContext.putImageData(
              hoverWaveImage,
              0,
              0,
              hlWaveX,
              0,
              this.mouseX - hlWaveX,
              this.options.height
            );
          }
        }

        if (this.drawingContext) {
          const image = backContext.getImageData(
            0,
            0,
            this.width,
            this.options.height
          );
          this.drawingContext.putImageData(image, 0, 0);
        }
      }
    }
  }

  waveFormMouseMove(event: MouseEvent): void {
    const target = event.target as Element;
    this.mouseX = event.clientX - target.getBoundingClientRect().left;
    this.drawCanvas();
  }

  waveFormMouseLeave(): void {
    this.mouseX = 0;
    this.drawCanvas();
  }

  waveFormClick(): void {
    const selectedTime =
      this.mouseX > 0
        ? (this.mouseX * this.audioBuffer.duration) / this.width
        : 0;

    if (this.playing) {
      this.pause();
    }

    this.playTime = selectedTime;
    this.play();
  }

  togglePlay(): void {
    if (!this.playing) {
      this.play();
    } else {
      this.pause();
    }
  }

  play(): void {
    if (this.loaded && !this.playing) {
      // Create new audio source and connect to output
      this.audioSource = this.audioContext.createBufferSource();
      this.audioSource.buffer = this.audioBuffer;
      this.audioSource.connect(this.audioContext.destination);

      // Start playback from current time
      this.audioSource.start(0, this.playTime);

      // Set playing to true and start timer
      this.playing = true;
      this.playStart = Date.now(); // set start time of playback
      this.previousPlayTime = this.playTime;
      this.playTimer = setInterval(() => {
        // Calculate playtime
        const currentTime = Date.now();
        let elapsedTimeInSeconds = (currentTime - this.playStart) / 1000;
        this.playTime = elapsedTimeInSeconds + this.previousPlayTime;

        // Draw canvas
        this.drawCanvas();

        // End playback if necessary
        if (this.playTime >= this.audioBuffer.duration) {
          this.onAudioEnded();
        }
      }, 100); // Run every 100 ms
    }
  }

  pause(): void {
    if (this.playing) {
      this.audioSource.disconnect();
      this.audioSource.stop();
      this.playing = false;
      clearInterval(this.playTimer);
    }
  }

  onAudioEnded(): void {
    this.pause();
    this.playTime = 0;
    this.drawCanvas();
  }

  ngOnDestroy(): void {
    clearInterval(this.playTimer);
  }
}
