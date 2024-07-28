import * as React from 'react';

interface HeaderProps {
  NavigationComponent: React.ComponentType<any>;
  navigationProps: any;
  navType: string;
  user: any;
}

export default async function Header({
  NavigationComponent,
  navigationProps,
  navType,
  user
}: HeaderProps) {
  return (
    <header className="container z-40 items-center justify-center  w-full">
      <div
        className={`flex h-20 items-center justify-${navType === 'circular' ? 'between' : 'center'} py-6`}
      >
        <NavigationComponent {...navigationProps} user={user} />
      </div>
    </header>
  );
}
