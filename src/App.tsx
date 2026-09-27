import { useCallback, useState } from 'react';
import { TopBar, Rail, PresentHUD, SourcesDrawer } from './components/Chrome';
import { SourcesProvider } from './components/ui';
import { useActiveSection } from './hooks/useActiveSection';
import { usePresentation } from './hooks/usePresentation';
import { ModelProvider } from './state';
import { Hero } from './sections/Hero';
import { CostCalculator } from './sections/CostCalculator';
import { Impact } from './sections/Impact';
import { Footer } from './sections/Footer';

export default function App() {
  const active = useActiveSection();
  const pres = usePresentation(active);
  const [src, setSrc] = useState(false);
  const openSources = useCallback(() => setSrc(true), []);

  return (
    <ModelProvider>
      <SourcesProvider value={{ open: openSources }}>
        <TopBar active={active} present={pres.on} onPresent={() => pres.setOn(!pres.on)} onSources={openSources} />
        <Rail active={active} />
        <main>
          <Hero />
          <CostCalculator />
          <Impact />
        </main>
        <Footer />
        {pres.on && <PresentHUD idx={pres.idx} go={pres.go} exit={() => pres.setOn(false)} />}
        <SourcesDrawer open={src} onClose={() => setSrc(false)} />
      </SourcesProvider>
    </ModelProvider>
  );
}
