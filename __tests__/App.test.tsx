// @ts-nocheck
import { formatDuration, safeFileSegment } from '../utils';
import { t } from '../i18n';

describe('formatDuration', () => {
  it('formats short and long durations', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65.9)).toBe('1:05');
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('normalizes invalid and negative values', () => {
    expect(formatDuration(-5)).toBe('0:00');
    expect(formatDuration(Number.NaN)).toBe('0:00');
  });
});

describe('safeFileSegment', () => {
  it('removes path separators and unsafe characters', () => {
    expect(safeFileSegment('../my clip.mp4')).toBe('my_clip_mp4');
    expect(safeFileSegment('')).toBe('video');
  });
});

describe('translations', () => {
  it('provides both English and Persian labels', () => {
    expect(t('chooseVideo', 'en')).toBe('Choose a video');
    expect(t('chooseVideo', 'fa')).toBe('انتخاب ویدئو');
  });

  it('falls back to English for an unknown language or key', () => {
    expect(t('chooseVideo', 'fr')).toBe('Choose a video');
    expect(t('missingKey', 'en')).toBe('missingKey');
  });
});

describe('buildExtractionArgs', () => {
  it('extracts at one or two images per second', () => {
    const once = buildExtractionArgs({ start: 2, end: 7, input: '/cache/input.mp4', outputPattern: '/docs/frame_%05d.png' });
    const twice = buildExtractionArgs({ start: 2, end: 7, input: '/cache/input.mp4', outputPattern: '/docs/frame_%05d.png', frequency: '0.5' });
    expect(once).toContain('fps=1');
    expect(twice).toContain('fps=2');
    expect(once[once.length - 1]).toBe('/docs/frame_%05d.png');
  });

  it('preserves all frames and applies JPEG quality settings', () => {
    const every = buildExtractionArgs({ start: 0, end: 4, input: '/cache/input.mp4', outputPattern: '/docs/frame_%05d.jpg', frequency: 'all', format: 'jpeg', quality: 'high' });
    expect(every).toContain('passthrough');
    expect(every).toContain('-q:v');
    expect(every).toContain('2');
    expect(every).not.toContain('-vf');
  });
});
