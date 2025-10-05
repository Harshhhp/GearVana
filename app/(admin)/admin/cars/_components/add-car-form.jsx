// "use client";
// import React, { useEffect, useState } from "react";

// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { set, z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { X, Upload, Loader2, Car, Camera } from "lucide-react";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useDropzone } from "react-dropzone";
// import { toast } from "sonner";
// import useFetch from "@/hooks/use-fetch";
// import { add } from "date-fns";
// import { processCarImageWithAI } from "@/actions/cars";

// // Example options
// const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
// const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
// const bodyTypes = [
//   "SUV",
//   "Sedan",
//   "Hatchback",
//   "Coupe",
//   "Convertible",
//   "Wagon",
//   "Pickup",
// ];
// const statusOptions = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

// const carFormSchema = z.object({
//   make: z.string().min(1, "Make is required"),
//   model: z.string().min(1, "Model is required"),
//   year: z
//     .string()
//     .refine((val) => {
//       const year = parseInt(val, 10);
//       return !isNaN(year) && year >= 1886 && year <= new Date().getFullYear();
//     }, "Year must be a valid year"),
//   color: z.string().min(1, "Color is required"),
//   price: z.string().min(1, "Price is required"),
//   mileage: z.string().min(1, "Mileage is required"),
//   bodyType: z.enum(bodyTypes, {
//     required_error: "Invalid body type",
//   }),
//   fuelType: z.enum(fuelTypes, {
//     required_error: "Invalid fuel type",
//   }),
//   transmission: z.enum(transmissions, {
//     required_error: "Invalid transmission type",
//   }),
//   seats: z.string().optional(),
//   description: z
//     .string()
//     .min(10, "Description must be at least 10 characters long"),
//   status: z.enum(statusOptions, {}),
//   featured: z.boolean().default(false),
// });

// const addCar = async ({ carData, images }) => {
//   console.log("Adding car:", carData, images);

//   // simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   return { success: true }; // mock success response
// };

// const AddCarForm = () => {
//   const [activeTab, setActiveTab] = useState("manual"); // Changed default to 'manual'
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [imageError, setImageError] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploadedAiImage, setUploadedAiImage] = useState(null); // Renamed for clarity
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//     getValues,
//   } = useForm({
//     resolver: zodResolver(carFormSchema),
//     defaultValues: {
//       make: "",
//       model: "",
//       year: "",
//       color: "",
//       price: "",
//       mileage: "",
//       bodyType: "SUV",
//       fuelType: "Petrol",
//       transmission: "Automatic",
//       seats: "",
//       description: "",
//       status: "AVAILABLE",
//       featured: false,
//     },
//   });

//   const onAiDrop = (acceptedFiles) => {
//     const file = acceptedFiles[0];

//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size exceeds 5MB limit");
//         return;
//       }

//       setUploadedAiImage(file);

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//         toast.success("Image uploaded successfully");
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
//     useDropzone({
//       onDrop: onAiDrop,
//       accept: {
//         "image/jpeg": [],
//         "image/png": [],
//         "image/jpg": [],
//         "image/webp": [],
//       },
//       maxFiles: 1,
//       multiple: false,
//     });

//   const {
//     loading: processImageLoading,
//     fn: processImageFn,
//     data: processImageResult,
//     error: processImageError,
// } = useFetch(processCarImageWithAI);

// // Function to handle the AI processing logic
// const procesWithAI = async () => {
//     if (!uploadedAiImage) {
//         toast.error("Please upload an image first");
//         return;
//     }

//     // 🏆 FIX: Convert the File object to a FormData object before passing it
//     // FormData is the standard way to submit files to an API from the browser.
//     const formData = new FormData();
//     // 'image' should match the key your server-side action ('processCarImageWithAI') expects
//     formData.append('image', uploadedAiImage); 

//     // Correctly call the fetch function with the FormData object
//     await processImageFn(formData); // pass formData instead of { image: uploadedAiImage }
// };

//   // 🐛 FIX 1: Move processImageError useEffect outside of procesWithAI
//   useEffect(() => {
//     if (processImageError) {
//       toast.error("Error processing image. Please try again.");
//     }
//   }, [processImageError]);

//   // 🐛 FIX 2: Move processImageResult useEffect outside of procesWithAI
//   useEffect(() => {
//     if (processImageResult?.success) {
//       const carDetails = processImageResult.data;

