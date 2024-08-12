'use client';

import { useState, useEffect } from 'react';
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    inventoryList.sort((a, b) => b.name.localeCompare(a.name));
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="90vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={5}
      mt={7} 
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top="50%" 
          left="50%"
          width={400}
          bgcolor="#FFFFFF"
          border="2px solid #CCCCCC"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6" color="#333333">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth 
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: '#7D00FF', '&:hover': { backgroundColor: '#5E00B3' }}}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button> 
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2} mb={2}>
        <Button 
          variant="contained" 
          color="primary"
          sx={{ backgroundColor: '#7D00FF', '&:hover': { backgroundColor: '#5E00B3' }}}
          onClick={() => {
            handleOpen();
          }}
        >
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ 
            width: '200px',
            bgcolor: '#FFFFFF',
            border: '1px solid #DDDDDD',
            borderRadius: '6px'
          }}
        />
      </Stack>

      <Box 
        width="110vw" 
        height="200vh"
        maxWidth="1000px"
        border="1px solid #DDDDDD" 
        borderRadius={2} 
        overflow="hidden"
        bgcolor="#FFFFFF"
      >
        <Box 
          height="120px"
          bgcolor="#7D00FF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
        >
          <Typography variant="h3" color="#FFFFFF">
            Pantry Management
          </Typography>
        </Box>
        <Stack 
          spacing={2} 
          overflow="auto" 
          p={2}
          direction="row"
          flexWrap="wrap"
          gap={2}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box 
              key={name} 
              width="200px"
              height="150px"
              display="flex" 
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bgColor="#FFFFFF"
              padding={2}
              borderRadius={2}
              boxShadow={2}
              border="1px solid #DDDDDD"
            >
              <Typography 
                variant="h6" 
                marginTop={0}
                color="#333333"
                textAlign="center"
                flexGrow={1}
                mb={1}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant="h6" 
                color="#333333"
                textAlign="center"
                flexShrink={0}
                mb={1}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained"
                  color="primary"
                  sx={{ backgroundColor: '#7D00FF', '&:hover': { backgroundColor: '#5E00B3' }}}
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ backgroundColor: '#7D00FF', '&:hover': { backgroundColor: '#5E00B3' }}}
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
