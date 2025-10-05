// "use client"
// import { deleteCar, getCars, updateCarStatus } from '@/actions/cars'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent ,Table} from '@/components/ui/card'
// import { DialogFooter } from '@/components/ui/dialog'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { Input } from '@/components/ui/input'
// import { TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import useFetch from '@/hooks/use-fetch'
// import { formatCurrency } from '@/lib/helper'
// import { Dialog } from '@radix-ui/react-dialog'
// import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
// import { se } from 'date-fns/locale'
// import { CarIcon, Eye, Loader2, MoveHorizontal, Plus, Search, Star, StarOff, Table, Trash2 } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import { toast } from 'sonner'
// import { set } from 'zod'

// const CarsList = () => {
//   const [search, setSearch] = useState("")
//   const [carToDelete, setCarToDelete] = useState(null)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

//   const router = useRouter()

//   const{
//     loading:loadingCars,
//     fn:fetchCars,
//     data:carsData,
//     error:carsError,
//   }=useFetch(getCars);

//   useEffect(()=>{
//     fetchCars(search);
//   },[search])

//   const{
//     loading:deletingCar,
//     fn:deleteCarFn,
//     data:deleteResult,
//     error:deleteError,
//   }=useFetch(deleteCar);

//   const{
//     loading:updatingCar,
//     fn:updateCarStatusFn,
//     data:updateResult,
//     error:updateError,
//   }=useFetch(updateCarStatus)

//   useEffect(()=>{

//     if(deleteResult?.success){
//       toast.success("Car deleted successfully")
//       fetchCars(search)
//     }


//     if(updateResult?.success){
//       toast.success("Car status updated successfully")
//       fetchCars(search)
//   } 
// }, [updateResult,deleteResult])


// useEffect (() => {
// if (carsError) {
// toast.error("Failed to load cars");
// }
// if (deleteError) {
// toast.error("Failed to delete car");
// }
// if (updateError) {
// toast.error("Failed to update car");
// }
// }, [carsError, deleteError, updateError]);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     fetchCars(search) // later you can trigger API/filter logic
//   }

//   const handleDeleteCar = async ()=>{
//     if(!carToDelete) return;

//     await deleteCarFn(carToDelete.id);
//     setDeleteDialogOpen(false);
//     setCarToDelete(null);
//     await updateCarStatusFn(car.id,{featured:!car.featured})
//   }

//   const handleToggleFeatured =async (car) => {
//     await updateCarStatusFn(car.id, { featured: !car.featured });
//   }

//   const handleStatusUpdate=async(car,newstatus)=>{
//     await updateCarStatusFn(car.id,{featured:!car.featured})
//   }
//   const getStatusBadge = (status) => {
//       switch (status) {
//       case "AVAILABLE":
//       return (
//       <Badge className=" bg-green-100 text-green-800 hover:bg-green-100">
//       Available
//       </Badge>
//       );
//       case "UNAVAILABLE":
//       return (
//       <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
//       Unavailable
//       </Badge>
//       );

//       case "SOLD":
//         return(
//           <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"
//           Sold>
//           </Badge>
//         )
//       default:
//         return <Badge variant="outline">{status}</Badge>

//   return (
//     <div className='space-y-6'>
//       <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        
//         {/* Add Car Button */}
//         <Button onClick={() => router.push('/admin/cars/create')} className='flex items-center'>
//           <Plus className='h-4 w-4 mr-2' /> Add Car
//         </Button>

//         {/* Search Form */}
//         <form onSubmit={handleSearchSubmit} className='flex w-full sm:w-auto'>
//           <div className='relative flex-1'>
//             <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
//             <Input
//               className='pl-9 w-full sm:w-60'
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               type="search"
//               placeholder='Search Cars...'
//             />
//           </div>
//         </form>

//       </div>

//       <Card>
//         <CardContent className="p-0">
//        {loadingCars && !carsData ? (
//         <div className='flex justify-center items-center py-12'>
//         <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
//        </div>
//        ):(
//         carsData?.success && carsData.data.length >0 ? (
//           <div className='overflow-x-auto'>
//             <Table>
//                 <TableHeader>
//                 <TableRow>

