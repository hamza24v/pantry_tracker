"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { AddItem } from "./components/AddItem";
import { useItems } from "./ItemsContext";

export default function Home() {
  const { items, total, deleteItem } = useItems();
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 ">
      <div className="z-10  max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-950 p-4 rounded-lg ">
          <div className="grid grid-cols-6 gap-4 justify-between">
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
              {items.map((item, id) => (
                <li
                  key={id}
                  className="flex justify-between gap-4 my-4 w-full bg-slate-700"
                >
                  <div className="p-4 w-full text-white text-lg flex justify-between">
                    <span className="col-span-4">{item.name}</span>
                    <span className="col-span-2">${item.price.toFixed(2)}</span>
                    <span className="col-span-2">{item.quantity}</span>
                  </div>
                  <Button
                    size="large"
                    sx={{ bgcolor: "#37376b" }}
                    variant="contained"
                    onClick={() => deleteItem(item.id)}
                  >
                    X
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
