import { Box, createTheme, ThemeProvider } from "@mui/material";
import "./App.css";
import HomePage from "./pages/home/HomePage";

const theme = createTheme({
  typography: {
    fontFamily: ["Be Vietnam Pro", "sans-serif"].join(","),
  },
  palette: {
    text: { primary: "#CDD5E0", secondary: "#97A3B6" },
    background: { default: "#20293A", paper: "#111729" },
  },
});

function App() {
  return (
    <Box>
      <ThemeProvider theme={theme}>
        <HomePage />
      </ThemeProvider>
    </Box>
  );
}

export default App;
