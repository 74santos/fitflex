import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert Prisma object into a plain JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with 2 decimal places (even if .0)
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Round number to 2 decimal places
export function round2(value:number | string) {
    if (typeof value === 'number') {
      return Math.round((value + Number.EPSILON) * 100) / 100
    } else if (typeof value === 'string') {
      return Math.round((Number(value) + Number.EPSILON) * 100) / 100
    } else {
      throw new Error('Value must be a number or string')
    }
}

