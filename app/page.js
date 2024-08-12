'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Typography, Modal, Stack,TextField, Button} from '@mui/material';
import {collection, query, getDocs, deleteDoc, setDoc, setOpen, doc, getDoc} from 'firebase/firestore';
import { Stoke } from "next/font/google";

export default function Home() {
  const [inventory,setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore,'inventory'));
    const docs = await(getDocs(snapshot));
    const inventoryList = [];

    docs.forEach((doc) =>{
      inventoryList.push({
         name: doc.id,
         ...doc.data(),
      })
    });

    setInventory(inventoryList);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore,'inventory'),item);
    const docsnapshot = await(getDoc(docRef));

    if (docsnapshot.exists()) {
      const {quantity} = docsnapshot.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore,'inventory'),item);
    const docsnapshot = await(getDoc(docRef));

    if (docsnapshot.exists()) {
      const {quantity} = docsnapshot.data();
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width='100vw' height='100vh' display='flex' justifyContent='center' alignItems='center' gap={2} flexDirection='column'>

      <Modal open={open} onClose={handleClose}>
        <Box position='absolute' top='50%' left='50%' sx={{transform: 'translate(-50%,-50%)'}} width='400' bgcolor='white' border='2px solid #000' boxShadow={24} p={4} display='flex' flexDirection='column' gap={3}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField variant='outlined' fullWidth value={itemName} onChange={(e) => {setItemName(e.target.value)}}></TextField>
            <Button variant='outlined' onClick={()=>{addItem(itemName); setItemName(''); handleClose();}}>Add</Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant='contained' onClick={()=> handleOpen()}>
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box width="800px" height='100px' bgcolor={"#ADD8E6"}>
          <Typography variant='h2' color='#333' alignContent="center" display="flex" justifyContent="center"> Inventory Space</Typography>
          </Box>

        <Stack width='800px' height='300px' spacing={2} overflow='auto'>
          {
            inventory.map(({name,quantity}) => (
              <Box key={name} width='800px' minHeight='150px' display='flex' alignItems='center' justifyContent='space-between' bgcolor='#f0f0f0' spacing={5}>
                <Typography variant='h3' textAlign='center' margin={2}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant='h3' textAlign='center'>{quantity}</Typography>
                <Stack direction='row' margin={2} spacing={2}>
                  <Button variant='contained' onClick={()=>addItem(name)}>Add</Button>
                  <Button variant='contained' onClick={()=>removeItem(name)}>Remove</Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>

    </Box>
  );
}
