import { cn } from "@/lib/utils";
export default function ProductPrice({value, className}: {value: number, className?: string}) {

// Ensure two decimal places  
const stringValue = value.toFixed(2);
// Get the int/float
const [intValue, floatValue] = stringValue.split('.');

  return (
      <p className={cn('text-2xl', className)}>
        <span className="text-xs align-super">$</span>
       <span className="font-bold">{intValue}</span> 
        <span className="text-xs align-super">.{floatValue}</span>
      </p>
  )
}