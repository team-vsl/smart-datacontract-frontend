import { useMutation } from "@tanstack/react-query";
import {
  Container,
  ContentLayout,
  ColumnLayout,
  Box,
  LiveRegion,
  Button,
  Header,
  Link,
} from "@cloudscape-design/components";
import LoadingBar from "@cloudscape-design/chat-components/loading-bar";

// Import apis
import {
  reqGenerateDataContract,
  reqUploadDataContract,
} from "@/objects/data-contract/api";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";
import { CONV_ROLES, CONV_MSG_PLACEHOLDERS } from "@/objects/message/constants";

// Import components
import AppCodeEditor from "@/components/app-code-editor";
import Messages from "./components/messages";
import ScrollableContainer from "@/components/scrollable-container";
import UserInput from "./components/user-input";

// Import helpers
import { createMessage, createAIPlaceHolderMessage } from "@/objects/message";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import states
import { DCGeneratorStateManager } from "./state";
import {
  useDCGeneratorState,
  dcGeneratorStActions,
} from "@/states/dc-generator";

export default function DataContractGeneratorPage() {
  const state = useDCGeneratorState();

  const dcGenerationMutation = useMutation({
    mutationFn: reqGenerateDataContract,
  });

  const uploadDcMutation = useMutation({
    mutationFn: reqUploadDataContract,
  });

  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Data Contract Generator
        </Header>
      }
    >
      <div className="flex h-full gap-3">
        <Container
          className="w-7/12"
          fitHeight
          header={
            <>
              <Header
                variant="h2"
                className="mb-3"
                description="Create a data contract with GenAI"
              >
                Generator
              </Header>
              {/* {dcGenerationMutation.isPending && (
                <LoadingBar variant="gen-ai" />
              )} */}
            </>
          }
          footer={
            <UserInput
              isDisable={dcGenerationMutation.isPending}
              onAction={(value) => {
                const userMessage = createMessage(value);
                const aiPlaceHolderMessage = createAIPlaceHolderMessage(
                  CONV_MSG_PLACEHOLDERS.LOADING,
                );

                userMessage.id = `msg#${state.messages.length}`;
                aiPlaceHolderMessage.id = "assistant-placeholder";

                dcGeneratorStActions.addMessage(userMessage);
                dcGeneratorStActions.addMessage(aiPlaceHolderMessage);

                // Make api request
                dcGenerationMutation
                  .mutateAsync({
                    userInput: value,
                    isMock: CONFIGS.IS_MOCK_API,
                  })
                  .then((value: any) => {
                    let content = value.message;
                    dcGeneratorStActions.addMessage(
                      createMessage(content, CONV_ROLES.AI),
                      { canRemoveAIPlaceHolderMessage: true },
                    );
                  })
                  .catch((error: any) => {
                    let content = error.message;
                    dcGeneratorStActions.addMessage(
                      createMessage(content, CONV_ROLES.AI),
                      { canRemoveAIPlaceHolderMessage: true },
                    );
                  });
              }}
            />
          }
        >
          <ScrollableContainer>
            <Messages messages={state.messages} />
          </ScrollableContainer>
        </Container>
        <Container
          className="w-5/12"
          fitHeight
          header={
            <Header
              variant="h2"
              description="You can modify the result, check it and upload it to system."
            >
              Result / Editor
            </Header>
          }
          footer={
            <div className="flex gap-2">
              <Button
                disabled={uploadDcMutation.isPending}
                onClick={() => {
                  dcGeneratorStActions.setEditable(!state.isEditable);
                }}
              >
                {state.isEditable ? "Done" : "Edit"}
              </Button>
              <Button
                disabled={uploadDcMutation.isPending}
                onClick={() => {
                  uploadDcMutation
                    .mutateAsync({ content: state.code })
                    .then((value: any) =>
                      console.log("Upload data contract:", value),
                    );
                }}
                variant="primary"
              >
                Upload
              </Button>
            </div>
          }
        >
          <ScrollableContainer>
            <AppCodeEditor
              isEditable={state.isEditable}
              code={state.code}
              onCodeChange={(value) => dcGeneratorStActions.setContent(value)}
            />
          </ScrollableContainer>
        </Container>
      </div>
    </ContentLayout>
  );
}
