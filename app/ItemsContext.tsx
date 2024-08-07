"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ItemsContextType = {
  items: Item[];
  total: number;
  addItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => void
};

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0.0);

  // read item from db
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    let itemsArr: Item[] = [];
    querySnapshot.forEach((doc) => {
      itemsArr.push({ ...doc.data(), id: doc.id } as Item);
    });
    setItems(itemsArr);
    setTotal(
      itemsArr.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add item to db
  const addItem = async (newItem: Item) => {
    if (newItem.name !== "" && newItem.price !== 0) {
      try {
        const docRef = await addDoc(collection(db, "items"), {
          name: newItem.name.trim(),
          price: newItem.price,
          quantity: newItem.quantity,
        });
        console.log("Item written with ID: ", docRef.id);
        setItems([...items, newItem]);
        setTotal(total + newItem.price * newItem.quantity);
      } catch (e) {
        console.error("Error adding item: ", e);
      }
     
    }
  };

   // delete item from db
   const deleteItem = async (id: string ) => {
    if (id) {
      try {
        await deleteDoc(doc(db, "items", id));
        setItems(items.filter((item) => item.id != id));
        const deletedItem = items.find((item) => item.id == id);
        if (deletedItem) {
          setTotal(total - deletedItem.price * deletedItem.quantity);
        }
      } catch (e) {
        console.error("Error deleting item: ", e);
      }
    }
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setItems(newItems);
    updateTotal(newItems);
  };

  const updateTotal = (items: Item[]) => {
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, total, deleteItem, fetchItems, updateItemQuantity }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
