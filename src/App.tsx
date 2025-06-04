import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MonitoringMyLife from './components/MonitoringMyLife';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MonitoringMyLife />
    </ThemeProvider>
  );
}

export default App;
