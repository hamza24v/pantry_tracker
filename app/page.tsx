"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore"; 

type Item = {
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
  const [formInput, setFormInput] = useState<Item>({ name: "", price: 0 });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setItems({ ...items, formInput });
    setFormInput({ name: "", price: 0 });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 ">
      <div className="z-10  max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-6 items-center text-black"
          >
            <input
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
            />
            <input
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter $"
            />
            <button
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
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
                <button className="ml-8 p-4 w-16 border-l-2 hover:bg-slate-900">
                  X
                </button>
              </li>
            ))}
          </ul>
          <div className="text-lg flex p-3 justify-between">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
