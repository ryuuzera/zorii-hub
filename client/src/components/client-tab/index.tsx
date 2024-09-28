'use client';
import { Tabs } from '../ui/tabs';

export function ClientTab(props: any) {
  return (
    <Tabs {...props} className={`transition-all delay-200 overflow-hidden`}>
      {props.children}
    </Tabs>
  );
}
