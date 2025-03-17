import { Box } from '@mui/material';

export default function MarqueeEffect() {
  const baseData = `Live Odds • Real-Time Predictions • AI-Powered Analysis • Historical Data • Advanced Comprehension and Insights`;
  const dataToPass = baseData + "    " + baseData;

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#000000', // black background
        padding: 1,
        marginTop:"0",
      }}
    >
      <Box
        sx={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'marquee 35s linear infinite',
          color: '#13dfae', // neon green color
        }}
      >
        {dataToPass}
      </Box>

      {/* Horizontal line (HR) at the bottom */}
      <hr
        style={{
          border: '1px solid rgb(82, 84, 83)', // green color for the border
          marginTop: 2, // space between marquee and the line
          borderWidth: '0 0 1px 0', // only a bottom border to make it look like a thin line
        }}
      />

      {/* CSS keyframes animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </Box>
  );
}
