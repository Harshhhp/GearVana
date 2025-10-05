// "use server";

// import { serializedCarData } from "@/lib/helper";
// import { db } from "@/lib/prisma";
// import { createClient } from "@/lib/supabase";
// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";
// import { v4 as uuidv4 } from "uuid";

// // Convert File/Blob to base64
// async function fileToBase64(file) {
//   const bytes = await file.arrayBuffer();
//   return Buffer.from(bytes).toString("base64");
// }

// /**
//  * Helper function to safely clean and validate numerical inputs.
//  */
// const cleanAndValidateNumber = (value, fieldName) => {
//     // If null/undefined, treat as 0 for initial conversion, but validation will catch if required
//     const str = String(value || '0');
//     // Remove all characters except digits and the decimal point
//     const cleanedStr = str.replace(/[^0-9.]/g, '');
//     const num = Number(cleanedStr);
    
//     // Check if the resulting number is invalid
//     if (isNaN(num)) {
//         throw new Error(`Invalid data received for ${fieldName}. Value: ${str}`);
//     }
//     return num;
// };


// // ----------------------------------------------------------------------
// // GEMINI AI PROCESSING
// // ----------------------------------------------------------------------

// /**
//  * Processes a car image using the Gemini API to extract car details.
//  * @param {FormData} formData - FormData containing the 'image' file.
//  * @returns {Promise<{success: true, data: object} | {success: false, error: string}>}
//  */
// export async function processCarImageWithAI(formData) {
//   try {
//     const file = formData.get("image");

//     if (!(file instanceof File)) {
//       return { success: false, error: "Invalid file upload. Expected a File object." };
//     }
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error("Gemini API key is not set in environment variables.");
//     }

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const base64Image = await fileToBase64(file);

//     const imagePart = {
//       inlineData: {
//         data: base64Image,
//         mimeType: file.type,
//       },
//     };

//     const prompt = `
//       Analyze the car image and extract the following information.
//       If a value is not directly visible (like mileage, price, fuel type, transmission), provide your best informed guess based on the car's type, age, and visual condition.
      
//       1. Make (manufacturer)
//       2. Model
//       3. Year (approximately)
//       4. Color
//       5. Body type (e.g., sedan, SUV, truck, hatchback)
//       6. Mileage (Use a reasonable estimate, e.g., "50000 miles" or "80000 km")
//       7. Fuel type (your best guess, e.g., "Gasoline", "Diesel", "Electric")
//       8. Transmission type (your best guess, e.g., "Automatic", "Manual")
//       9. Price (your best guess, e.g., "$15,000" or "€20,000")
//       10. Short Description for car listing (2-3 sentences max)
      
//       Provide a confidence score (0.0 to 1.0) for the overall extraction.

//       Format your response *ONLY* as a JSON object:
//       {
//         "make": "",
//         "model": "",
//         "year": "0000",
//         "color": "",
//         "price": "",
//         "mileage": "",
//         "bodyType": "",
//         "fuelType": "",
//         "transmission": "",
//         "description": "",
//         "confidence": 0.0
//       }
//     `;

//     const result = await model.generateContent([imagePart, prompt]);
    
//     // ⭐️ CRITICAL FIX: Explicitly check for non-string responses
//     const text = result.response.text;
    
//     if (typeof text !== 'string') {
//         // This handles the 'text.replace is not a function' error.
//         console.error("Gemini API returned non-string response:", result.response);
//         return { success: false, error: "AI failed to generate a valid text response. Try a different image." };
//     }

//     const cleanedText = text
//       .replace(/```json|```/g, "")
//       .replace(/^\s*[\r\n]/gm, "")
//       .trim();

//     if (!cleanedText) {
//       console.error("Gemini Failure: Received empty response text after cleaning.");
//       return { success: false, error: "AI returned empty data after processing." };
//     }

//     try {
//       const carDetails = JSON.parse(cleanedText);

//       const requiredFields = [
//         "make", "model", "year", "color", "price", "mileage",
//         "bodyType", "fuelType", "transmission", "description", "confidence",
//       ];

//       const missingFields = requiredFields.filter(
//         (field) => !(field in carDetails)
//       );

//       if (missingFields.length > 0) {
//         console.warn("AI response missing fields:", missingFields.join(", "), "Response:", carDetails);
//         return {
//           success: false,
//           error: `AI response missing required fields: ${missingFields.join(", ")}`,
//         };
//       }

