'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { 
  Box, Typography, Modal, Stack, TextField, Button, 
  Container, Paper, IconButton, Divider, Tooltip
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Add, Remove, Delete, Inventory2 } from '@mui/icons-material';
import { collection, query, getDocs, deleteDoc, setDoc, doc, getDoc } from 'firebase/firestore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [filter, setFilter] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const { quantity } = docSnapshot.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const { quantity } = docSnapshot.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          <Inventory2 sx={{ mr: 1, verticalAlign: 'middle' }} />
          Inventory Management
        </Typography>

        <Modal open={open} onClose={handleClose}>
          <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 4, outline: 'none' }}>
            <Typography variant="h6" gutterBottom>Add New Item</Typography>
            <Stack direction="row" spacing={2}>
              <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item name" />
              <Button variant="contained" onClick={() => { if (itemName.trim()) { addItem(itemName.trim()); setItemName(''); handleClose(); } }}>Add</Button>
            </Stack>
          </Paper>
        </Modal>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <TextField variant="outlined" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter items..." sx={{ flexGrow: 1, mr: 2 }} />
          <Button variant="contained" onClick={handleOpen} startIcon={<Add />}>Add New Item</Button>
        </Box>

        <Paper elevation={3}>
          {inventory.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase())).map(({ name, quantity }, index) => (
            <Box key={name}>
              {index > 0 && <Divider />}
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ mr: 2 }}>{quantity}</Typography>
                  <Tooltip title="Add"><IconButton onClick={() => addItem(name)} color="primary"><Add /></IconButton></Tooltip>
                  <Tooltip title="Remove"><IconButton onClick={() => removeItem(name)} color="secondary"><Remove /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton onClick={() => removeItem(name)} color="error"><Delete /></IconButton></Tooltip>
                </Box>
              </Box>
            </Box>
          ))}
          {inventory.length === 0 && (
            <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
              No items in inventory. Add some items to get started!
            </Typography>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
