import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewPage } from './components/pages/OverviewPage';
import { SingleAgentPage } from './components/pages/SingleAgentPage';
import { FullChainPage } from './components/pages/FullChainPage';
import { NetworkDEAPage } from './components/pages/NetworkDEAPage';
import { RegionalPage } from './components/pages/RegionalPage';
import { ResourcePage } from './components/pages/ResourcePage';
import { PolicyPage } from './components/pages/PolicyPage';
import { DataExplorerPage } from './components/pages/DataExplorerPage';
import { AboutPage } from './components/pages/AboutPage';

type PageId = 'overview' | 'single' | 'chain' | 'network' | 'regional' | 'resource' | 'policy' | 'explorer' | 'about';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');

  function renderPage() {
    switch (activePage) {
      case 'overview':  return <OverviewPage onNavigate={id => setActivePage(id as PageId)} />;
      case 'single':    return <SingleAgentPage />;
      case 'chain':     return <FullChainPage />;
      case 'network':   return <NetworkDEAPage />;
      case 'regional':  return <RegionalPage />;
      case 'resource':  return <ResourcePage />;
      case 'policy':    return <PolicyPage />;
      case 'explorer':  return <DataExplorerPage />;
      case 'about':     return <AboutPage />;
      default:          return <OverviewPage onNavigate={id => setActivePage(id as PageId)} />;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#F8F7F4',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#262626',
      }}
    >
      <Sidebar active={activePage} onSelect={id => setActivePage(id as PageId)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar activePage={activePage} />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px 40px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#D4D0C8 transparent',
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
