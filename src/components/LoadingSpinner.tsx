import { CircularProgress, Stack, Typography } from "@mui/material";
import { Scaled } from "../constants";

interface LoadingSpinnerProps {
  text: string;
}

const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <Stack alignItems="center" spacing={2}>
      <CircularProgress sx={{ color: "text.secondary" }} />
      <Typography
        color="text.secondary"
        textAlign="center"
        fontWeight="bold"
        sx={{
          fontSize: {
            md: Scaled.rem(16),
            xs: Scaled.rem(14),
          },
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};

export default LoadingSpinner;
