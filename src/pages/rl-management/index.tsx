import {
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import Ruleset from "./components/rulesets";
import { CheckRuleset } from "./components/check-ruleset";
import { UploadRuleset } from "./components/upload-ruleset";

export default function RulesetManagementPage() {
  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          info={<Link variant="info">Info</Link>}
          description="Quản lý Ruleset"
        >
          Ruleset Management
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Ruleset />
        <CheckRuleset />
        <UploadRuleset />
      </SpaceBetween>
    </ContentLayout>
  );
}
