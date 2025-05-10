import { useEffect } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { TabBar } from '@/components/browser/TabBar';
import { AddressBar } from '@/components/browser/AddressBar';
import { BrowserView } from '@/components/browser/BrowserView';

export default function Browser() {
  const { setCurrentApp } = useAppState();
  
  useEffect(() => {
    setCurrentApp('browser');
  }, [setCurrentApp]);
  
  return (
    <>
      <TabBar />
      <AddressBar />
      <BrowserView />
    </>
  );
}
