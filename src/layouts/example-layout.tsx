// Xây dựng một layout mẫu cho app với AppLayout
// Link: https://cloudscape.design/components/app-layout/?tabId=preview
// Note: layout này không phải là layout của mình.

import {
  AppLayout,
  BreadcrumbGroup,
  Container,
  ContentLayout,
  Flashbar,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
  SplitPanel,
} from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";

const LOCALE = import.meta.env.VITE_I8N_LOCALE;

export default function ExampleLayout() {
  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AppLayout
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: "Home", href: "#" },
              { text: "Service", href: "#" },
            ]}
          />
        }
        navigationOpen={true}
        navigation={
          <SideNavigation
            header={{
              href: "#",
              text: "Service name",
            }}
            items={[{ type: "link", text: `Page #1`, href: `#` }]}
          />
        }
        notifications={
          <Flashbar
            items={[
              {
                type: "info",
                dismissible: true,
                content: "This is an info flash message.",
                id: "message_1",
              },
            ]}
          />
        }
        toolsOpen={true}
        tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
        content={
          <ContentLayout
            header={
              <Header variant="h1" info={<Link variant="info">Info</Link>}>
                Page header
              </Header>
            }
          >
            <Container
              header={
                <Header variant="h2" description="Container description">
                  Container header
                </Header>
              }
            >
              <div className="contentPlaceholder" />
            </Container>
          </ContentLayout>
        }
        splitPanel={
          <SplitPanel header="Split panel header">
            Split panel content
          </SplitPanel>
        }
      />
    </I18nProvider>
  );
}
