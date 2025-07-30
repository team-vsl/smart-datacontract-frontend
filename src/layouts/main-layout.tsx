// Xây dựng một layout mẫu cho app với AppLayout
// Link: https://cloudscape.design/components/app-layout/?tabId=preview
// Note: layout này không phải là layout của mình.
import { useNavigate } from "react-router-dom";

import {
  AppLayout,
  HelpPanel,
  SideNavigation,
} from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";

// Import configs
import { RouteConfigs } from "@/routes/route-configs";

// Import states
import { useMainLayoutState, mainLayoutStActions } from "@/states/main-layout";

// Import types
import type { PropsWithChildren } from "react";

const LOCALE = import.meta.env.VITE_I8N_LOCALE;

export default function MainLayout(props: PropsWithChildren) {
  const { activeHref, sideNavigation, helpPanel } = useMainLayoutState();

  const navigate = useNavigate();

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        maxContentWidth={1440}
        navigationOpen={sideNavigation.isOpen}
        onNavigationChange={({ detail }) =>
          mainLayoutStActions.setNavigationOpen(detail.open)
        }
        navigation={
          <SideNavigation
            activeHref={activeHref}
            onFollow={(event) => {
              if (!event.detail.external) {
                event.preventDefault();
                mainLayoutStActions.setActiveHref(event.detail.href);
                navigate(event.detail.href);
              }
            }}
            header={{
              href: RouteConfigs.Home.Path,
              text: "Challenge #23 Solution",
            }}
            items={[
              {
                type: "link",
                text: RouteConfigs.DCGenerator.Name,
                href: RouteConfigs.DCGenerator.Path,
              },
              {
                type: "link",
                text: RouteConfigs.DCManagement.Name,
                href: RouteConfigs.DCManagement.Path,
              },
              {
                type: "link",
                text: RouteConfigs.RulesetManagement.Name,
                href: RouteConfigs.RulesetManagement.Path,
              },
              {
                type: "link",
                text: RouteConfigs.JobManagement.Name,
                href: RouteConfigs.JobManagement.Path,
              },
            ]}
          />
        }
        toolsOpen={helpPanel.isOpen}
        onToolsChange={({ detail }) => {
          mainLayoutStActions.setHelpPanelOpen(detail.open);
        }}
        tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={<div className="h-full overflow-auto">{props.children}</div>}
      />
    </I18nProvider>
  );
}
