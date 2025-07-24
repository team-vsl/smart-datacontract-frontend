import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween
} from "@cloudscape-design/components";
import { RulesetsAccordion } from "./RulesetsAccordion";
import { UploadRulesetAccordion } from "./UploadRulesetAccordion";
import { RunJobAccordion } from "./RunJobAccordion";
import { JobInfoAccordion } from "./JobInfoAccordion";
import { initialRulesets } from "../states/ruleset-state";

export default function RulesetManagementPage() {
  // Quản lý state chung cho các component
  const [rulesets, setRulesets] = useState(initialRulesets);
  const [lastJobRunId, setLastJobRunId] = useState<string | null>(null);

  // Sử dụng useQuery để lưu trữ danh sách trong cache
  useQuery({
    queryKey: ['allRulesets'],
    queryFn: () => rulesets,
    initialData: initialRulesets,
  });

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
        <SpaceBetween size="l">
          <RulesetsAccordion 
            rulesets={rulesets}
          />
          <UploadRulesetAccordion 
            rulesets={rulesets}
            setRulesets={setRulesets}
          />
          <RunJobAccordion onJobRunComplete={setLastJobRunId} />
          <JobInfoAccordion lastJobRunId={lastJobRunId} />
        </SpaceBetween>
      </Container>
    </ContentLayout>
  );
}