import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween
} from "@cloudscape-design/components";
import { Rulesets } from "./Rulesets";
import { UploadRuleset } from "./UploadRuleset";
import { RunJob } from "./RunJob";
import { JobInfo } from "./JobInfo";
import { RulesetAPI } from "../objects/api";

export default function RulesetManagementPage() {
  // Quản lý state chung cho các component
  const [rulesets, setRulesets] = useState([]);
  const [lastJobRunId, setLastJobRunId] = useState<string | null>(null);

  // Sử dụng useQuery để lấy dữ liệu từ API
  const { data: apiRulesets } = useQuery({
    queryKey: ['allRulesets'],
    queryFn: () => RulesetAPI.getAllRulesets(),
    refetchInterval: 1000, // Refetch every second to sync with API changes
  });

  // Đồng bộ state với dữ liệu từ API
  useEffect(() => {
    if (apiRulesets) {
      setRulesets(apiRulesets);
    }
  }, [apiRulesets]);

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
          <Rulesets 
            rulesets={rulesets}
          />
          <UploadRuleset 
            rulesets={rulesets}
            setRulesets={setRulesets}
          />
          <RunJob onJobRunComplete={setLastJobRunId} />
          <JobInfo lastJobRunId={lastJobRunId} />
        </SpaceBetween>
      </Container>
    </ContentLayout>
  );
}