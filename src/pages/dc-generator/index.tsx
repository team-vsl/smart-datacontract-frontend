import {
  Container,
  ContentLayout,
  ColumnLayout,
  Header,
  Link,
} from "@cloudscape-design/components";

// Import components
import Messages from "./components/messages";
import ScrollableContainer from "@/components/scrollable-container";
import UserInput from "./components/user-input";

export default function DataContractGeneratorPage() {
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
        >
          <div className="contentPlaceholder" />
        </Container>
      </div>
    </ContentLayout>
  );
}
