#!/usr/bin/env bash
# Extracts exactly 120 WebP frames from the provided hero MP4 into
# public/sequence/frame_000.webp .. frame_119.webp.
#
# Usage:
#   scripts/extract-frames.sh path/to/hero.mp4
#
# The audio track (if any) is extracted to public/audio/hero.mp3 so the
# SoundToggle in the hero can play in sync.

set -euo pipefail

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <video.mp4>" >&2
  exit 1
fi

INPUT="$1"
OUT_DIR="public/sequence"
AUDIO_DIR="public/audio"

if [[ ! -f "$INPUT" ]]; then
  echo "Input video not found: $INPUT" >&2
  exit 1
fi

mkdir -p "$OUT_DIR" "$AUDIO_DIR"

# Determine source duration in seconds (floating point)
DURATION=$(ffprobe -v error -show_entries format=duration -of default=nokey=1:noprint_wrappers=1 "$INPUT")
if [[ -z "$DURATION" ]]; then
  echo "Could not read duration from $INPUT" >&2
  exit 1
fi

FPS=$(python3 -c "print(120.0 / float('$DURATION'))")
echo "Source duration: ${DURATION}s   target fps: ${FPS}"

# Wipe old frames
rm -f "$OUT_DIR"/frame_*.webp

ffmpeg -y -i "$INPUT" \
  -vf "fps=${FPS},scale=1920:-2:flags=lanczos" \
  -frames:v 120 \
  -c:v libwebp -q:v 72 -preset photo \
  "$OUT_DIR/frame_%03d.webp"

# Reindex 001-based output to 000-based to match the canvas loader
i=0
for f in "$OUT_DIR"/frame_*.webp; do
  target="$OUT_DIR/.frame_$(printf '%03d' $i).webp"
  mv "$f" "$target"
  i=$((i + 1))
done
for f in "$OUT_DIR"/.frame_*.webp; do
  mv "$f" "$OUT_DIR/${f##*/.}"
done

echo "Extracted ${i} frames into $OUT_DIR/"

# Extract audio if present
if ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=nokey=1:noprint_wrappers=1 "$INPUT" | grep -q audio; then
  ffmpeg -y -i "$INPUT" -vn -c:a libmp3lame -b:a 160k "$AUDIO_DIR/hero.mp3"
  echo "Extracted audio to $AUDIO_DIR/hero.mp3"
else
  echo "No audio stream found; skipped audio extraction."
fi
