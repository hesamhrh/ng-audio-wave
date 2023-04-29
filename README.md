# ng-audio-wave

`ng-audio-wave` is a package for creating a waveform for audio files in Angular projects. The package provides a customizable waveform component that can be easily added to your project.

## Demo

Check out the demo [here](https://ng-audio-wave-demo.stackblitz.io/).

## Installation

You can install `ng-audio-wave` using npm:

```
npm install ng-audio-wave
```

## Usage

To use `ng-audio-wave` in your Angular project, first import the module in your app module:

```typescript
import { NgAudioWaveModule } from "ng-audio-wave";

@NgModule({
  imports: [NgAudioWaveModule],
  // ...
})
export class AppModule {}
```

Then, in your component template, add the `ng-audio-wave` component:

```html
<ng-audio-wave
  audioSrc="your-audio-source"
  [options]="options"
  (timeUpdate)="onTimeUpdate($event)"
  (durationUpdate)="onDurationUpdate($event)"
  #audioWave
></ng-audio-wave>
```

Replace `your-audio-source` with the URL of your audio file, and customize the waveform by providing an `options` object.

### Example

Here is an example of using `ng-audio-wave` in a component:

```typescript
import { Component, ViewChild } from "@angular/core";
import { NgAudioWaveComponent } from "ng-audio-wave";

@Component({
  selector: "app-waveform",
  template: `
    <ng-audio-wave
      audioSrc="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
      [options]="options"
      (timeUpdate)="onTimeUpdate($event)"
      (durationUpdate)="onDurationUpdate($event)"
      #audioWave
    >
    </ng-audio-wave>
  `,
})
export class WaveformComponent {
  options = {
    height: 100,
    barLineWidth: 2,
    barLineSpaceBetween: 1,
    barLineColor: "rgba(69, 123, 157, 0.3)",
    barLineProgressColor: "#E42535",
    barLineHoverColor: "rgba(228, 37, 53, 0.3)",
  };

  @ViewChild("audioWave", { static: false }) audioWave: NgAudioWaveComponent;

  onTimeUpdate(time: number) {
    console.log(`Current time: ${time} seconds`);
  }

  onDurationUpdate(duration: number) {
    console.log(`Duration: ${duration} seconds`);
  }

  play() {
    this.audioWave.play();
  }

  togglePlay() {
    this.audioWave.togglePlay();
  }

  pause() {
    this.audioWave.pause();
  }
}
```

## API

### Inputs

- `audioSrc` (required): The URL of the audio file to display the waveform for.
- `options` (optional): An object containing options to customize the appearance of the waveform.

### @Output

The `NgAudioWaveComponent` emits the following `@Output` events:

#### `timeUpdate`

Emits the current time of the audio in seconds. The value type is `number`.

Example usage:

```html
<ng-audio-wave
  audioSrc="https://www.example.com/audio.mp3"
  (timeUpdate)="onTimeUpdate($event)"
></ng-audio-wave>
```

```typescript
onTimeUpdate(currentTime: number) {
  console.log(`Current time: ${currentTime} seconds`);
}
```

#### `durationUpdate`

Emits the duration of the audio in seconds after it has loaded. The value type is `number`.

Example usage:

```html
<ng-audio-wave
  audioSrc="https://www.example.com/audio.mp3"
  (durationUpdate)="onDurationUpdate($event)"
></ng-audio-wave>
```

```typescript
onDurationUpdate(duration: number) {
  console.log(`Duration: ${duration} seconds`);
}
```

### Methods

- `play()`: Plays the audio.
- `togglePlay()`: Toggles the playback state of the audio.
- `pause()`: Pauses the audio.

## Options

| Property               | Type     | Default                     | Description                                         |
| ---------------------- | -------- | --------------------------- | --------------------------------------------------- |
| `height`               | `number` | `100`                       | The height of the waveform in pixels.               |
| `barLineWidth`         | `number` | `2`                         | The width of each bar line in pixels.               |
| `barLineSpaceBetween`  | `number` | `1`                         | The space between each bar line in pixels.          |
| `barLineColor`         | `string` | `'rgba(69, 123, 157, 0.3)'` | The color of each bar line.                         |
| `barLineProgressColor` | `string` | `'#E42535'`                 | The color of the bar lines that have been played.   |
| `barLineHoverColor`    | `string` | `'rgba(228, 37, 53, 0.3)'`  | The color of the bar lines when hovering over them. |

### @ViewChild

The `NgAudioWaveComponent` can be accessed using `@ViewChild` to call its methods:

```html
<ng-audio-wave
  #audioWave
  audioSrc="https://www.example.com/audio.mp3"
></ng-audio-wave>
```

```typescript
import { Component, ViewChild } from "@angular/core";
import { NgAudioWaveComponent } from "ng-audio-wave";

@Component({
  selector: "app-my-component",
  template: `
    <ng-audio-wave
      #audioWave
      audioSrc="https://www.example.com/audio.mp3"
    ></ng-audio-wave>
    <button (click)="audioWave.play()">Play</button>
    <button (click)="audioWave.togglePlay()">Toggle Play</button>
    <button (click)="audioWave.pause()">Pause</button>
  `,
})
export class MyComponent {
  @ViewChild("audioWave", { static: false }) audioWave: NgAudioWaveComponent;
}
```

## Contributions

Contributions are welcome! If you find any bugs or want to add a new feature, feel free to open an issue or submit a pull request.
