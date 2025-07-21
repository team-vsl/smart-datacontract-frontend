import {
  Container,
  ContentLayout,
  Header,
  Link,
} from "@cloudscape-design/components";

export default function DataContractGeneratorPage() {
  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Data Contract Generator
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Container description">
            Container header
          </Header>
        }
      >
        <div className="contentPlaceholder" />
      </Container>
    </ContentLayout>
  );
}