//       return {
//         success: true,
//         data: carDetails,
//       };
//     } catch (error) {
//       console.error("Gemini Failure: Failed to Parse AI Response:", error.message);
//       console.error("Raw AI Text:", cleanedText);
//       return {
//         success: false,
//         error: "AI returned data, but it was not valid JSON.",
//       };
//     }
//   } catch (error) {
//     console.error("Gemini API Connection/Request Error:", error);
//     // Ensure the client receives the specific error message
//     return { success: false, error: `AI processing error: ${error.message}` };
//   }
// }

// // ----------------------------------------------------------------------
// // CAR CREATION & DATABASE INTERACTION
// // ----------------------------------------------------------------------

// /**
//  * Adds a new car listing and uploads its images to Supabase storage.
//  * @param {object} params
//  * @param {object} params.carData - The car details.
//  * @param {string[]} params.images - Array of base64-encoded image strings.
//  * @returns {Promise<{success: true, data: object} | {success: false, error: string}>}
//  */
// export async function addCar({ carData, images }) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       throw new Error("User not authenticated.");
//     }

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user) {
//       throw new Error("User not found in database (Prisma).");
//     }

//     // 🚀 FIX: Use the safe validation helper
//     const price = cleanAndValidateNumber(carData.price, 'price');
//     const mileage = cleanAndValidateNumber(carData.mileage, 'mileage');
    
//     const seats = carData.seats !== null && carData.seats !== undefined
//         ? cleanAndValidateNumber(carData.seats, 'seats')
//         : null;

//     const carId = uuidv4();
//     const folderPath = `cars/${carId}`;
//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);

//     const imageUrls = [];

//     for (let i = 0; i < images.length; i++) {
//       const base64Data = images[i];

//       // CRITICAL CHECK: Ensure data is a valid Base64 string from the client
//       if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith("data:image/")) {
//         console.warn(`Skipping invalid or malformed image data at index ${i}`);
//         continue;
//       }

//       const parts = base64Data.split(",");
//       if (parts.length < 2) {
//           console.warn(`Skipping image due to missing base64 part at index ${i}`);
//           continue;
//       }
      
//       const base64 = parts[1];
//       const imageBuffer = Buffer.from(base64, "base64");

//       const mimeMatch = base64Data.match(/data:(.*?);base64,/);
//       const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
//       const fileExtension = mimeType.split("/")[1] || "jpg";

//       const fileName = `car_image_${i + 1}_${Date.now()}.${fileExtension}`;
//       const filePath = `${folderPath}/${fileName}`;

//       const { error } = await supabase.storage
//         .from("car-images")
//         .upload(filePath, imageBuffer, {
//           contentType: mimeType,
//           upsert: false,
//         });

//       if (error) {
//         console.error("FATAL IMAGE UPLOAD ERROR:", error);
//         throw new Error(`Supabase upload failed: ${error.message}`);
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from("car-images")
//         .getPublicUrl(filePath);

//       if (!publicUrlData || !publicUrlData.publicUrl) {
//         throw new Error("Failed to get public URL for image.");
//       }
//       imageUrls.push(publicUrlData.publicUrl);
//     }

//     if (imageUrls.length === 0) {
//       throw new Error("No valid images provided for upload.");
//     }

//     const carCreationData = {
//       id: carId,
//       make: carData.make,
//       model: carData.model,
//       year: carData.year,
//       color: carData.color,
//       price: price, // Cleaned and validated
//       mileage: mileage, // Cleaned and validated
//       bodyType: carData.bodyType,
//       fuelType: carData.fuelType,
//       transmission: carData.transmission,
//       description: carData.description,
//       images: imageUrls,
//       userId: user.id,
//       status: carData.status,
//       featured: carData.featured,
//       seats: seats, // Cleaned and validated
//     };

//     const car = await db.car.create({ data: carCreationData });

//     revalidatePath("/admin/cars");

//     return { success: true, data: car };
//   } catch (error) {
//     // This top-level catch handles all throws and returns the structured response.
//     console.error("FATAL ADD CAR ERROR:", error.message);
//     return { success: false, error: `Failed to add car: ${error.message}` };
//   }
// }

// // ----------------------------------------------------------------------
// // CAR RETRIEVAL AND DELETION
// // ----------------------------------------------------------------------

// /**
//  * Fetches car listings for the authenticated user/admin, with optional search.
//  * @param {string} search - Search term for make, model, or color.
//  * @returns {Promise<{success: true, data: object[]} | {success: false, error: string}>}
//  */
// export async function getCars(search = "") {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("User not authenticated"); 

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });
//     if (!user) throw new Error("User Not Found in Database"); 

