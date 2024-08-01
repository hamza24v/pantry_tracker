"use client";
import React, { useState, useEffect, MouseEvent } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

type Item = {
  id?: string;
  name: string;
  price: number;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([
    { name: "Coffee", price: 4.95 },
    { name: "Candy", price: 1.25 },
    { name: "Movie", price: 15.0 },
  ]);
  const [total, setTotal] = useState(0);
  const [newItem, setNewItem] = useState<Item>({ name: "", price: 0 });

  // Add item to db
  const addItem = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.price !== 0) {
      try {
        const docRef = await addDoc(collection(db, "items"), {
          name: newItem.name.trim(),
          price: newItem.price,
        });
        console.log("Item written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding item: ", e);
      }
      setItems([...items, newItem]);
      setTotal(total + newItem.price);
      setNewItem({ name: "", price: 0 });
    } else {
      console.log("helo");
    }
  };

  // read item from db
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    let itemsArr: Item[] = [];
    querySnapshot.forEach((doc) => {
      itemsArr.push({ ...doc.data(), id: doc.id } as Item);
    });
    setItems(itemsArr);
    setTotal(itemsArr.reduce((sum, item) => sum + item.price, 0));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // delete item from db
  const deleteItem = async (id: string | undefined) => {
    if (id) {
      try {
        await deleteDoc(doc(db, "items", id));
        setItems(items.filter((item) => item.id != id));
        const deletedItem = items.find((item) => item.id == id);
        if (deletedItem) {
          setTotal(total - deletedItem.price);
        }
      } catch (e) {
        console.error("Error deleting item: ", e);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 ">
      <div className="z-10  max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              className="col-span-3 p-3 border"
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Enter Item"
            />
            <input
              className="col-span-2 p-3 border mx-3"
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: parseInt(e.target.value) })
              }
              placeholder="Enter $"
            />
            <button
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
              onClick={addItem}
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="flex justify-between my-4 w-full bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  className="ml-8 p-4 w-16 border-l-2 border-slate-700 hover:bg-slate-900"
                  onClick={() => deleteItem(item.id)}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length >= 1 ? (
            <div className="text-lg flex p-3 justify-between">
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