//       // Set form values
//       setValue("make", carDetails.make);
//       setValue("model", carDetails.model);
//       setValue("year", carDetails.year.toString());
//       setValue("color", carDetails.color);
//       // Ensure the bodyType is one of the valid options, otherwise default or handle
//       setValue("bodyType", carDetails.bodyType && bodyTypes.includes(carDetails.bodyType) ? carDetails.bodyType : getValues("bodyType"));
//       setValue("fuelType", carDetails.fuelType && fuelTypes.includes(carDetails.fuelType) ? carDetails.fuelType : getValues("fuelType"));
//       setValue("price", carDetails.price.toString());
//       setValue("mileage", carDetails.mileage.toString());
//       setValue("transmission", carDetails.transmission && transmissions.includes(carDetails.transmission) ? carDetails.transmission : getValues("transmission"));
//       setValue("description", carDetails.description);

//       // Add the image to the general uploadedImages array for submission
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setUploadedImages((prev) => [...prev, e.target.result]);
//       };
//       // Need to read the file to get the data URL for preview/submission
//       if (uploadedAiImage) {
//         reader.readAsDataURL(uploadedAiImage);
//       }

//       toast.success("Car details extracted successfully.", {
//         description: `Detected ${carDetails.year} ${carDetails.make} ${
//           carDetails.model
//         } with ${Math.round(carDetails.confidence * 100)}% confidence`,
//       });

//       // Switch to manual tab after extraction
//       setActiveTab("manual");
//       setImagePreview(null); // Clear AI preview
//       setUploadedAiImage(null); // Clear the file object

//     }
//   }, [processImageResult, uploadedAiImage, setValue, getValues]); // Added dependencies

//   const {
//     data: addCarResult,
//     loading: addCarLoading,
//     fn: addCarFn,
//   } = useFetch(addCar);

//   // Existing useEffect for addCarResult is fine
//   useEffect(() => {
//     if (addCarResult?.success) {
//       toast.success("Car Added Successfully");
//       router.push("/admin/cars");
//     }
//   }, [addCarResult, router]); // `addCarLoading` isn't strictly needed here

//   const onSubmit = async (data) => {
//     if (uploadedImages.length === 0) {
//       setImageError("At least one image is required");
//       return;
//     }
//     setImageError(""); // Clear any previous error

//     const carData = {
//       ...data,
//       year: parseInt(data.year, 10),
//       price: parseFloat(data.price),
//       mileage: parseInt(data.mileage, 10),
//       seats: data.seats ? parseInt(data.seats, 10) : null,
//     };

//     // Use the fetched function
//     await addCarFn({
//       carData: carData,
//       images: uploadedImages,
//     });
    
//     // Remove simulated delay and toast as they are handled by useFetch and useEffect
//     // setIsUploading is only relevant for the multi-image dropzone process now
//   };

//   const onMultiImagesDrop = (acceptedFiles) => {
//     setImageError("");
//     setIsUploading(true);

//     const validFiles = acceptedFiles.filter((file) => {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`${file.name} exceeds the 5MB size limit and was not added.`);
//         return false;
//       }
//       return true;
//     });

//     if (validFiles.length === 0) {
//       setIsUploading(false);
//       return;
//     }

//     const newImages = [];
//     let filesProcessed = 0;

//     validFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         newImages.push(e.target.result);
//         filesProcessed++;