//     let where = {};
//     if (search) {
//       where.OR = [
//         { make: { contains: search, mode: "insensitive" } },
//         { model: { contains: search, mode: "insensitive" } },
//         { color: { contains: search, mode: "insensitive" } },
//       ];
//     }
    
//     const cars = await db.car.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//     });

//     const serializedCars = cars.map(serializedCarData);
//     return { success: true, data: serializedCars };
//   } catch (error) {
//     console.error("Error Fetching Car:", error);
//     return { success: false, error: error.message };
//   }
// }

// /**
//  * Deletes a car and its associated images from Supabase storage.
//  * @param {string} carId - The ID of the car to delete.
//  * @returns {Promise<{success: true} | {success: false, error: string}>}
//  */
// export async function deleteCar(carId) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("User not authenticated");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId }
//     });
//     if (!user) throw new Error("User Not Found in Database");

//     const car = await db.car.findUnique({
//       where: { id: carId },
//       select: { images: true }
//     });

//     if (!car) {
//       return { success: false, error: "Car Not Found" };
//     }

//     await db.car.delete({ where: { id: carId } });

//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);

//     const filePaths = car.images
//       .map((imageUrl) => {
//         const parsedUrl = new URL(imageUrl);
//         const pathMatch = parsedUrl.pathname.match(/\/car-images\/(.+)$/);
//         return pathMatch ? pathMatch[1] : null;
//       })
//       .filter(Boolean);

//     if (filePaths.length > 0) {
//       const { error } = await supabase.storage
//         .from("car-images")
//         .remove(filePaths);

//       if (error) {
//         console.error("Error Deleting images from Supabase:", error);
//       }
//     }

//     revalidatePath("/admin/cars");

//     return { success: true };
//   } catch (error) {
//     console.error("Error deleting car:", error);
//     return { success: false, error: error.message };
//   }
// }

// /**
//  * Updates the status or featured flag of a car.
//  * @param {string} id - The ID of the car to update.
//  * @param {object} data - Object containing optional 'status' (string) and 'featured' (boolean).
//  * @returns {Promise<{success: true} | {success: false, error: string}>}
//  */
// export async function updateCarStatus(id, { status, featured }) { 
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("User not authenticated");

//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId }
//     });
//     if (!user) throw new Error("User Not Found in Database");

//     const updateData = {};
//     if (status !== undefined) updateData.status = status;
//     if (featured !== undefined) updateData.featured = featured;
    
//     if (Object.keys(updateData).length === 0) {
//         return { success: false, error: "No update data provided for status or featured." };
//     }

//     await db.car.update({
//       where: { id },
//       data: updateData,
//     });

//     revalidatePath("/admin/cars");

//     return { success: true };
//   } catch (error) {
//     console.error("Error updating car status:", error);
//     return { success: false, error: error.message };
//   }
// }


"use server";

import { serializedCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Convert File/Blob to base64
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes).toString("base64");
}

/**
 * Helper function to safely clean and validate numerical inputs.
 */
const cleanAndValidateNumber = (value, fieldName) => {
  // If null/undefined, treat as 0 for initial conversion, but validation will catch if required
  const str = String(value || '0');
  // Remove all characters except digits and the decimal point
  const cleanedStr = str.replace(/[^0-9.]/g, '');
  const num = Number(cleanedStr);
  
  // Check if the resulting number is invalid
  if (isNaN(num)) {
    throw new Error(`Invalid data received for ${fieldName}. Value: ${str}`);
  }
  return num;
};


// ----------------------------------------------------------------------
// GEMINI AI PROCESSING
// ----------------------------------------------------------------------