//                 <TableHead className="w-12"></TableHead>
//                   <TableHead>Make & Model</TableHead>
//                   <TableHead>Year</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Featured </TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
               
//                 </TableRow>
//                 </TableHeader>
//                 <TableBody>

//                   {carsData.data.map((car)=>{
//                     return(
//                   <TableRow key={car.id}>
//                 <TableCell className="w-10 h-10 rounded-md overflow-hidden">
//                   {car.images && car.images.length > 0 ? (
//                     <Image
//                     src={car.images[0]}
//                     alt={`${car.make} ${car.model}`}
//                     height={40}
//                     width={40}
//                     className='w-full h-full object-cover'
//                     priority
//                     />
//                   ):(
//                     <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
//                     <CarIcon className='h-6 w-6 text-gray-400' />
//                     </div>
//                   )}




//                 </TableCell>

//                 <TableCell className="font-medium">
//                   {car.make} {car.model}
//                 </TableCell>
//                 <TableCell>{car.year}</TableCell>
//                 <TableCell>{formatCurrency(car.price)}</TableCell>
//                 <TableCell>{car.status}</TableCell>
//                 <TableCell>{getStatusBadge(car.status)}</TableCell>

//                 <TableCell>
//                   <Button variant="ghost"
//                     size="sm"
//                     classname="p-0 h-9 w-9"
//                     onClick={()=>handleToggleFeatured(car)}
//                     disabled={updatingCar}
//                     >
//                     {car.featured ?(
//                       <Star className='h-5 w-5 text-amber-500 fill-amber-500'
//                     ):(
//                       <StarOff className='h-5 w-5 text-gray-400'}
//                   </Button>
//                 </TableCell>

//                <TableCell className="text-right">
//                 <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" 
//                 size="sm"
//                 className="p-0 h-8 w-8">

//                   <MoreHorizontal className='h-4 w-4' />
                
//                 </Button>
                
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem onClick={()=>router.push(`/cars/${car.id}`)}>
//                   <Eye className='mr-2 h-4 w-4 '/> View
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />

//                 <DropdownMenuLabel>Status</DropdownMenuLabel>
//                 <DropdownMenuItem
//                   onClick={()=>handleStatusUpdate(car,"AVAILABLE")}
//                   disabled={car.status==="AVAILABLE"||updatingCar}
//                 >Set Available</DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={()=>handleStatusUpdate(car,"UNAVAILABLE")}
//                   disabled={car.status==="UNAVAILABLE"||updatingCar}
//                 >Set Unavailable</DropdownMenuItem>
//                 <DropdownMenuItem
//                  onClick={()=>handleStatusUpdate(car,"SOLD")}
//                  disabled={car.status==="SOLD"||updatingCar}
//                 >Mark As Sold</DropdownMenuItem>
//                 <DropdownMenuSeparator />
              
//               <DropdownMenuItem className="text-red-600"
//                 onClick={()=>{
//                   setCarToDelete(car)
//                   setDeleteDialogOpen(true)
//                 }}
//               >
//                 <Trash2 className='mr-2 h-4 w-4'/>
//                 Delete
//               </DropdownMenuItem>



//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>Subscription</DropdownMenuItem>
//                 </DropdownMenuContent>
//                 </DropdownMenu>
//                </TableCell>
//                 </TableRow>)
//                   }
                
//                 </TableBody>
//             </Table>


//           </div>

//         ):(
//           <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
//           <CarIcon className='h-12 w-12 text-gray-300 mb-4 ' />
//           <h3 className='text-lg font-medium text-gray-900 mb-1'>
//             No cars Found
//           </h3>
//           <p className='text-gray-500 mb-4 '>
//             {
//               search?
//               "No cars match your search criteria"
//               : "Your inventory is empty .Add cars to get started "
//             }
//           </p>
//           <Button onClick={()=>router.push("/admin/cars/create")}>
//             Add your First Car
//           </Button>


//           </div>
        
