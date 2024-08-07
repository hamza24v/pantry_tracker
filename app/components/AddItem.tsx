'use client'
import React, { useState, MouseEvent, ChangeEvent } from "react";
import {v4 as uuidv4 } from 'uuid'
import { TextField, Button } from "@mui/material";
import { useItems } from "../ItemsContext";
import { Snapshot } from './Snapshot'; 
import LocalSeeIcon from '@mui/icons-material/LocalSee';
import Tooltip from '@mui/material/Tooltip';

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type AddItemProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddItem: React.FC<AddItemProps> = ({
  showModal,
  setShowModal,
}) => {
  const { addItem } = useItems();
  const [newItem, setNewItem] = useState<Item>({
    id: uuidv4(),
    name: "",
    price: 0,
    quantity: 0,
  });

  const [showCamera, setShowCamera] = useState(false);

  if (!showModal) return null;

  const handleAddItem = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await addItem(newItem);
    setNewItem({id: uuidv4(), name: "", price: 0, quantity: 0 });
    setShowModal(false);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setNewItem({ ...newItem, price: parseFloat(value) || 0 });
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setNewItem({ ...newItem, quantity: parseInt(value) || 0 });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-slate-700 p-6 rounded-lg shadow-lg">
        <button
          className=" absolute top-0 right-2 text-white text-2xl"
          onClick={() => setShowModal(false)}
        >
          X
        </button>
        {showCamera ? (
          <Snapshot />
        ) : (
      <div>
          <h2 className="text-xl text-center mb-4">Add New Item</h2>
          <form className="grid grid-cols-4 gap-4 max-w-[350px] items-center justify-center">
            <TextField
              className="col-span-4 rounded-lg"
              sx={{ bgcolor: "white" }}
              label="Enter Item"
              variant="filled"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <TextField
              className="col-span-2 rounded-lg"
              sx={{ bgcolor: "white" }}
              label="Quantity"
              variant="filled"
              value={newItem.quantity === 0 ? "" : newItem.quantity}
              onChange={handleQuantityChange}
            />
            <TextField
              className="col-span-2 rounded-lg"
              sx={{ bgcolor: "white" }}
              label="Price"
              variant="filled"
              value={newItem.price === 0 ? "" : newItem.price}
              onChange={handlePriceChange}
            />
            <Button
              className="col-span-2 rounded-lg"
              size="large"
              variant="contained"
              sx={{ bgcolor: "#3232a7" }}
              type="button"
              onClick={handleAddItem}
            >
              Add
            </Button>
            <Tooltip title="Snap an item">
              <LocalSeeIcon
                className="cursor-pointer"
                onClick={() => setShowCamera(true)}/>
            </Tooltip>
           

          </form>
        </div>
        )}
        
      </div>
    </div>
  );
};
