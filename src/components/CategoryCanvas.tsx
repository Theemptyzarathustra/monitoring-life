import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Stack, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, Slider, Input, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Excalidraw, exportToCanvas, serializeAsJSON, restoreElements, restoreAppState } from '@excalidraw/excalidraw';

interface CategoryCanvasProps {
  storageKey: string;
}

const CANVAS_W = 720;
const CANVAS_H = 480;

const getExcalidrawKey = (storageKey: string) => `${storageKey}_excalidraw`;

const CategoryCanvas: React.FC<CategoryCanvasProps> = ({ storageKey }) => {
  const excalRef = useRef<any>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [appState, setAppState] = useState<any>({});
  const [history, setHistory] = useState<any>(null);
  const [savedList, setSavedList] = useState<string[]>(() => {
    const saved = localStorage.getItem(getExcalidrawKey(storageKey) + '_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [fullscreen, setFullscreen] = useState(false);

  // Load last saved excalidraw data
  useEffect(() => {
    const saved = localStorage.getItem(getExcalidrawKey(storageKey));
    if (saved) {
      try {
        const { elements, appState, history } = JSON.parse(saved);
        setElements(restoreElements(elements, null));
        setAppState(restoreAppState(appState, null));
        setHistory(history);
      } catch {}
    }
  }, [storageKey]);

  // Save excalidraw data
  const saveToStorage = () => {
    if (!excalRef.current) return;
    const api = excalRef.current;
    const data = api.getSceneElements();
    const appState = api.getAppState();
    const history = api.getHistory();
    localStorage.setItem(getExcalidrawKey(storageKey), JSON.stringify({ elements: data, appState, history }));
  };

  // Save to list
  const saveToList = () => {
    if (!excalRef.current) return;
    const api = excalRef.current;
    const data = api.getSceneElements();
    const appState = api.getAppState();
    const history = api.getHistory();
    const json = serializeAsJSON(data, appState, history, null);
    setSavedList((prev) => {
      const updated = [json, ...prev];
      localStorage.setItem(getExcalidrawKey(storageKey) + '_list', JSON.stringify(updated));
      return updated;
    });
  };

  // Load from list
  const handleLoadFromList = (json: string) => {
    try {
      const { elements, appState, history } = JSON.parse(json);
      setElements(restoreElements(elements, null));
      setAppState(restoreAppState(appState, null));
      setHistory(history);
      saveToStorage();
    } catch {}
  };

  // Delete from list
  const handleDeleteFromList = (idx: number) => {
    setSavedList((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      localStorage.setItem(getExcalidrawKey(storageKey) + '_list', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset canvas
  const handleReset = () => {
    setElements([]);
    setAppState({});
    setHistory(null);
    localStorage.removeItem(getExcalidrawKey(storageKey));
  };

  // Fullscreen
  const handleFullscreen = () => {
    setFullscreen(true);
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.requestFullscreen?.();
      }
    }, 100);
  };
  const handleExitFullscreen = () => {
    document.exitFullscreen?.();
    setFullscreen(false);
  };

  // Render thumbnail for list (canvas)
  const renderThumbnail = (json: string) => {
    try {
      const { elements, appState } = JSON.parse(json);
      const canvas = exportToCanvas({ elements: restoreElements(elements, null), appState: restoreAppState(appState, null), files: {} });
      return <img src={canvas.toDataURL()} alt="thumb" style={{ width: 80, height: 54, border: '1px solid #bbb', borderRadius: 4, background: '#fff' }} />;
    } catch {
      return null;
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: fullscreen ? '100vw' : CANVAS_W, height: fullscreen ? '100vh' : 'auto', bgcolor: '#f7fafd', p: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button variant="outlined" color="primary" onClick={saveToStorage}>Simpan</Button>
        <Button variant="outlined" color="success" onClick={saveToList}>Simpan ke List</Button>
        <Button variant="outlined" color="error" onClick={handleReset}>Reset Canvas</Button>
        {!fullscreen && <IconButton onClick={handleFullscreen}><FullscreenIcon /></IconButton>}
        {fullscreen && <IconButton onClick={handleExitFullscreen}><FullscreenExitIcon /></IconButton>}
      </Stack>
      <Box sx={{ height: 500, border: '2px solid #1976d2', borderRadius: 2, background: '#fff', mb: 2 }}>
        <Excalidraw
          ref={excalRef}
          initialData={{ elements, appState, history }}
          onChange={(els, app, hist) => {
            setElements(els);
            setAppState(app);
            setHistory(hist);
          }}
          theme="light"
        />
      </Box>
      {savedList.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Riwayat Canvas:</Typography>
          <Stack direction="row" spacing={2}>
            {savedList.map((json, idx) => (
              <Box key={idx} sx={{ position: 'relative' }}>
                <Box onClick={() => handleLoadFromList(json)} style={{ cursor: 'pointer' }}>
                  {renderThumbnail(json)}
                </Box>
                <IconButton size="small" color="error" sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => handleDeleteFromList(idx)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default CategoryCanvas; 