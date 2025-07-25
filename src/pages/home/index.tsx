import { Box, ContentLayout, SpaceBetween } from "@cloudscape-design/components";

export default function HomePage() {
  return (
    <ContentLayout>
      <SpaceBetween size="m" direction="vertical">
        <Box textAlign="center">
          <Box variant="h1">VPBank Hackathon Challenge #23 - Demo Application</Box>
          <Box variant="p" color="text-status-info">Built by VSL Team</Box>
        </Box>

        <Box textAlign="center">
          <img
            src="/public/TeamVSLHackathon.png"
            alt="VP Hackathon Logo"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '1030px'
            }}
          />
        </Box>
      </SpaceBetween>
    </ContentLayout>
  );
}
