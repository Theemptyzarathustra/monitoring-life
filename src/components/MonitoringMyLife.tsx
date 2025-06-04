import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Snackbar,
  Alert,
  Stack,
  Divider,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import MovingBlocksBackground from './MovingBlocksBackground';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Fab from '@mui/material/Fab';

const categories = [
  { key: 'health', label: 'Kesehatan', icon: <FavoriteIcon sx={{ fontSize: 36, color: '#e57373' }} />, color: '#e57373' },
  { key: 'finance', label: 'Keuangan', icon: <AttachMoneyIcon sx={{ fontSize: 36, color: '#43a047' }} />, color: '#43a047' },
  { key: 'career', label: 'Karir', icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#1976d2' }} />, color: '#1976d2' },
  { key: 'education', label: 'Pendidikan', icon: <MenuBookIcon sx={{ fontSize: 36, color: '#ffd54f' }} />, color: '#ffd54f' },
  { key: 'emotion', label: 'Emosi', icon: <EmojiEmotionsIcon sx={{ fontSize: 36, color: '#ffb74d' }} />, color: '#ffb74d' },
  { key: 'family', label: 'Keluarga', icon: <FamilyRestroomIcon sx={{ fontSize: 36, color: '#ba68c8' }} />, color: '#ba68c8' },
  { key: 'spiritual', label: 'Spiritual', icon: <SelfImprovementIcon sx={{ fontSize: 36, color: '#90caf9' }} />, color: '#90caf9' },
  { key: 'hobby', label: 'Hobi', icon: <SportsEsportsIcon sx={{ fontSize: 36, color: '#4db6ac' }} />, color: '#4db6ac' },
];

interface LogEntry {
  id: string;
  date: string;
  activity: string;
}

type LogsByCategory = {
  [key: string]: LogEntry[];
};

interface ArchiveItem {
  id: string;
  timestamp: string;
  logs: LogsByCategory;
}

const LOCAL_STORAGE_KEY = 'monitoring_my_life_logs';
const ARCHIVES_STORAGE_KEY = 'monitoring_my_life_logs_archives';
const ALERTS_STORAGE_KEY = 'monitoring_my_life_alerts';

const MonitoringMyLife: React.FC = () => {
  const [logs, setLogs] = useState<LogsByCategory>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error'; }>({ open: false, message: '', severity: 'success' });
  const [archiveDialog, setArchiveDialog] = useState(false);
  const [archivesDialog, setArchivesDialog] = useState(false);
  const [archives, setArchives] = useState<ArchiveItem[]>(() => {
    const saved = localStorage.getItem(ARCHIVES_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [noteDate, setNoteDate] = useState<string>('');
  const [alerts, setAlerts] = useState<{ [key: string]: { id: string, task: string, deadline: string, done: boolean }[] }>(() => {
    const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const [newAlertTask, setNewAlertTask] = useState('');
  const [newAlertDeadline, setNewAlertDeadline] = useState('');
  const [alertCategory, setAlertCategory] = useState<string>('health');
  const [showAlertList, setShowAlertList] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [cleanDialog, setCleanDialog] = useState(false);
  const [cleanArchiveDialog, setCleanArchiveDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [alertDate, setAlertDate] = useState<Date | null>(new Date());
  const [alertTime, setAlertTime] = useState<Date | null>(new Date());

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  React.useEffect(() => {
    localStorage.setItem(ARCHIVES_STORAGE_KEY, JSON.stringify(archives));
  }, [archives]);

  React.useEffect(() => {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ARCHIVES_STORAGE_KEY) {
        setArchives(JSON.parse(e.newValue || '[]'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ALERTS_STORAGE_KEY) {
        setAlerts(JSON.parse(e.newValue || '{}'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Animated gradient background
  const animatedBg = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    background: 'linear-gradient(270deg, #f7fafd, #e3f0fc, #f7fafd, #e3f0fc)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 18s ease-in-out infinite',
    '@keyframes gradientMove': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
  };

  const handleOpen = (key: string) => {
    setOpenCategory(key);
    setNewActivity('');
    setNoteDate('');
  };

  const handleClose = () => {
    setOpenCategory(null);
    setNewActivity('');
    setNoteDate('');
    setAnchorEl(null);
  };

  const handleAddActivity = () => {
    if (openCategory && newActivity.trim()) {
      const dateValue = selectedDate ? selectedDate : new Date();
      if (selectedTime) {
        dateValue.setHours(selectedTime.getHours());
        dateValue.setMinutes(selectedTime.getMinutes());
      }
      
      const newLog: LogEntry = {
        id: Date.now().toString(),
        date: dateValue.toISOString(),
        activity: newActivity.trim(),
      };
      setLogs((prev) => ({
        ...prev,
        [openCategory]: [...(prev[openCategory] || []), newLog],
      }));
      setNewActivity('');
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setSnackbar({ open: true, message: 'Catatan ditambahkan', severity: 'success' });
    }
  };

  const handleDeleteLog = (logId: string) => {
    if (!openCategory) return;
    setLogs((prev) => ({
      ...prev,
      [openCategory]: (prev[openCategory] || []).filter((log) => log.id !== logId),
    }));
    setSnackbar({ open: true, message: 'Catatan dihapus', severity: 'info' });
  };

  // Arsipkan seluruh data (dengan timestamp)
  const handleArchive = () => {
    const newArchive: ArchiveItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      logs: logs,
    };
    setArchives((prev) => [newArchive, ...prev]);
    setSnackbar({ open: true, message: 'Data diarsipkan!', severity: 'success' });
    setArchiveDialog(false);
  };

  // Restore data dari salah satu arsip
  const handleRestore = (archive: ArchiveItem) => {
    setLogs(archive.logs);
    setSnackbar({ open: true, message: 'Data arsip dimuat!', severity: 'success' });
    setArchivesDialog(false);
  };

  // Fungsi hapus arsip
  const handleDeleteArchive = (archiveId: string) => {
    setArchives((prev) => prev.filter(a => a.id !== archiveId));
    setSnackbar({ open: true, message: 'Arsip dihapus!', severity: 'info' });
  };

  const handleSave = () => {
    setSnackbar({ open: true, message: 'Data tersimpan!', severity: 'success' });
  };

  const handleAddAlert = () => {
    if (!newAlertTask.trim() || !alertDate || !alertTime || !alertCategory) return;
    
    const deadline = new Date(alertDate);
    deadline.setHours(alertTime.getHours());
    deadline.setMinutes(alertTime.getMinutes());
    
    setAlerts(prev => ({
      ...prev,
      [alertCategory]: [
        ...(prev[alertCategory] || []),
        { id: Date.now().toString(), task: newAlertTask.trim(), deadline: deadline.toISOString(), done: false }
      ]
    }));
    setNewAlertTask('');
    setAlertDate(new Date());
    setAlertTime(new Date());
    setShowAlertDialog(false);
  };

  const handleDoneAlert = (catKey: string, alertId: string) => {
    setAlerts(prev => ({
      ...prev,
      [catKey]: (prev[catKey] || []).map(a => a.id === alertId ? { ...a, done: true } : a)
    }));
  };

  const isCategoryOverdue = (catKey: string) => {
    const now = new Date();
    return (alerts[catKey] || []).some(a => !a.done && new Date(a.deadline) < now);
  };

  // Fungsi hapus alert
  const handleDeleteAlert = (catKey: string, alertId: string) => {
    setAlerts(prev => ({
      ...prev,
      [catKey]: (prev[catKey] || []).filter(a => a.id !== alertId)
    }));
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClean = () => {
    // Check if there's any data to clean
    const hasData = Object.values(logs).some(categoryLogs => categoryLogs.length > 0);
    
    if (hasData) {
      setCleanArchiveDialog(true);
    } else {
      setSnackbar({ open: true, message: 'Tidak ada data untuk dibersihkan', severity: 'info' });
    }
    handleClose();
  };

  const handleCleanWithArchive = () => {
    // First archive the data
    const newArchive: ArchiveItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      logs: logs,
    };
    setArchives((prev) => [newArchive, ...prev]);
    
    // Then clean the data
    setLogs({});
    setSnackbar({ open: true, message: 'Data diarsipkan dan dibersihkan!', severity: 'success' });
    setCleanArchiveDialog(false);
  };

  const handleCleanWithoutArchive = () => {
    setLogs({});
    setSnackbar({ open: true, message: 'Data dibersihkan!', severity: 'info' });
    setCleanDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <Box sx={{ minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', bgcolor: '#fff' }}>
        {/* Animated moving blocks background */}
        <MovingBlocksBackground />
        
        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          px: { xs: 1, sm: 3, md: 6 }, 
          py: { xs: 2, md: 6 } 
        }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Typography variant="h3" align="center" fontWeight={700} color="#222" letterSpacing={1}>
              Monitoring My Life
            </Typography>
            <IconButton
              onClick={handleClick}
              size="large"
              edge="end"
              color="inherit"
              aria-label="more"
              aria-controls={open ? 'more-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleClose(); setArchiveDialog(true); }}>
                <ListItemIcon>
                  <ArchiveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Arsipkan</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); setArchivesDialog(true); }}>
                <ListItemIcon>
                  <RestoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>List Arsip</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); setShowAlertDialog(true); }}>
                <ListItemIcon>
                  <EmojiEmotionsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Set Alert/Deadline</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClean}>
                <ListItemIcon>
                  <DeleteSweepIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Bersihkan Data</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <Typography align="center" color="text.secondary" sx={{ mb: 5, fontSize: 18 }}>
            Dashboard harian untuk mencatat dan memantau berbagai aspek hidup Anda secara modern dan terorganisir.
          </Typography>
          
          <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ minHeight: { xs: 'auto', md: '70vh' } }}>
            {categories.map((cat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={cat.key}>
                <Paper elevation={2}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 3,
                    bgcolor: '#fff',
                    boxShadow: '0 2px 12px 0 #1976d20a',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: '0 6px 24px 0 #1976d233',
                      transform: 'translateY(-4px) scale(1.05)',
                    },
                    animation: isCategoryOverdue(cat.key)
                      ? 'pulseRed 0.7s infinite cubic-bezier(.4,0,.6,1)'
                      : `pulse 2.5s ${0.2 * idx}s infinite cubic-bezier(.4,0,.6,1)`,
                    '@keyframes pulseRed': {
                      '0%, 100%': { boxShadow: '0 2px 12px 0 #ff1744', transform: 'scale(1)' },
                      '50%': { boxShadow: '0 8px 32px 0 #ff1744', transform: 'scale(1.08)' },
                    },
                  }}
                  onClick={() => handleOpen(cat.key)}
                >
                  <Tooltip title={cat.label} arrow>
                    <IconButton
                      sx={{
                        pointerEvents: 'none',
                        mb: 1,
                        bgcolor: isCategoryOverdue(cat.key) ? '#ffebee' : '#e3f0fc',
                        color: isCategoryOverdue(cat.key) ? '#ff1744' : cat.color,
                        width: 64,
                        height: 64,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.15)' },
                        animation: isCategoryOverdue(cat.key)
                          ? 'iconPulseRed 0.7s infinite cubic-bezier(.4,0,.6,1)'
                          : undefined,
                        '@keyframes iconPulseRed': {
                          '0%, 100%': { boxShadow: '0 0 0 0 #ff1744', transform: 'scale(1)' },
                          '50%': { boxShadow: '0 0 16px 4px #ff1744', transform: 'scale(1.15)' },
                        },
                      }}
                    >
                      {cat.icon}
                    </IconButton>
                  </Tooltip>
                  <Typography variant="subtitle1" fontWeight={600} color="#222" sx={{ mt: 1, fontSize: 18 }}>{cat.label}</Typography>
                  {isCategoryOverdue(cat.key) && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, fontWeight: 700 }}>
                      Ada tugas belum selesai!
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Dialog untuk catatan per kategori */}
        <Dialog open={!!openCategory} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 700, letterSpacing: 1, color: '#1976d2', fontSize: 26, pb: 0 }}>
            {categories.find((c) => c.key === openCategory)?.label}
          </DialogTitle>
          <DialogContent sx={{ pb: 0, pt: 1 }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Catatan Hari Ini"
                variant="outlined"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddActivity();
                }}
                autoFocus
                size="small"
                sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Tanggal"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { bgcolor: '#f7fafd', borderRadius: 2 }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Waktu"
                    value={selectedTime}
                    onChange={(newValue) => setSelectedTime(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { bgcolor: '#f7fafd', borderRadius: 2 }
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleAddActivity} 
                  disabled={!newActivity.trim()} 
                  sx={{ 
                    fontWeight: 600, 
                    height: 40,
                    minWidth: 120
                  }}
                >
                  Tambah
                </Button>
              </Box>
            </Stack>
            <List>
              {(logs[openCategory || ''] || []).map((log) => (
                <ListItem key={log.id} secondaryAction={
                  <Tooltip title="Hapus catatan" arrow>
                    <IconButton edge="end" color="error" onClick={() => handleDeleteLog(log.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                } sx={{ borderRadius: 2, mb: 1, bgcolor: '#f7fafd' }}>
                  <ListItemText
                    primary={log.activity}
                    secondary={format(parseISO(log.date), "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: id })}
                    primaryTypographyProps={{ fontSize: 16, color: '#222' }}
                    secondaryTypographyProps={{ fontSize: 13, color: '#888' }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2, pt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ fontWeight: 600 }}
            >
              Simpan
            </Button>
            <Button onClick={handleClose} variant="contained" color="primary" sx={{ fontWeight: 600 }}>Tutup</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog konfirmasi arsip */}
        <Dialog open={archiveDialog} onClose={() => setArchiveDialog(false)}>
          <DialogTitle>Arsipkan Data</DialogTitle>
          <DialogContent>
            <Typography>Apakah Anda yakin ingin mengarsipkan seluruh data saat ini? Data arsip akan disimpan dengan timestamp.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setArchiveDialog(false)}>Batal</Button>
            <Button onClick={handleArchive} color="primary" variant="contained" startIcon={<ArchiveIcon />}>Arsipkan</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog list arsip */}
        <Dialog open={archivesDialog} onClose={() => setArchivesDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>List Arsip</DialogTitle>
          <DialogContent>
            {archives.length === 0 ? (
              <Typography color="text.secondary">Belum ada arsip.</Typography>
            ) : (
              <List>
                {archives.map((archive) => (
                  <React.Fragment key={archive.id}>
                    <ListItem
                      sx={{ borderRadius: 2, mb: 1, bgcolor: '#f7fafd', '&:hover': { bgcolor: '#e3f0fc' }, display: 'flex', alignItems: 'center' }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <ListItemText
                          primary={`Arsip: ${new Date(archive.timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                          secondary={`Jumlah kategori: ${Object.keys(archive.logs).length}`}
                        />
                      </Box>
                      <Tooltip title="Muat arsip ini" arrow>
                        <Button color="primary" variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleRestore(archive)} startIcon={<RestoreIcon />}>Load</Button>
                      </Tooltip>
                      <Tooltip title="Hapus arsip ini" arrow>
                        <Button color="error" variant="outlined" size="small" onClick={() => handleDeleteArchive(archive.id)} startIcon={<DeleteIcon />}>Delete</Button>
                      </Tooltip>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setArchivesDialog(false)}>Tutup</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog tambah alert */}
        <Dialog open={!!showAlertDialog} onClose={() => setShowAlertDialog(false)}>
          <DialogTitle>Tambah Tugas/Deadline</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: '100%', sm: 400 } }}>
              <Select 
                value={alertCategory} 
                onChange={e => setAlertCategory(e.target.value)} 
                fullWidth
                size="small"
                sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.key} value={cat.key}>{cat.label}</MenuItem>
                ))}
              </Select>
              <TextField 
                label="Tugas" 
                value={newAlertTask} 
                onChange={e => setNewAlertTask(e.target.value)} 
                fullWidth 
                size="small"
                sx={{ bgcolor: '#f7fafd', borderRadius: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Tanggal Deadline"
                    value={alertDate}
                    onChange={(newValue) => setAlertDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { bgcolor: '#f7fafd', borderRadius: 2 }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Waktu Deadline"
                    value={alertTime}
                    onChange={(newValue) => setAlertTime(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { bgcolor: '#f7fafd', borderRadius: 2 }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAlertDialog(false)}>Batal</Button>
            <Button 
              onClick={handleAddAlert} 
              variant="contained" 
              disabled={!newAlertTask.trim() || !alertDate || !alertTime}
              sx={{ minWidth: 120 }}
            >
              Tambah
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button untuk alert di pojok kanan bawah */}
        <Fab color="warning" aria-label="alert" sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={() => setShowAlertList(true)}>
          <NotificationsIcon />
        </Fab>
        {/* Dialog list alert */}
        <Dialog open={showAlertList} onClose={() => setShowAlertList(false)} fullWidth maxWidth="xs">
          <DialogTitle>Daftar Tugas/Deadline</DialogTitle>
          <DialogContent>
            {Object.keys(alerts).length === 0 || Object.values(alerts).every(arr => arr.length === 0) ? (
              <Typography color="text.secondary">Belum ada alert.</Typography>
            ) : (
              <List>
                {categories.map(cat =>
                  (alerts[cat.key] || []).map(alert => (
                    <ListItem key={alert.id} sx={{ bgcolor: alert.done ? '#e0f2f1' : '#fff', borderRadius: 2, mb: 1, alignItems: 'flex-start' }}>
                      <Box sx={{ minWidth: 8, width: 8, height: 40, borderRadius: 2, bgcolor: cat.color, mr: 2, mt: 0.5 }} />
                      <ListItemText
                        primary={<><b>{cat.label}</b>: {alert.task}</>}
                        secondary={`Deadline: ${new Date(alert.deadline).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}${alert.done ? ' (Selesai)' : ''}`}
                      />
                      {!alert.done && (
                        <Button size="small" color="success" variant="contained" onClick={() => handleDoneAlert(cat.key, alert.id)} sx={{ mt: 1, mr: 1 }}>Selesai</Button>
                      )}
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteAlert(cat.key, alert.id)} sx={{ mt: 1 }}>Hapus</Button>
                    </ListItem>
                  ))
                )}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAlertList(false)}>Tutup</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog konfirmasi arsip sebelum bersihkan */}
        <Dialog open={cleanArchiveDialog} onClose={() => setCleanArchiveDialog(false)}>
          <DialogTitle>Arsipkan Data Sebelum Dibersihkan?</DialogTitle>
          <DialogContent>
            <Typography>
              Data saat ini akan dihapus. Apakah Anda ingin mengarsipkan data terlebih dahulu?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCleanArchiveDialog(false)}>Batal</Button>
            <Button onClick={() => setCleanDialog(true)} color="error">
              Hapus Tanpa Arsip
            </Button>
            <Button onClick={handleCleanWithArchive} color="primary" variant="contained">
              Arsip & Bersihkan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog konfirmasi hapus tanpa arsip */}
        <Dialog open={cleanDialog} onClose={() => setCleanDialog(false)}>
          <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
          <DialogContent>
            <Typography color="error">
              PERHATIAN: Data akan dihapus permanen tanpa diarsipkan. Tindakan ini tidak dapat dibatalkan.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCleanDialog(false)}>Batal</Button>
            <Button onClick={handleCleanWithoutArchive} color="error" variant="contained">
              Hapus Data
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={1800}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ fontWeight: 500, fontSize: 16 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default MonitoringMyLife; 