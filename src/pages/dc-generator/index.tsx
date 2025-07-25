import {
  Container,
  ContentLayout,
  ColumnLayout,
  Button,
  Header,
  Link,
} from "@cloudscape-design/components";

// Import components
import Messages from "./components/messages";
import ScrollableContainer from "@/components/scrollable-container";
import UserInput from "./components/user-input";
import Editor from "./components/editor";

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
            <Header variant="h2" description="Tạo data contract với GenAI">
              Generator
            </Header>
          }
          footer={<UserInput />}
        >
          <ScrollableContainer>
            <Messages
              messages={[
                {
                  role: "ai",
                  content:
                    "Mình có thể giúp bạn tạo nhanh một data contract, chỉ cần bạn nhập mô tả dữ liệu mong muốn của bạn bên dưới",
                },
              ]}
            />
          </ScrollableContainer>
        </Container>
        <Container
          className="w-5/12"
          fitHeight
          header={
            <Header
              variant="h2"
              description="Bạn có thể xem chi tiết kết quả, điều chỉnh kết quả và tải kết quả lên ở đây"
            >
              Result / Editor
            </Header>
          }
          footer={
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  dcGeneratorStActions.setEditable(!state.isEditable);
                }}
              >
                {state.isEditable ? "Done" : "Edit"}
              </Button>
              <Button variant="primary">Submit</Button>
            </div>
          }
        >
          <Editor
            isEditable={state.isEditable}
            code={state.code}
            onCodeChange={(value) => dcGeneratorStActions.setContent(value)}
          />
        </Container>
      </div>
    </ContentLayout>
  );
}
