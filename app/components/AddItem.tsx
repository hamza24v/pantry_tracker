import React, { useState, MouseEvent, ChangeEvent } from "react";
import { TextField, Button } from "@mui/material";
import { useItems } from "../ItemsContext";

type Item = {
  id?: string;
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
    name: "",
    price: 0,
    quantity: 0,
  });

  if (!showModal) return null;

  const handleAddItem = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await addItem(newItem);
    setNewItem({ name: "", price: 0, quantity: 0 });
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
      <div className="bg-slate-700 p-6 rounded shadow-lg">
        <h2 className="text-xl text-center mb-4">Add New Item</h2>
        <form className="grid grid-cols gap-4 items-center justify-between">
          <TextField
            className="col-span-2 rounded-lg"
            sx={{ bgcolor: "white" }}
            label="Enter Item"
            variant="filled"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />

          <TextField
            className="col-span-1 rounded-lg"
            sx={{ bgcolor: "white" }}
            label="Enter Price"
            value={newItem.price === 0 ? "" : newItem.price}
            onChange={handlePriceChange}
          />
          <TextField
            className="col-span-1 rounded-lg"
            sx={{ bgcolor: "white" }}
            label="Enter Quantity"
            variant="filled"
            value={newItem.quantity === 0 ? "" : newItem.quantity}
            onChange={handleQuantityChange}
          />
          <Button
          className="col-span-2 rounded-lg"
            size="large"
            variant="contained"
            sx={{ bgcolor: "#37376b" }}
            type="button"
            onClick={handleAddItem}
          >
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};
