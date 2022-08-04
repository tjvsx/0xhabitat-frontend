import type { NextComponentType, NextPage } from 'next'

//@ts-ignore
import { Input, Switch, Select, Button } from "agnostic-react";
// import "agnostic-react/dist/common.min.css";
import "agnostic-react/dist/esm/index.css";
import { useState } from 'react';

interface Slider {
  max: number;
  min: number;
  value: number;
  step: number;
  callback: Function;
}

const Slider: NextPage<Slider> = (props) => {

  const { max, min, value, step, callback } = props;

  return (
    <main className='flex flex-row justify-center gap-1'>
      <input type="number" className='w-20 text-center text-clip rounded-full px-1' value={value} onChange={(e) => {callback(Number(e.target.value))}}/>
      <input className='cursor-pointer w-full' type="range" min={min} max={max} step={step} defaultValue={value} onChange={(e) => {callback(Number(e.target.value))}}/>
      <span className='w-36 text-center text-clip rounded-full px-1 overflow-x-scroll'>{max}</span>
    </main>
  )
}

export default Slider

