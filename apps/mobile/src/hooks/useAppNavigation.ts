import { useMemo } from 'react';
import tabs from '@Navigation/tabIndex';
import LoginScreen from '@Screens/Auth/Login/Login';
import Splash from '@Screens/Splash/Splash';
import SiderBarTabs from '@Navigation/SidebarTabs';
import { AllowedTabs_Filter } from '@Utils/AllowedPagesFiltering';
import { UserRole } from '@Constants/Roles';

export const useAppNavigation = (isAdmin: number, rolesOnPageData: any[]) => {
  const pages = rolesOnPageData.length > 0
    ? rolesOnPageData.filter(role => role?.isdefault === true).map(data => data?.link)
    : tabs.map(tab => tab.link);

  const filteredTabs = useMemo(() => [
    ...(pages.length > 0 && isAdmin === UserRole.USER
      ? tabs.filter(tab => pages.includes(tab?.key))
      : tabs.filter(tab => tab.name !== 'LOGIN' && tab.name !== 'SPLASH')),
    { name: 'LOGIN', component: LoginScreen },
    { name: 'SPLASH', component: Splash },
  ], [pages, isAdmin]);

  const filterSidebar = AllowedTabs_Filter({
    tabs: SiderBarTabs,
    allowedTabs: filteredTabs,
    tabsPath_key: 'path',
    allowedTabspath_key: 'name',
  });

  const activeTabSet = isAdmin === UserRole.ADMIN ? tabs : filteredTabs;
  const showNoRolesScreen = isAdmin === UserRole.USER && !rolesOnPageData?.length;

  return { activeTabSet, filterSidebar, showNoRolesScreen };
};