//         if (filesProcessed === validFiles.length) {
//           setUploadedImages((prev) => [...prev, ...newImages]);
//           setIsUploading(false);
//           toast.success("Images uploaded successfully!");
//         }
//       };
//       reader.onerror = () => {
//         setIsUploading(false);
//         toast.error("Error reading file");
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const {
//     getRootProps: getMultiImageRootProps,
//     getInputProps: getMultiImageInputProps,
//   } = useDropzone({
//     onDrop: onMultiImagesDrop,
//     accept: {
//       "image/jpeg": [],
//       "image/png": [],
//       "image/jpg": [],
//       "image/webp": [],
//     },
//     multiple: true,
//   });

//   const removeImage = (indexToRemove) => {
//     setUploadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div>
//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         defaultValue="manual"
//         className="mt-6"
//       >
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="manual">Manual Entry</TabsTrigger>
//           <TabsTrigger value="ai" disabled={processImageLoading || addCarLoading}> {/* Added disabled logic */}
//             AI Upload {processImageLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />}
//           </TabsTrigger>
//         </TabsList>

//         {/* Manual entry */}
//         <TabsContent value="manual" className="mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Car Details</CardTitle>
//               <CardDescription>
//                 Enter the details of the car you want to add.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {/* Make */}
//                   <div className="space-y-2">
//                     <Label htmlFor="make">Make</Label>
//                     <Input
//                       id="make"
//                       {...register("make")}
//                       placeholder="e.g., Toyota"
//                       className={errors.make ? "border-red-500" : ""}
//                     />
//                     {errors.make && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.make.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Model */}
//                   <div className="space-y-2">
//                     <Label htmlFor="model">Model</Label>
//                     <Input
//                       id="model"
//                       {...register("model")}
//                       placeholder="e.g., Corolla"
//                       className={errors.model ? "border-red-500" : ""}
//                     />
//                     {errors.model && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.model.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Year */}
//                   <div className="space-y-2">
//                     <Label htmlFor="year">Year</Label>
//                     <Input
//                       id="year"
//                       type="number"
//                       {...register("year")}
//                       placeholder="e.g., 2021"
//                       className={errors.year ? "border-red-500" : ""}
//                     />
//                     {errors.year && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.year.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Price */}
//                   <div className="space-y-2">
//                     <Label htmlFor="price">Price</Label>
//                     <Input
//                       id="price"
//                       type="number"
//                       {...register("price")}
//                       placeholder="e.g., 20000"
//                       className={errors.price ? "border-red-500" : ""}
//                     />
//                     {errors.price && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.price.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Mileage */}
//                   <div className="space-y-2">
//                     <Label htmlFor="mileage">Mileage</Label>
//                     <Input
//                       id="mileage"
//                       type="number"
//                       {...register("mileage")}
//                       placeholder="e.g., 15000"
//                       className={errors.mileage ? "border-red-500" : ""}
//                     />
//                     {errors.mileage && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.mileage.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Color */}
//                   <div className="space-y-2">
//                     <Label htmlFor="color">Color</Label>
//                     <Input
//                       id="color"
//                       {...register("color")}
//                       placeholder="e.g., Red"
//                       className={errors.color ? "border-red-500" : ""}
//                     />
//                     {errors.color && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.color.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Fuel Type */}
//                   <div className="space-y-2">
//                     <Label htmlFor="fuelType">Fuel Type</Label>
//                     <Select
//                       onValueChange={(value) => setValue("fuelType", value)}
//                       defaultValue={getValues("fuelType")}
//                     >
//                       <SelectTrigger
//                         className={errors.fuelType ? "border-red-500" : ""}
//                       >
//                         <SelectValue placeholder="Select Fuel Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {fuelTypes.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.fuelType && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.fuelType.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Transmission */}
//                   <div className="space-y-2">
//                     <Label htmlFor="transmission">Transmission</Label>
//                     <Select
//                       onValueChange={(value) => setValue("transmission", value)}
//                       defaultValue={getValues("transmission")}
//                     >
//                       <SelectTrigger
//                         className={errors.transmission ? "border-red-500" : ""}
//                       >
//                         <SelectValue placeholder="Select Transmission" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {transmissions.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.transmission && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.transmission.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Body Type */}
//                   <div className="space-y-2">
//                     <Label htmlFor="bodyType">Body Type</Label>
//                     <Select
//                       onValueChange={(value) => setValue("bodyType", value)}
//                       defaultValue={getValues("bodyType")}
//                     >
//                       <SelectTrigger
//                         className={errors.bodyType ? "border-red-500" : ""}
//                       >
//                         <SelectValue placeholder="Select Body Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {bodyTypes.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.bodyType && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.bodyType.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Status */}
//                   <div className="space-y-2">
//                     <Label htmlFor="status">Status</Label>
//                     <Select
//                       onValueChange={(value) => setValue("status", value)}
//                       defaultValue={getValues("status")}
//                     >
//                       <SelectTrigger
//                         className={errors.status ? "border-red-500" : ""}
//                       >
//                         <SelectValue placeholder="Select Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {statusOptions.map((status) => (
//                           <SelectItem key={status} value={status}>
//                             {status}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     {errors.status && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.status.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Seats (Optional) */}
//                 <div className="space-y-2">
//                   <Label htmlFor="seats">Seats (Optional)</Label>
//                   <Input
//                     id="seats"
//                     type="number"
//                     {...register("seats")}
//                     placeholder="e.g., 5"
//                     className={errors.seats ? "border-red-500" : ""}
//                   />
//                   {errors.seats && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.seats.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     {...register("description")}
//                     placeholder="Enter detailed description of the car"
//                     className={`min-h-32 ${
//                       errors.description ? "border-red-500" : ""
//                     }`}
//                   />
//                   {errors.description && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.description.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Featured Checkbox */}
//                 <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
//                   <Checkbox
//                     id="featured"
//                     checked={watch("featured")}
//                     onCheckedChange={(checked) => {
//                       setValue("featured", checked);
//                     }}
//                   />
//                   <div className="space-y-1 leading-none">
//                     <Label htmlFor="featured">Feature This Car</Label>
//                     <p className="text-sm text-gray-500">
//                       Featured Cars appear on the homepage.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                   <Label
//                     htmlFor="images"
//                     className={imageError ? "text-red-500" : ""}
//                   >
//                     Images
//                     {imageError && <span className="text-red-500">*</span>}
//                   </Label>
//                   <div
//                     {...getMultiImageRootProps()}
//                     className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2 ${
//                       imageError ? "border-red-500" : "border-gray-300"
//                     }`}
//                   >
//                     <input {...getMultiImageInputProps()} />
//                     <div className="flex flex-col items-center justify-center">
//                       <Upload className="h-12 w-12 text-gray-400 mb-3" />
//                       <p className="text-sm text-gray-600">
//                         Drag & Drop or click to upload multiple images
//                       </p>
//                       <p className="text-gray-500 text-xs mt-1">
//                         Supports: JPG, PNG, WEBP (max 5MB per file)
//                       </p>
//                     </div>
//                   </div>
//                   {imageError && (
//                     <p className="text-red-500 mt-1">{imageError}</p>
//                   )}
//                 </div>

//                 {/* Uploaded Images Preview */}
//                 {uploadedImages.length > 0 && (
//                   <div className="mt-4">
//                     <h3 className="text-sm font-medium mb-2">
//                       Uploaded Images ({uploadedImages.length})
//                     </h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
//                       {uploadedImages.map((image, index) => (
//                         <div key={index} className="relative group">
//                           <Image
//                             src={image}
//                             alt={`Car Image ${index + 1}`}
//                             height={112} // Adjusted for a h-28 component (112px)
//                             width={112} // Adjusted to maintain aspect ratio
//                             className="h-28 w-full object-cover rounded-md"
//                             priority
//                           />
//                           <Button
//                             type="button"
//                             size="icon"
//                             variant="destructive"
//                             className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//                             onClick={() => removeImage(index)}
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   className="w-full md:w-auto"
//                   disabled={addCarLoading}
//                 >
//                   {addCarLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     "Add Car"
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* AI Upload (currently disabled) */}
//         <TabsContent value="ai">
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Powered Car Detail Extraction</CardTitle>
//               <CardDescription>
//                 Upload The Image Of The Car And Let Our AI Extract The Details
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div className="border-2 border-dashed rounded-lg p-6 text-center">
//                   <div className="">
//                     {imagePreview ? (
//                       <div className="flex flex-col items-center">
//                         <img
//                           src={imagePreview}
//                           alt="Car Preview"
//                           className="max-h-56 max-w-full object-contain mb-4 rounded-md"
//                         />
//                         <div className="flex gap-2">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setImagePreview(null);
//                               setUploadedAiImage(null);
//                             }}
//                           >
//                             Remove
//                           </Button>

