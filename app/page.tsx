"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { AddItem } from "./components/AddItem";
import { useItems } from "./ItemsContext";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
  const { items, total, deleteItem, updateItemQuantity } = useItems();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.name.toLowerCase().includes(searchItem.toLowerCase())
      )
    );
  }, [items, searchItem]);

  const incrementQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    }
  };

  const decrementQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item && item.quantity > 0) {
      updateItemQuantity(id, item.quantity - 1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 ">
      <div className="z-10  max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-950 p-4 rounded-lg ">
          <div className="grid grid-cols-6 gap-4 justify-evenly">
            <TextField
              className="col-span-4 text-white"
              label="Search for item"
              value={searchItem}
              sx={{
                bgcolor: "rgb(51 65 85)",
                input: { color: "white" },
                label: { color: "white" },
              }}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            <Button
              className="col-span-2"
              size="large"
              variant="contained"
              sx={{ bgcolor: "#37376b", marginBottom: "16px" }}
              onClick={() => setShowModal(true)}
            >
              Add New Item
            </Button>
            <AddItem showModal={showModal} setShowModal={setShowModal} />
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-9 gap-4 text-white">
              <span className="col-span-4 font-bold">Name</span>
              <span className="col-span-2 font-bold">Price</span>
              <span className="col-span-2 font-bold">Quantity</span>
              <span className="col-span-1"></span>
            </div>
            <ul>
              {filteredItems.map((item, id) => (
                <li
                  key={id}
                  className="flex justify-between gap-4 my-4 w-full bg-slate-700"
                >
                  <div className="p-4 w-full items-center text-white text-lg flex justify-between">
                    <span className="text-xl col-span-4">{item.name}</span>
                    <span className="text-xl col-span-2">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 flex flex-col items-center">
                      <Button onClick={() => incrementQuantity(item.id)}>
                        <AddIcon />
                      </Button>
                      <span className="text-xl">{item.quantity}</span>
                      <Button onClick={() => decrementQuantity(item.id)}>
                        <RemoveIcon />
                      </Button>
                    </div>
                  <Button
                    size="large"
                    sx={{ bgcolor: "#37376b" }}
                    variant="contained"
                    onClick={() => deleteItem(item.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          {filteredItems.length >= 1 ? (
            <div className="text-lg text-white flex p-3 justify-between">
              <span>Total</span>
              <span>${total}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </main>
  );
}
