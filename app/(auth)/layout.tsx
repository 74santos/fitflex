
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

   <div className=" flex-center screen-size"> 
   {children}
   
   </div>
  );
}