//                           <Button
//                             type="button"
//                             size="sm"
//                             onClick={procesWithAI}
//                             disabled={processImageLoading}
//                           >
//                             {processImageLoading ? (
//                               <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 Processing...
//                               </>
//                             ) : (
//                               <>
//                                 <Camera className="mr-2 h-4 w-4" />
//                                 Extract Details
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div
//                         {...getAiRootProps()} // 🐛 FIX 3: Corrected usage to include parenthesis getAiRootProps()
//                         className="cursor-pointer hover:bg-gray-50 transition"
//                       >
//                         <input {...getAiInputProps()} />
//                         <div className="flex flex-col items-center justify-center">
//                           <Camera className="h-12 w-12 text-gray-400 mb-2" />
//                           <p className="text-gray-600 text-sm">
//                             Drag & Drop a car image or click to select
//                           </p>

//                           <p className="text-gray-500 text-xs mt-1">
//                             Supports: JPG, PNG (max 5MB)
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default AddCarForm;

"use client";
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo for efficient base64 conversion

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Upload, Loader2, Camera } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

// Server Actions
import { processCarImageWithAI, addCar } from "@/actions/cars"; 

// Helper function to convert a File/Blob to a Base64 Data URL string
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


// Example options
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Wagon",
  "Pickup",
];
const statusOptions = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .refine((val) => {
      const year = parseInt(val, 10);
      return !isNaN(year) && year >= 1886 && year <= new Date().getFullYear();
    }, "Year must be a valid year (e.g., 2024)"),
  color: z.string().min(1, "Color is required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  bodyType: z.enum(bodyTypes, {
    required_error: "Body type is required",
  }),
  fuelType: z.enum(fuelTypes, {
    required_error: "Fuel type is required",
  }),
  transmission: z.enum(transmissions, {
    required_error: "Transmission type is required",
  }),
  seats: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  status: z.enum(statusOptions, {
    required_error: "Status is required",
  }),
  featured: z.boolean().default(false),
});


