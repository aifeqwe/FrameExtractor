import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import RNFS from 'react-native-fs';
import BlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { zip } from 'react-native-zip-archive';
import { cancel, execute } from 'munim-ffmpeg';
import ProgressBar from './ProgressBar';
import { buildExtractionArgs, formatDuration, safeFileSegment } from './utils';
import { t } from './i18n';

const C = { ink: '#10152A', muted: '#737A8D', teal: '#17BFA4', purple: '#7568F3', line: '#E8EAF2', white: '#FFFFFF', pale: '#F5F6FB', red: '#D9485F' };
const pathFromUri = value => {
  const path = String(value || '').replace(/^file:\/\//, '');
  try { return decodeURIComponent(path); } catch (_) { return path; }
};
const removeDirectory = async directory => {
  try {
    const entries = await RNFS.readDir(directory);
    await Promise.all(entries.map(entry => entry.isDirectory() ? removeDirectory(entry.path) : RNFS.unlink(entry.path).catch(() => { })));
    await RNFS.unlink(directory);
  } catch (_) { /* Best-effort cleanup; never hide the primary extraction error. */ }
};

export default function FrameExtractor({ language, video, videoUri, range, onBack, onComplete }) {
  const [frequency, setFrequency] = useState('1');
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState('high');
  const [busy, setBusy] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [created, setCreated] = useState(0);
  const [outputDir, setOutputDir] = useState('');
  const [outputFiles, setOutputFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const rtl = language === 'fa';
  const sessionId = useRef(undefined);
  const cancelled = useRef(false);
  const mounted = useRef(true);
  const activeOutputDirectory = useRef(null);
  useEffect(() => () => {
    mounted.current = false;
    if (sessionId.current !== undefined) { try { cancel(sessionId.current); } catch (_) { } }
    if (activeOutputDirectory.current) removeDirectory(activeOutputDirectory.current);
  }, []);
  const extract = async () => {
    if (busy) return;
    const start = Number(range?.start), end = Number(range?.end);
    if (!videoUri || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) { Alert.alert(t('errorTitle', language), t('extractionError', language)); return; }
    cancelled.current = false; setBusy(true); setStatus('running'); setProgress(0); setCreated(0); setOutputFiles([]);
    let temporaryInput = null;
    let outputDirectory = null;
    try {
      const root = `${RNFS.DocumentDirectoryPath}/FrameExtractor`;
      await RNFS.mkdir(root);
      const batch = `${new Date().toISOString().replace(/[:.]/g, '-')}_${safeFileSegment(video?.fileName)}`;
      const dir = `${root}/${batch}`;
      outputDirectory = dir;
      activeOutputDirectory.current = dir;
      await RNFS.mkdir(dir);
      setOutputDir(dir);
      let input = videoUri;
      if (String(input).startsWith('content://')) {
        const ext = (video?.fileName?.match(/\.([a-zA-Z0-9]{2,5})$/)?.[1] || 'mp4').toLowerCase();
        const local = `${RNFS.CachesDirectoryPath}/frame-extractor-input-${Date.now()}.${ext}`;
        try { await RNFS.copyFile(input, local); input = local; temporaryInput = local; } catch {
          try { await BlobUtil.fs.cp(input, local); input = local; temporaryInput = local; } catch (_) { throw new Error('The selected video provider did not allow a local copy. Please try another video stored on this device.'); }
        }
      } else input = pathFromUri(input);
      const ext = format === 'jpeg' ? 'jpg' : format;
      const pattern = `${dir}/frame_%05d.${ext}`;
      if (cancelled.current) { await removeDirectory(dir); activeOutputDirectory.current = null; setOutputDir(''); setStatus('cancelled'); setBusy(false); return; }
      const args = buildExtractionArgs({ start, end, input, outputPattern: pattern, frequency, format, quality });
      const result = await execute(args, undefined, (timeMs) => { if (!mounted.current) return; const pct = Math.min(99, Math.max(0, ((timeMs / 1000) / (end - start)) * 100)); setProgress(pct); }, id => { sessionId.current = id; if (cancelled.current || !mounted.current) { try { cancel(id); } catch (_) { } } });
      sessionId.current = undefined;
      if (result.cancelled || cancelled.current) {
        await removeDirectory(dir);
        activeOutputDirectory.current = null;
        if (mounted.current) { setOutputDir(''); setStatus('cancelled'); setBusy(false); }
        return;
      }
      if (!result.success) throw new Error(result.failStackTrace || result.output || 'FFmpeg returned a failure code.');
      const names = await RNFS.readDir(dir);
      const images = names.filter(item => item.isFile() && /\.(png|jpe?g|webp)$/i.test(item.name)).map(item => ({ path: item.path, name: item.name })).sort((a, b) => a.name.localeCompare(b.name));
      if (!images.length) throw new Error(t('noFrames', language));
      if (!mounted.current) return;
      activeOutputDirectory.current = null;
      setOutputFiles(images); setCreated(images.length); setProgress(100); setStatus('done'); setBusy(false);
    } catch (error) {
      sessionId.current = undefined;
      if (outputDirectory) await removeDirectory(outputDirectory);
      activeOutputDirectory.current = null;
      if (mounted.current) { setOutputDir(''); setBusy(false); setStatus('error'); Alert.alert(t('errorTitle', language), `${t('extractionError', language)}\n\n${error?.message || ''}`); }
    } finally {
      if (temporaryInput) RNFS.unlink(temporaryInput).catch(() => { });
    }
  };
  const stop = async () => { cancelled.current = true; if (sessionId.current !== undefined) { try { await cancel(sessionId.current); } catch (_) { } } setStatus('cancelled'); };
  const share = async () => {
    if (!outputFiles.length || !outputDir || sharing) return;
    setSharing(true);
    try {
      const archivePath = `${outputDir}.zip`;
      if (await RNFS.exists(archivePath)) await RNFS.unlink(archivePath);
      await zip(outputDir, archivePath);
      await Share.open({ url: `file://${archivePath}`, type: 'application/zip', title: t('share', language), failOnCancel: false });
    } catch (error) {
      Alert.alert(t('errorTitle', language), error?.message || t('extractionError', language));
    } finally {
      setSharing(false);
    }
  };
  const option = (label, value, current, set) => <Pressable key={value} onPress={() => !busy && set(value)} style={[styles.option, current === value && styles.optionSelected]}><Text style={[styles.optionText, current === value && styles.optionTextSelected]}>{label}</Text></Pressable>;
  return <View style={styles.container}>
    <View style={[styles.heading, rtl && styles.rowReverse]}><View style={{ flex: 1 }}><Text style={styles.kicker}>{t('stepOf', language)} 03 / 03</Text><Text style={[styles.title, rtl && styles.textRtl]}>{status === 'done' ? t('done', language) : t('exportTitle', language)}</Text><Text style={[styles.subtitle, rtl && styles.textRtl]}>{t('exportHint', language)}</Text></View><View style={styles.badge}><Text style={styles.badgeText}>✦</Text></View></View>
    <View style={[styles.summaryCard, rtl && styles.rowReverse]}><View style={styles.summaryIcon}><Text style={styles.summaryGlyph}>▧</Text></View><View style={{ flex: 1 }}><Text style={styles.summaryName} numberOfLines={1}>{video?.fileName || 'video'}</Text><Text style={styles.summaryMeta}>{formatDuration(range.end - range.start)} · {format === 'jpeg' ? 'JPEG' : format.toUpperCase()}</Text></View></View>
    <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('outputFormat', language)}</Text><View style={[styles.options, rtl && styles.rowReverse]}>{option('PNG', 'png', format, setFormat)}{option('JPEG', 'jpeg', format, setFormat)}{option('WebP', 'webp', format, setFormat)}</View>
    <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('frameRate', language)}</Text><View style={[styles.options, rtl && styles.rowReverse]}>{option(t('everySecond', language), '1', frequency, setFrequency)}{option(t('everyHalfSecond', language), '0.5', frequency, setFrequency)}{option(t('everyFrame', language), 'all', frequency, setFrequency)}</View>{frequency === 'all' && <Text style={[styles.warning, rtl && styles.textRtl]}>{t('allFramesWarning', language)}</Text>}
    {format !== 'png' && <><Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('outputQuality', language)}</Text><View style={[styles.options, rtl && styles.rowReverse]}>{option(language === 'fa' ? 'بالاتر' : 'High', 'high', quality, setQuality)}{option(language === 'fa' ? 'متعادل' : 'Balanced', 'medium', quality, setQuality)}{option(language === 'fa' ? 'کم‌حجم' : 'Smaller', 'low', quality, setQuality)}</View></>}
    <View style={[styles.storageNote, rtl && styles.rowReverse]}><Text style={styles.storageIcon}>⌑</Text><Text style={[styles.storageText, rtl && styles.textRtl]}>{t('storageNote', language)}{outputDir ? `\n${outputDir}` : ''}</Text></View>
    {(busy || status === 'done') && <View style={styles.progressCard}><View style={[styles.progressHeader, rtl && styles.rowReverse]}><Text style={styles.progressTitle}>{busy ? t('extracting', language) : t('doneCount', language)}</Text><Text style={styles.progressNumber}>{status === 'done' ? created : `${Math.round(progress)}%`}</Text></View><ProgressBar progress={progress} rtl={rtl} />{status === 'done' && <Text style={styles.progressCaption}>{created} {t('frames', language)}</Text>}</View>}
    <View style={[styles.actions, rtl && styles.rowReverse]}>{status !== 'done' && <Pressable disabled={busy} style={[styles.secondary, busy && { opacity: 0.5 }]} onPress={onBack}><Text style={styles.secondaryText}>{t('back', language)}</Text></Pressable>}{busy ? <Pressable style={styles.cancel} onPress={stop}><Text style={styles.cancelText}>{t('cancel', language)}</Text></Pressable> : status === 'done' ? <><Pressable style={styles.secondary} onPress={share} disabled={sharing}><Text style={styles.secondaryText}>{sharing ? t('preparing', language) : t('share', language)}</Text></Pressable><Pressable style={styles.primary} onPress={() => onComplete?.(null)}><Text style={styles.primaryText}>{t('newProject', language)}</Text></Pressable></> : <Pressable style={styles.primary} onPress={extract}><Text style={styles.primaryText}>{t('extract', language)}</Text><Text style={styles.primaryArrow}>↗</Text></Pressable>}</View>
    {status === 'done' && <View style={styles.success}><Text style={styles.successGlyph}>✓</Text><Text style={styles.successText}>{t('done', language)} · {created} {t('frames', language)}</Text></View>}
    {status === 'cancelled' && <Text style={styles.cancelledText}>{t('cancelled', language)}</Text>}
  </View>;
}
const styles = StyleSheet.create({ container: { width: '100%', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 }, heading: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 }, kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: C.purple, marginBottom: 7 }, title: { fontSize: 25, fontWeight: '800', color: C.ink }, subtitle: { fontSize: 13, lineHeight: 20, color: C.muted, marginTop: 7 }, badge: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#E4FBF5', alignItems: 'center', justifyContent: 'center' }, badgeText: { fontSize: 22, color: C.teal }, summaryCard: { borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 23 }, summaryIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }, summaryGlyph: { fontSize: 24, color: C.teal }, summaryName: { fontSize: 13, fontWeight: '800', color: C.ink }, summaryMeta: { fontSize: 12, color: C.muted, marginTop: 5 }, sectionTitle: { fontSize: 13, fontWeight: '800', color: C.ink, marginBottom: 10, marginTop: 2 }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }, option: { paddingHorizontal: 13, paddingVertical: 11, borderWidth: 1, borderColor: C.line, borderRadius: 12, backgroundColor: C.white }, optionSelected: { borderColor: C.ink, backgroundColor: C.ink }, optionText: { fontSize: 12, fontWeight: '600', color: C.muted }, optionTextSelected: { color: C.white }, warning: { fontSize: 11, lineHeight: 17, color: '#986B19', backgroundColor: '#FFF7E5', borderRadius: 10, padding: 10, marginTop: -10, marginBottom: 16 }, storageNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 13, backgroundColor: C.pale, borderRadius: 14 }, storageIcon: { fontSize: 18, color: C.teal }, storageText: { flex: 1, fontSize: 12, lineHeight: 19, color: C.muted }, progressCard: { padding: 15, borderRadius: 16, borderWidth: 1, borderColor: C.line, marginTop: 18 }, progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, progressTitle: { fontSize: 12, fontWeight: '700', color: C.ink }, progressNumber: { fontSize: 13, fontWeight: '800', color: C.purple }, progressCaption: { fontSize: 12, color: C.muted, marginTop: 8 }, actions: { flexDirection: 'row', gap: 10, marginTop: 20 }, secondary: { flex: 1, minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 }, secondaryText: { fontSize: 12, fontWeight: '700', color: C.ink, textAlign: 'center' }, primary: { flex: 1.4, minHeight: 54, borderRadius: 16, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 8 }, primaryText: { fontSize: 13, fontWeight: '700', color: C.white, textAlign: 'center' }, primaryArrow: { position: 'absolute', right: 14, color: C.teal, fontSize: 20 }, cancel: { flex: 1, minHeight: 54, borderRadius: 16, backgroundColor: '#FCE8EB', alignItems: 'center', justifyContent: 'center' }, cancelText: { fontSize: 13, fontWeight: '800', color: C.red }, success: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }, successGlyph: { color: '#168A70', fontSize: 18, fontWeight: '800' }, successText: { fontSize: 12, color: '#168A70', fontWeight: '700' }, cancelledText: { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 12 } });