// JSON SCHEMA DEFINITION using standard JSON Schema plain object syntax
const carDetailsSchema = {
    type: "object",
    properties: {
        make: { type: "string", description: "The manufacturer (e.g., Ford, Toyota)." },
        model: { type: "string", description: "The specific model name (e.g., Focus, Camry)." },
        year: { type: "string", description: "The approximate year as a four-digit string (e.g., '2018')." },
        color: { type: "string", description: "The dominant exterior color." },
        price: { type: "string", description: "Estimated price with currency symbol (e.g., '$15,000')." },
        mileage: { type: "string", description: "Estimated mileage with units (e.g., '50,000 miles')." },
        bodyType: { type: "string", description: "The body style (e.g., sedan, SUV, hatchback, truck)." },
        fuelType: { type: "string", description: "The guessed fuel type (e.g., Gasoline, Diesel, Electric)." },
        transmission: { type: "string", description: "The guessed transmission type (e.g., Automatic, Manual)." },
        description: { type: "string", description: "A concise, 2-3 sentence description suitable for a car listing." },
        confidence: { type: "number", description: "A confidence score from 0.0 to 1.0 for the extraction accuracy." },
    },
    required: [
        "make", "model", "year", "color", "price", "mileage", "bodyType", 
        "fuelType", "transmission", "description", "confidence"
    ],
};

/**
 * Processes a car image using the Gemini API to extract car details.
 * @param {FormData} formData - FormData containing the 'image' file.
 * @returns {Promise<{success: true, data: object} | {success: false, error: string}>}
 */
export async function processCarImageWithAI(formData) {
  try {
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return { success: false, error: "Invalid file upload. Expected a File object." };
    }
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not set in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const base64Image = await fileToBase64(file);

    // Image part structure
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: file.type,
        },
    };
    
    // Prompt text
    const promptText = `
      Analyze the car image and extract all required vehicle details. 
      If a value is not directly visible (like mileage or price), 
      provide your best informed guess based on the car's type, age, and visual condition.
    `;

    // Configuration for Structured Output (JSON) - Renamed for clarity inside this function
    const localConfig = {
        responseMimeType: "application/json",
        responseSchema: carDetailsSchema,
        temperature: 0.0, // Low temperature for factual extraction
    };

    // SDK Content array structure for multimodal input
    const contents = [
        {
            role: "user",
            parts: [
                imagePart, // The image part object (inlineData)
                { text: promptText } // The text part object
            ]
        }
    ];

    // 🚨 CRITICAL FIX: Nest the configuration object inside 'generationConfig' 
    const result = await model.generateContent({
        contents: contents, 
        generationConfig: localConfig // <-- FIX: Use generationConfig field
    });
    
    // The response is expected to be a clean JSON string
    const jsonText = result.response.text;
    
    if (typeof jsonText !== 'string' || !jsonText.trim()) {
      // Handles cases where the model fails to adhere to the schema
      console.error("Gemini Failure: Did not return a valid JSON string after structured output attempt.", result.response);
      return { 
          success: false, 
          error: "AI failed to generate valid structured data. Try a different image or prompt." 
      };
    }

    try {
      // Direct parsing—no string cleaning needed
      const carDetails = JSON.parse(jsonText);

      const requiredFields = carDetailsSchema.required;
      
      // Final structural check
      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails) || carDetails[field] === ""
      );

      if (missingFields.length > 0) {
        console.warn("AI response missing or empty fields:", missingFields.join(", "), "Response:", carDetails);
        return {
          success: false,
          error: `AI response missing or empty required fields: ${missingFields.join(", ")}`,
        };
      }

      return {
        success: true,
        data: carDetails,
      };
    } catch (error) {
      console.error("Gemini Failure: Failed to Parse AI Response:", error.message);
      console.error("Raw AI Text:", jsonText);
      return {
        success: false,
        error: "AI returned data, but it failed the final JSON parsing step.",
      };
    }
  } catch (error) {
    console.error("Gemini API Connection/Request Error:", error);
    // Ensure the client receives the specific error message
    return { success: false, error: `AI processing error: ${error.message}` };
  }
}

// ----------------------------------------------------------------------
// CAR CREATION & DATABASE INTERACTION
// ----------------------------------------------------------------------

/**
 * Adds a new car listing and uploads its images to Supabase storage.
 * @param {object} params
 * @param {object} params.carData - The car details.
 * @param {string[]} params.images - Array of base64-encoded image strings.
 * @returns {Promise<{success: true, data: object} | {success: false, error: string}>}
 */
