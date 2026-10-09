import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoPicker from './VideoPicker';
import FrameRangeSelector from './FrameRangeSelector';
import FrameExtractor from './FrameExtractor';
import LanguageSwitcher from './LanguageSwitcher';
import { t } from './i18n';

const C = { ink: '#10152A', muted: '#737A8D', teal: '#17BFA4', purple: '#7568F3', line: '#E8EAF2', white: '#FFFFFF', pale: '#F5F6FB' };
export default function App() {
  const [language, setLanguage] = useState('en');
  const [step, setStep] = useState(0);
  const [video, setVideo] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState(null);
  const rtl = language === 'fa';
  const stepLabels = useMemo(() => [t('stepVideo', language), t('stepRange', language), t('stepExport', language)], [language]);

  const handleVideoSelect = asset => {
    setVideo(asset);
    setVideoUri(asset.uri);
    setDuration(Math.max(0, asset.duration || 0));
    setRange(null);
    setStep(1);
  };
  const reset = () => { setStep(0); setVideo(null); setVideoUri(null); setDuration(0); setRange(null); };
  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
    <StatusBar barStyle="dark-content" backgroundColor={C.white} />
    <View style={[styles.topbar, rtl && styles.rowReverse]}>
      <Pressable style={[styles.brand, rtl && styles.rowReverse]} onPress={reset} disabled={step === 2} accessibilityRole="button"><View style={styles.brandMark}><Text style={styles.brandGlyph}>▶</Text></View><View><Text style={styles.brandName}>{t('appName', language)}</Text><Text style={styles.brandCaption}>FRAME STUDIO</Text></View></Pressable>
      <LanguageSwitcher language={language} onChange={setLanguage} />
    </View>
    <View style={[styles.stepper, rtl && styles.rowReverse]}>{stepLabels.map((label, index) => <View key={label} style={[styles.stepItem, rtl && styles.rowReverse]}><View style={[styles.stepDot, index <= step && styles.stepDotActive]}><Text style={[styles.stepNumber, index <= step && styles.stepNumberActive]}>{index < step ? '✓' : index + 1}</Text></View><Text style={[styles.stepLabel, index === step && styles.stepLabelActive]}>{label}</Text>{index < 2 && <View style={[styles.stepLine, index < step && styles.stepLineActive]} />}</View>)}</View>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {step === 0 && <VideoPicker language={language} onSelect={handleVideoSelect} selectedVideo={video} />}
      {step === 1 && video && <FrameRangeSelector key={videoUri} language={language} video={video} videoUri={videoUri} duration={duration} onBack={() => setStep(0)} onContinue={selected => { setRange(selected); setStep(2); }} />}
      {step === 2 && video && range && <FrameExtractor key={`${videoUri}-${range.start}-${range.end}`} language={language} video={video} videoUri={videoUri} range={range} onBack={() => setStep(1)} onComplete={result => { if (!result) reset(); }} />}
      <View style={styles.footer}><View style={styles.footerRule} /><Text style={styles.footerText}>{t('privateNote', language)}</Text><Text style={styles.version}>v1.0.0</Text></View>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({ rowReverse: { flexDirection: 'row-reverse' }, safe: { flex: 1, backgroundColor: C.white }, topbar: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F1F6' }, brand: { flexDirection: 'row', alignItems: 'center', gap: 10 }, brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }, brandGlyph: { fontSize: 17, color: C.teal, marginLeft: 2 }, brandName: { fontSize: 15, fontWeight: '900', color: C.ink }, brandCaption: { fontSize: 8, fontWeight: '800', letterSpacing: 1.8, color: C.muted, marginTop: 3 }, stepper: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.white }, stepItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }, stepDot: { width: 25, height: 25, borderRadius: 13, borderWidth: 1.5, borderColor: '#D9DCE8', alignItems: 'center', justifyContent: 'center', backgroundColor: C.white }, stepDotActive: { backgroundColor: C.ink, borderColor: C.ink }, stepNumber: { fontSize: 10, fontWeight: '800', color: C.muted }, stepNumberActive: { color: C.teal }, stepLabel: { fontSize: 10, color: C.muted, fontWeight: '600' }, stepLabelActive: { color: C.ink, fontWeight: '800' }, stepLine: { height: 1, backgroundColor: C.line, flex: 1, marginHorizontal: 2 }, stepLineActive: { backgroundColor: C.teal }, scroll: { flexGrow: 1, paddingBottom: 10 }, footer: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22 }, footerRule: { width: 36, height: 3, borderRadius: 3, backgroundColor: '#E4E6EF', marginBottom: 13 }, footerText: { fontSize: 10, color: '#8B91A3' }, version: { fontSize: 9, color: '#B0B5C4', marginTop: 7 } });