const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("manual"); 
  // CRITICAL FIX: Store File objects for the multi-upload flow
  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiFile, setUploadedAiFile] = useState(null); // Renamed for clarity
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      color: "",
      price: "",
      mileage: "",
      bodyType: "SUV",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });
  
  // =================================================================
  // CRITICAL FIX: Generate Base64 URLs for display and for the Server Action submission
  // We use useMemo to avoid re-calculating this on every render.
  // This array will be passed to the server action.
  const uploadedBase64Images = useMemo(() => {
    // Only convert if the files have changed
    return uploadedFiles.map(file => {
      // If it's already a Data URL (from the AI flow), just return it.
      if (typeof file === 'string') return file;
      
      // If it's a File object, we need to convert it.
      // This is necessary for displaying the image preview and for 
      // passing the data to the Server Action.
      // NOTE: This triggers the FileReader promise logic within the map/useEffect.
      return URL.createObjectURL(file);
    });
  }, [uploadedFiles]);

  // =================================================================
  // AI Upload Logic

  const onAiDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      setUploadedAiFile(file);

      // Create a temporary object URL for instant preview
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image uploaded successfully, ready for AI extraction.");
    }
  };

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiDrop,
      accept: {
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      multiple: false,
    });

  const {
    loading: processImageLoading,
    fn: processImageFn,
    data: processImageResult,
    error: processImageError,
  } = useFetch(processCarImageWithAI);

  // Function to handle the AI processing logic
  const procesWithAI = async () => {
    if (!uploadedAiFile) {
      toast.error("Please upload an image first");
      return;
    }

    const formData = new FormData();
    // Use the actual File object here, as the Server Action expects it in FormData
    formData.append("image", uploadedAiFile); 

    await processImageFn(formData);
  };

  // Handles AI processing errors
  useEffect(() => {
    if (processImageError) {
      toast.error(`AI Error: ${processImageError}`);
    }
  }, [processImageError]);

  // Handles successful AI processing result
  useEffect(() => {
    if (processImageResult?.success) {
      const carDetails = processImageResult.data;

      // Set form values
      setValue("make", carDetails.make, { shouldValidate: true });
      setValue("model", carDetails.model, { shouldValidate: true });
      setValue("year", carDetails.year.toString(), { shouldValidate: true });
      setValue("color", carDetails.color, { shouldValidate: true });
      // Apply type checking and fallback for enums
      setValue(
        "bodyType",
        bodyTypes.includes(carDetails.bodyType)
          ? carDetails.bodyType
          : getValues("bodyType"),
          { shouldValidate: true }
      );
      setValue(
        "fuelType",
        fuelTypes.includes(carDetails.fuelType)
          ? carDetails.fuelType
          : getValues("fuelType"),
          { shouldValidate: true }
      );
      setValue("price", carDetails.price.replace(/[^0-9.]/g, ''), { shouldValidate: true }); // Clean price string
      setValue("mileage", carDetails.mileage.replace(/[^0-9.]/g, ''), { shouldValidate: true }); // Clean mileage string
      setValue(
        "transmission",
        transmissions.includes(carDetails.transmission)
          ? carDetails.transmission
          : getValues("transmission"),
          { shouldValidate: true }
      );
      setValue("description", carDetails.description, { shouldValidate: true });

      // Convert the uploaded Ai File to Base64 and add it to the multi-upload state
      fileToDataUrl(uploadedAiFile).then(dataUrl => {
         // CRITICAL: We now store the Base64 string for the AI image in the main file array.
         // This is the only way to ensure it transfers correctly via the Server Action.
         // We filter out any previous temporary object URLs before adding the new base64 string
         setUploadedFiles(prev => [...prev, dataUrl]);
      });


      toast.success("Car details extracted successfully.", {
        description: `Detected ${carDetails.year} ${carDetails.make} ${
          carDetails.model
        } with ${Math.round(carDetails.confidence * 100)}% confidence. Please review details.`,
      });

      // Cleanup and switch tabs
      setActiveTab("manual");
      setImagePreview(null);
      setUploadedAiFile(null);
    } else if (processImageResult?.error) {
       toast.error(`AI Error: ${processImageResult.error}`);
    }
  }, [processImageResult, uploadedAiFile, setValue, getValues]);


  // =================================================================
  // Form Submission Logic

  const {
    data: addCarResult,
    loading: addCarLoading,
    fn: addCarFn,
  } = useFetch(addCar); 

  // Handles the result of the actual database submission
  useEffect(() => {
    if (addCarResult?.success) {
      toast.success("Car Added Successfully");
      router.push("/admin/cars");
    } else if (addCarResult?.error) {
      toast.error(`Submission Error: ${addCarResult.error}`);
    }
  }, [addCarResult, router]); 

  const onSubmit = async (data) => {
    if (uploadedFiles.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    setImageError("");

    // Start conversion of all File objects to Base64 data URLs
    setIsUploading(true);
    const base64Promises = uploadedFiles.map(file => {
      // If it's already a string (from AI flow), it's already Base64, so return it
      if (typeof file === 'string') return Promise.resolve(file);
      // Otherwise, convert the File object to Base64 Data URL
      return fileToDataUrl(file);
    });

    let finalImages;
    try {
        finalImages = await Promise.all(base64Promises);
    } catch (error) {
        setIsUploading(false);
        toast.error("Failed to read image files.");
        console.error("File reading error:", error);
        return;
    }
    
    setIsUploading(false);

    // Prepare data for server action
    const carData = {
      ...data,
      // Ensure all fields are numbers on the server side (Server Action also does this)
      year: parseInt(data.year, 10), 
      price: parseFloat(data.price),
      mileage: parseInt(data.mileage, 10),
      seats: data.seats ? parseInt(data.seats, 10) : null,
    };

    // Use the fetched Server Action function with the Base64 array
    await addCarFn({
      carData: carData,
      images: finalImages, // THIS IS THE CRITICAL CHANGE
    });
  };

  // =================================================================
  // Multi-Image Dropzone Logic

  const onMultiImagesDrop = (acceptedFiles) => {
    setImageError("");
    setIsUploading(true);

    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB size limit and was not added.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    // CRITICAL: Store the actual File objects in a new state variable.
    setUploadedFiles((prev) => [...prev.filter(item => typeof item === 'string'), ...validFiles]);

    setIsUploading(false);
    toast.success(`${validFiles.length} image(s) ready for upload!`);
  };


  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const removeImage = (indexToRemove) => {
    // Revoke the object URL to prevent memory leaks if it was an object URL
    const fileToRemove = uploadedFiles[indexToRemove];
    if (fileToRemove instanceof File) {
        URL.revokeObjectURL(uploadedBase64Images[indexToRemove]);
    }
    
    setUploadedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  
  // =================================================================
  // Render

  return (
    <div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="manual"
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" disabled={processImageLoading || addCarLoading}>Manual Entry</TabsTrigger>
          <TabsTrigger
            value="ai"
            disabled={processImageLoading || addCarLoading}
          >
            AI Upload
            {processImageLoading && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* Manual entry */}
        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>
                Enter the details of the car you want to add.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Make */}
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      {...register("make")}
                      placeholder="e.g., Toyota"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      {...register("model")}
                      placeholder="e.g., Corolla"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.model.message}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      {...register("year")}
                      placeholder="e.g., 2021"
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.year.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register("price")}
                      placeholder="e.g., 20000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Mileage */}
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      {...register("mileage")}
                      placeholder="e.g., 15000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mileage.message}
                      </p>
                    )}
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      {...register("color")}
                      placeholder="e.g., Red"
                      className={errors.color ? "border-red-500" : ""}
                    />
                    {errors.color && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.color.message}
                      </p>
                    )}
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      onValueChange={(value) => setValue("fuelType", value, { shouldValidate: true })}
                      defaultValue={getValues("fuelType")}
                      value={watch("fuelType")} // Watch ensures proper update after AI fills it
                    >
                      <SelectTrigger
                        className={errors.fuelType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select Fuel Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fuelType.message}
                      </p>
                    )}
                  </div>

                  {/* Transmission */}
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      onValueChange={(value) => setValue("transmission", value, { shouldValidate: true })}
                      defaultValue={getValues("transmission")}
                      value={watch("transmission")} // Watch ensures proper update after AI fills it
                    >
                      <SelectTrigger
                        className={errors.transmission ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select Transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transmission && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.transmission.message}
                      </p>
                    )}
                  </div>

                  {/* Body Type */}
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Select
                      onValueChange={(value) => setValue("bodyType", value, { shouldValidate: true })}
                      defaultValue={getValues("bodyType")}
                      value={watch("bodyType")} // Watch ensures proper update after AI fills it
                    >
                      <SelectTrigger
                        className={errors.bodyType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select Body Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bodyType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bodyType.message}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
                      defaultValue={getValues("status")}
                    >
                      <SelectTrigger
                        className={errors.status ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Seats (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats (Optional)</Label>
                  <Input
                    id="seats"
                    type="number"
                    {...register("seats")}
                    placeholder="e.g., 5"
                    className={errors.seats ? "border-red-500" : ""}
                  />
                  {errors.seats && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.seats.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter detailed description of the car"
                    className={`min-h-32 ${
                      errors.description ? "border-red-500" : ""
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => {
                      setValue("featured", checked);
                    }}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured">Feature This Car</Label>
                    <p className="text-sm text-gray-500">
                      Featured Cars appear on the homepage.
                    </p>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label
                    htmlFor="images"
                    className={imageError ? "text-red-500" : ""}
                  >
                    Images
                    {imageError && <span className="text-red-500">*</span>}
                  </Label>
                  <div
                    {...getMultiImageRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2 ${
                      imageError ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <input {...getMultiImageInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600">
                        Drag & Drop or click to upload multiple images
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Supports: JPG, PNG, WEBP (max 5MB per file)
                      </p>
                    </div>
                  </div>
                  {imageError && (
                    <p className="text-red-500 mt-1">{imageError}</p>
                  )}
                </div>

                {/* Uploaded Images Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">
                      Uploaded Images ({uploadedFiles.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {uploadedBase64Images.map((dataUrl, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={dataUrl} // This is the temporary object URL or Base64 string
                            alt={`Car Image ${index + 1}`}
                            height={112} 
                            width={112} 
                            className="h-28 w-full object-cover rounded-md"
                            unoptimized // Use unoptimized for local object URLs
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={addCarLoading || isUploading}
                >
                  {addCarLoading || isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {addCarLoading ? "Submitting..." : "Preparing Images..."}
                    </>
                  ) : (
                    "Add Car"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Upload  */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Powered Car Detail Extraction</CardTitle>
              <CardDescription>
                Upload The Image Of The Car And Let Our AI Extract The Details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <div>
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={imagePreview}
                          alt="Car Preview"
                          className="max-h-56 max-w-full object-contain mb-4 rounded-md"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setImagePreview(null);
                              setUploadedAiFile(null);
                            }}
                            disabled={processImageLoading}
                          >
                            Remove
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            onClick={procesWithAI}
                            disabled={processImageLoading}
                          >
                            {processImageLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Camera className="mr-2 h-4 w-4" />
                                Extract Details
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        {...getAiRootProps()} 
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <input {...getAiInputProps()} />
                        <div className="flex flex-col items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-600 text-sm">
                            Drag & Drop a car image or click to select
                          </p>

                          <p className="text-gray-500 text-xs mt-1">
                            Supports: JPG, PNG (max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddCarForm;