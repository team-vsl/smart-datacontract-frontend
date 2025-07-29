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
import { CheckRuleset } from "./components/check-ruleset";
import { UploadRuleset } from "./components/upload-ruleset";

// Import states
import { useRulesetState, rulesetStActions } from "@/states/ruleset";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

export default function RulesetManagementPage() {
  // Quản lý state chung cho các component
  const { rls } = useRulesetState();

  // Sử dụng useQuery để lấy dữ liệu từ API
  const { data: responsePayload } = useQuery({
    queryKey: ["allRulesets"],
    queryFn: () => RulesetAPI.reqGetAllRulesets({ isMock: true }),
    refetchInterval: 1000, // Refetch every second to sync with API changes
  });

  // Đồng bộ state với dữ liệu từ API
  useEffect(() => {
    if (responsePayload) {
      rulesetStActions.setRLS(responsePayload as TRuleset[]);
    }
  }, [responsePayload]);

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
        <Rulesets rulesets={rls} />
        <CheckRuleset rulesets={rls} />
        <UploadRuleset rulesets={rls} />
      </SpaceBetween>
    </ContentLayout>
  );
}
