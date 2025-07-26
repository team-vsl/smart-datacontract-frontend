import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import { Rulesets } from "./components/rulesets";
import { UploadRuleset } from "./components/upload-ruleset";
import { RunJob } from "./components/run-job";
import { JobInfo } from "./components/job-info";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

export default function RulesetManagementPage() {
  // Quản lý state chung cho các component
  const [rulesets, setRulesets] = useState<TRuleset[]>([]);
  const [lastJobRunId, setLastJobRunId] = useState<string | null>(null);

  // Sử dụng useQuery để lấy dữ liệu từ API
  const { data: responsePayload } = useQuery({
    queryKey: ["allRulesets"],
    queryFn: () => RulesetAPI.reqGetAllRulesets(),
    refetchInterval: 1000, // Refetch every second to sync with API changes
  });

  // Đồng bộ state với dữ liệu từ API
  useEffect(() => {
    if (responsePayload) {
      setRulesets(responsePayload.data);
    }
  }, [responsePayload]);

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
          <Rulesets rulesets={rulesets} />
          <UploadRuleset rulesets={rulesets} setRulesets={setRulesets} />
          <RunJob onJobRunComplete={setLastJobRunId} />
          <JobInfo lastJobRunId={lastJobRunId} />
        </SpaceBetween>
      </Container>
    </ContentLayout>
  );
}
