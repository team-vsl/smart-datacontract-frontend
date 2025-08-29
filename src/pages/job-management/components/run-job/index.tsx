import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Container,
  Header,
  Select,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
} from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";

// Import components
import InteractionPart from "./interaction-part";
import ResultPart from "./result-part";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as JobAPI from "@/objects/job/api";

// Import states
import { RunJobStateManager } from "./state";
import { jobStActions, useJobState } from "@/states/job";

// Import types
import type { TJobRun } from "@/objects/job/types";

type RunJobProps = {};

export default function RunJob(props: RunJobProps) {
  const queryClient = useQueryClient();

  // State cho accordion
  const [state, stateFns] = useStateManager(
    RunJobStateManager.getInitialState(),
    RunJobStateManager.buildStateModifiers,
  );

  // Sử dụng useMutation để reject data contract
  const runJobMutation = useMutation({
    mutationFn: async (jobName: string) => {
      let isMock = CONFIGS.IS_MOCK_API;

      // Kiểm tra data contract có tồn tại không
      const job = await JobAPI.reqGetJob({ jobName, isMock });

      if (!job) {
        throw new Error(`Cannot find Job with name: ${jobName}`);
      }

      // Reject data contract và cập nhật state
      const startJobRunResPayload = await JobAPI.reqStartJobRun({
        jobName,
        isMock,
      });

      const newJobRun = await JobAPI.reqGetJobRun({
        id: startJobRunResPayload.jobRunId,
        jobName: state.currentJobName!,
      });

      jobStActions.addJobRun(newJobRun);

      // Lấy contract đã cập nhật
      return newJobRun;
    },
    onSuccess: (newJobRun: TJobRun | undefined) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["dataContracts"] });

      stateFns.setResult({
        message: `Running job: ${state.currentJobName}`,
        data: newJobRun,
      });
    },
    onError: (error: any) => {
      stateFns.setResult({
        error: error,
        data: undefined,
      });
    },
  });

  const handleRunJob = function () {
    if (!state.currentJobName) return;
    runJobMutation.mutate(state.currentJobName);
  };

  return (
    <ExpandableSection
      headerText="Run Job"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <InteractionPart
          isRunning={state.isRunning}
          currentJobName={state.currentJobName || ""}
          setCurrentJobName={stateFns.setCurrentJobName}
          handleRunJob={handleRunJob}
        />

        <ResultPart
          isPending={runJobMutation.isPending}
          result={state.result}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
