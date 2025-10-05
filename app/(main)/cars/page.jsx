// import { CarFilters } from "./_components/car-filters";
// import { getCarFilters } from "@/actions/car-listing";
// import { CarListings } from "./_components/car-listing";

// export const metadata = {
//   title: "Cars | GearVana",
//   description: "Browse and search for your dream car",
// };

// export default async function CarsPage() {
//   // Fetch filters data on the server
//   const filtersData = await getCarFilters();

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Filters Section */}
//         <div className="w-full lg:w-80 flex-shrink-0">
//           <CarFilters filters={filtersData.data} />
//         </div>

//         {/* Car Listings */}
//         <div className="flex-1">
//           <CarListings />
//         </div>
//       </div>
//     </div>
//   );
// }
import { CarFilters } from "./_components/car-filters";
import { getCarFilters } from "@/actions/car-listing";
import { CarListings } from "./_components/car-listing";

// Import a simple component for displaying errors
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Cars | GearVana",
  description: "Browse and search for your dream car",
};

export default async function CarsPage() {
  // 1. Fetch filters data on the server with error handling
  let filtersData;
  try {
    filtersData = await getCarFilters();
  } catch (error) {
    // CRITICAL FIX: If the Server Action throws an error (e.g., DB failure), 
    // catch it here and display a fallback UI instead of crashing the page.
    console.error("Failed to fetch initial car filters:", error);
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Server Error</AlertTitle>
          <AlertDescription>
            Could not load car marketplace data. Please check the server logs for database connection issues.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 2. Check the returned success status (from your Server Action structure)
  if (!filtersData || !filtersData.success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            The server returned an empty or failed filter set: {filtersData?.error || "Unknown Error"}.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 3. Successful Render
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-4 gradient-title">Browse Cars</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          {/* Pass the successfully retrieved data */}
          <CarFilters filters={filtersData.data} />
        </div>

        {/* Car Listings (will fetch its own data client-side) */}
        <div className="flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
}

