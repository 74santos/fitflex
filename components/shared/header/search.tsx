import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";


interface Props {
  categories: { category: string; count: number }[];
}

export default function Search({ categories }: Props) {

 
  return ( <form action="/search" method="GET">
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Select name="category">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder='All'/>  
        </SelectTrigger>
        <SelectContent>
          <SelectItem key='All' value='all'>
            All
            </SelectItem>
          { categories.map((x) => (
            <SelectItem key={x.category} value={x.category}>
              {x.category}
            </SelectItem>
          )) }
        </SelectContent>
      </Select>
      <Input
      name='q'
      type='text'
      placeholder='Search...'
      className="md:w-[100px] lg:w-[300px]"
      />
      <Button> <SearchIcon/></Button>
    </div>
  </form> )

}