/** Format seconds as m:ss or h:mm:ss without allowing negative durations. */
export function formatDuration(value = 0) {
  const numeric = Number(value);
  const seconds = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export function safeFileSegment(value = 'video') {
  return String(value || 'video').replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'video';
}

/** Build a safe FFmpeg argument array for image-sequence output. */
export function buildExtractionArgs({ start, end, input, outputPattern, frequency = '1', format = 'png', quality = 'high' }) {
  const args = [
    '-hide_banner', '-y', '-ss', String(start), '-i', input, '-t', String(end - start),
    '-map', '0:v:0', '-an', '-sn', '-dn',
  ];

  if (frequency === 'all') {
    args.push('-fps_mode', 'passthrough');
  } else {
    args.push('-vf', `fps=${frequency === '0.5' ? '2' : '1'}`);
  }

  if (format === 'jpeg') args.push('-q:v', quality === 'high' ? '2' : quality === 'medium' ? '5' : '8');
  if (format === 'webp') args.push('-quality', quality === 'high' ? '92' : quality === 'medium' ? '78' : '60');
  args.push('-start_number', '1', '-f', 'image2', outputPattern);
  return args;
}