export async function addCar({ carData, images }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found in database (Prisma).");
    }

    // 🚀 FIX: Use the safe validation helper
    const price = cleanAndValidateNumber(carData.price, 'price');
    const mileage = cleanAndValidateNumber(carData.mileage, 'mileage');
    
    const seats = carData.seats !== null && carData.seats !== undefined
        ? cleanAndValidateNumber(carData.seats, 'seats')
        : null;

    const carId = uuidv4();
    const folderPath = `cars/${carId}`;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const base64Data = images[i];

      // CRITICAL CHECK: Ensure data is a valid Base64 string from the client
      if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith("data:image/")) {
        console.warn(`Skipping invalid or malformed image data at index ${i}`);
        continue;
      }

      const parts = base64Data.split(",");
      if (parts.length < 2) {
          console.warn(`Skipping image due to missing base64 part at index ${i}`);
          continue;
      }
      
      const base64 = parts[1];
      const imageBuffer = Buffer.from(base64, "base64");

      const mimeMatch = base64Data.match(/data:(.*?);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const fileExtension = mimeType.split("/")[1] || "jpg";

      const fileName = `car_image_${i + 1}_${Date.now()}.${fileExtension}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.error("FATAL IMAGE UPLOAD ERROR:", error);
        throw new Error(`Supabase upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL for image.");
      }
      imageUrls.push(publicUrlData.publicUrl);
    }

    if (imageUrls.length === 0) {
      throw new Error("No valid images provided for upload.");
    }

    const carCreationData = {
      id: carId,
      make: carData.make,
      model: carData.model,
      year: carData.year,
      color: carData.color,
      price: price, // Cleaned and validated
      mileage: mileage, // Cleaned and validated
      bodyType: carData.bodyType,
      fuelType: carData.fuelType,
      transmission: carData.transmission,
      description: carData.description,
      images: imageUrls,
      userId: user.id,
      status: carData.status,
      featured: carData.featured,
      seats: seats, // Cleaned and validated
    };

    const car = await db.car.create({ data: carCreationData });

    revalidatePath("/admin/cars");

    return { success: true, data: car };
  } catch (error) {
    // This top-level catch handles all throws and returns the structured response.
    console.error("FATAL ADD CAR ERROR:", error.message);
    return { success: false, error: `Failed to add car: ${error.message}` };
  }
}

// ----------------------------------------------------------------------
// CAR RETRIEVAL AND DELETION
// ----------------------------------------------------------------------

/**
 * Fetches car listings for the authenticated user/admin, with optional search.
 * @param {string} search - Search term for make, model, or color.
 * @returns {Promise<{success: true, data: object[]} | {success: false, error: string}>}
 */
export async function getCars(search = "") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated"); 

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User Not Found in Database"); 

    let where = {};
    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
      ];
    }
    
    const cars = await db.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const serializedCars = cars.map(serializedCarData);
    return { success: true, data: serializedCars };
  } catch (error) {
    console.error("Error Fetching Car:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes a car and its associated images from Supabase storage.
 * @param {string} carId - The ID of the car to delete.
 * @returns {Promise<{success: true} | {success: false, error: string}>}
 */
export async function deleteCar(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });
    if (!user) throw new Error("User Not Found in Database");

    const car = await db.car.findUnique({
      where: { id: carId },
      select: { images: true }
    });

    if (!car) {
      return { success: false, error: "Car Not Found" };
    }

    await db.car.delete({ where: { id: carId } });

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const filePaths = car.images
      .map((imageUrl) => {
        const parsedUrl = new URL(imageUrl);
        const pathMatch = parsedUrl.pathname.match(/\/car-images\/(.+)$/);
        return pathMatch ? pathMatch[1] : null;
      })
      .filter(Boolean);

    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from("car-images")
        .remove(filePaths);

      if (error) {
        console.error("Error Deleting images from Supabase:", error);
      }
    }

    revalidatePath("/admin/cars");

    return { success: true };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates the status or featured flag of a car.
 * @param {string} id - The ID of the car to update.
 * @param {object} data - Object containing optional 'status' (string) and 'featured' (boolean).
 * @returns {Promise<{success: true} | {success: false, error: string}>}
 */
export async function updateCarStatus(id, { status, featured }) { 
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });
    if (!user) throw new Error("User Not Found in Database");

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    
    if (Object.keys(updateData).length === 0) {
        return { success: false, error: "No update data provided for status or featured." };
    }

    await db.car.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/cars");

    return { success: true };
  } catch (error) {
    console.error("Error updating car status:", error);
    return { success: false, error: error.message };
  }
}