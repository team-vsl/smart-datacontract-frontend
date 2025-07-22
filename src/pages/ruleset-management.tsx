import { useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Link,
} from "@cloudscape-design/components";
import { RulesetsAccordion } from "./RulesetsAccordion";
import { UploadRulesetAccordion } from "./UploadRulesetAccordion";
import { initialRulesets } from "../states/ruleset-state";

export default function RulesetManagementPage() {
  // Quản lý state chung cho cả hai component
  const [rulesets, setRulesets] = useState(initialRulesets);

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Ruleset Management
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Quản lý Ruleset">
            Ruleset Management
          </Header>
        }
      >
        <div className="space-y-4">
          <RulesetsAccordion 
            rulesets={rulesets} 
          />
          <UploadRulesetAccordion 
            rulesets={rulesets}
            setRulesets={setRulesets}
          />
        </div>
      </Container>
    </ContentLayout>
  );
}