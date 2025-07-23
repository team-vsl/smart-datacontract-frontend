import { Box } from "@cloudscape-design/components";

export default function HomePage() {
  return (
    <div className="text-center space-y-6">

      <Box variant="h1">
        Chào mừng tới ứng dụng Demo của VP Hackathon Challenge #23
      </Box>
      <Box variant="samp">Built by VSL Team</Box>

      <img
        src="/public/TeamVSLHackathon.png"
        alt="VP Hackathon Logo"
        className="mx-auto rounded-lg shadow-lg"
      />
    </div>
  );
}
