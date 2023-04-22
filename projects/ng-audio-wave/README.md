Sure, here's the updated README with the sample `audioSrc` value:

# ng-audio-wave

`ng-audio-wave` is a package for creating dynamic waveform visualizations for audio files in Angular projects. With `ng-audio-wave`, you can easily create interactive and responsive waveform displays that adjust to fit any screen size or device.

## Installation

To install `ng-audio-wave`, simply run:

```
npm install ng-audio-wave --save
```

## Usage

In your app.module.ts file, import the `NgAudioWaveModule` module:

```typescript
import { NgAudioWaveModule } from "ng-audio-wave";

@NgModule({
  imports: [
    // ...
    NgAudioWaveModule,
  ],
  // ...
})
export class AppModule {}
```

In your component.html file, use the `ng-audio-wave` component as follows:

```html
<ng-audio-wave
  audioSrc="https://example.com/my-audio-file.mp3"
  [options]="options"
></ng-audio-wave>
```

The `audioSrc` property is required and should be a string representing the URL of the audio file to display.

Here is an example of `options` that you can pass to the component:

| Option                 | Type     | Default                     | Description                                          |
| ---------------------- | -------- | --------------------------- | ---------------------------------------------------- |
| `height`               | `number` | `100`                       | The height of the waveform in pixels.                |
| `barLineWidth`         | `number` | `2`                         | The width of each bar line in pixels.                |
| `barLineSpaceBetween`  | `number` | `1`                         | The amount of space between each bar line in pixels. |
| `barLineColor`         | `string` | `'rgba(69, 123, 157, 0.3)'` | The color of the bar lines.                          |
| `barLineProgressColor` | `string` | `'#E42535'`                 | The color of the progress bar.                       |
| `barLineHoverColor`    | `string` | `'rgba(228, 37, 53, 0.3)'`  | The color of the bar lines when hovered over.        |

All properties in `options` are optional. If you do not pass in any options, the component will use the default options:

```typescript
options = {
  height: 100,
  barLineWidth: 2,
  barLineSpaceBetween: 1,
  barLineColor: "rgba(69, 123, 157, 0.3)",
  barLineProgressColor: "#E42535",
  barLineHoverColor: "rgba(228, 37, 53, 0.3)",
};
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