//         )
//        )
//       }
//         </CardContent>
//       </Card>

//         <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//         <DialogHeader>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogDescription>
//         Are you sure you want to delete {carToDelete?.make}{" "} {carToDelete?.model} ({carToDelete?.year})? This action cannot be undone.
//         </DialogDescription>
//         </DialogHeader>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={()=>setDeleteDialogOpen(false)}
//             disabled={deletingCar}
// >
//   Cancel
//           </Button>


//           <Button
//             variant="destructive"
//             onClick={handleDeleteCar}
//             disabled={deletingCar}>

//           {deletingCar ?(
//             <>
//             <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//             Deleting...
//             </>

//           ):(
//           "Delete Car"  
//           )}
//           </Button>
//         </DialogFooter>
//         </DialogContent>
//         </Dialog>

//     </div>
//   )
// }

// export default CarsList

"use client"
import { deleteCar, getCars, updateCarStatus } from '@/actions/cars'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useFetch from '@/hooks/use-fetch'
import { formatCurrency } from '@/lib/helper'
import {
  CarIcon,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'

const CarsList = () => {
  const [search, setSearch] = useState("")
  const [carToDelete, setCarToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const router = useRouter()

  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars)

  useEffect(() => {
    fetchCars(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const {
    loading: deletingCar,
    fn: deleteCarFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCar)

  const {
    loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus)

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Car deleted successfully")
      fetchCars(search)
    }
    if (updateResult?.success) {
      toast.success("Car status updated successfully")
      fetchCars(search)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateResult, deleteResult])

  useEffect(() => {
    if (carsError) toast.error("Failed to load cars")
    if (deleteError) toast.error("Failed to delete car")
    if (updateError) toast.error("Failed to update car")
  }, [carsError, deleteError, updateError])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchCars(search)
  }

  const handleDeleteCar = async () => {
    if (!carToDelete) return
    await deleteCarFn(carToDelete.id)
    setDeleteDialogOpen(false)
    setCarToDelete(null)
  }

  const handleToggleFeatured = async (car) => {
    await updateCarStatusFn(car.id, { featured: !car.featured })
  }

  const handleStatusUpdate = async (car, newstatus) => {
    await updateCarStatusFn(car.id, { status: newstatus })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        )
      case "UNAVAILABLE":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Unavailable
          </Badge>
        )
      case "SOLD":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Sold
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button onClick={() => router.push('/admin/cars/create')} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Car
        </Button>

        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-9 w-full sm:w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search Cars..."
            />
          </div>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          {loadingCars && !carsData ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : carsData?.success && carsData.data?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carsData.data.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="w-10 h-10 rounded-md overflow-hidden">
                        {car.images?.length > 0 ? (
                          <Image
                            src={car.images[0]}
                            alt={`${car.make} ${car.model}`}
                            height={40}
                            width={40}
                            className="w-full h-full object-cover"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <CarIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {car.make} {car.model}
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{formatCurrency(car.price)}</TableCell>
                      <TableCell>{getStatusBadge(car.status)}</TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9"
                          onClick={() => handleToggleFeatured(car)}
                          disabled={updatingCar}
                        >
                          {car.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/cars/${car.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(car, "AVAILABLE")}
                              disabled={car.status === "AVAILABLE" || updatingCar}
                            >
                              Set Available
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(car, "UNAVAILABLE")}
                              disabled={car.status === "UNAVAILABLE" || updatingCar}
                            >
                              Set Unavailable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(car, "SOLD")}
                              disabled={car.status === "SOLD" || updatingCar}
                            >
                              Mark As Sold
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCarToDelete(car)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CarIcon className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No cars Found</h3>
              <p className="text-gray-500 mb-4">
                {search
                  ? "No cars match your search criteria"
                  : "Your inventory is empty. Add cars to get started."}
              </p>
              <Button onClick={() => router.push("/admin/cars/create")}>Add your First Car</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {carToDelete?.make} {carToDelete?.model} (
              {carToDelete?.year})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deletingCar}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCar} disabled={deletingCar}>
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Car"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CarsList
