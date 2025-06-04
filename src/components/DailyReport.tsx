import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Archive as ArchiveIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  date: Date;
  activity: string;
}

const DailyReport: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        date: new Date(),
        activity: newActivity.trim()
      };
      setLogs([...logs, newLog]);
      setNewActivity('');
    }
  };

  const handleDeleteActivity = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const handleArchive = () => {
    setArchiveDialogOpen(true);
  };

  const confirmArchive = () => {
    setLogs([]);
    setArchiveDialogOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Daily Report
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArchiveIcon />}
            onClick={handleArchive}
            color="primary"
          >
            Archive
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Aktivitas Hari Ini"
            variant="outlined"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddActivity();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddActivity}
            disabled={!newActivity.trim()}
          >
            Tambah
          </Button>
        </Box>

        <List>
          {logs.map((log) => (
            <ListItem
              key={log.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDeleteActivity(log.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={log.activity}
                secondary={format(log.date, 'dd MMMM yyyy HH:mm')}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Konfirmasi Arsip</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin mengarsipkan semua log dan memulai pencatatan baru?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Batal</Button>
          <Button onClick={confirmArchive} color="primary" variant="contained">
            Arsip
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyReport; 