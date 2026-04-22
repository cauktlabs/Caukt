# Token stall

- Canvas: 96 x 128
- Frames: 1
- Palette: Dawn Market (see docs/palette-dawn-market.md)
- Rendering: image-rendering pixelated, no smoothing

## Palette

- Up to 8 indexed colors
- Shadow black reserved

## Timing

- Frame count: 1
- Each frame holds two ticks at 60fps
- Loop is seamless

## Canvas

- Exported at integer multiples of 96 only
- No half-pixel offsets

## Review

- Silhouette reads at 1x
- No anti-aliasing
- File size under 48 KB
