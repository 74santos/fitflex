import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export function round2(value: number | string){
  if (typeof value === 'number') {
   return Math.round(value + Number.EPSILON) * 100 / 100;
  } else if (typeof value === 'string') {
   return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
   throw new Error('Value is not a number or string');
  }
}


const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

// Format currency using the formatter above
export function formatCurrency(amount:number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}


//Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}


export function formatId(id: string) {
  return `..${id.substring(id.length -6)}`
}

//Format date and time
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
   month: "short",
   day: "numeric",
   year: "numeric",
   hour: "numeric",
   minute: "numeric",
   hour12: true, 
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
   weekday: "short",
   month: "short",
   day: "numeric",
   year: "numeric",
  }
   
  const timeOptions: Intl.DateTimeFormatOptions = {
   hour: "numeric",
   minute: "numeric",
   hour12: true, 
  }
  
  const formattedDateTime : string = new Date(dateString).toLocaleString("en-US", dateTimeOptions);
  const formattedDate: string = new Date(dateString).toLocaleDateString("en-US", dateOptions);
  const formattedTime: string = new Date(dateString).toLocaleTimeString("en-US", timeOptions);


  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

// Form the pagination links

export function formUrlQuery({
  params,
  key,
  value
}: {
  params: string;
  key: string;
  value: string | null ;
}) {
  const query = qs.parse(params);
  query[key] = value;
  const url = window.location.pathname;

  return `${url}?${qs.stringify(query, {
    skipNull: true,
  })}`;
}