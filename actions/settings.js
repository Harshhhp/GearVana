// "use server";

// import { revalidatePath } from "next/cache";
// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// // Get dealership info with working hours
// export async function getDealershipInfo() {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Get the dealership record
//     let dealership = await db.dealershipInfo.findFirst({
//       include: {
//         workingHours: {
//           orderBy: {
//             dayOfWeek: "asc",
//           },
//         },
//       },
//     });

//     // If no dealership exists, create a default one
//     if (!dealership) {
//       dealership = await db.dealershipInfo.create({
//         data: {
//           // Default values will be used from schema
//           workingHours: {
//             create: [
//               {
//                 dayOfWeek: "MONDAY",
//                 openTime: "09:00",
//                 closeTime: "18:00",
//                 isOpen: true,
//               },
//               {
//                 dayOfWeek: "TUESDAY",
//                 openTime: "09:00",
//                 closeTime: "18:00",
//                 isOpen: true,
//               },
//               {
//                 dayOfWeek: "WEDNESDAY",
//                 openTime: "09:00",
//                 closeTime: "18:00",
//                 isOpen: true,
//               },
//               {
//                 dayOfWeek: "THURSDAY",
//                 openTime: "09:00",
//                 closeTime: "18:00",
//                 isOpen: true,
//               },
//               {
//                 dayOfWeek: "FRIDAY",
//                 openTime: "09:00",
//                 closeTime: "18:00",
//                 isOpen: true,
//               },
//               {
//                 dayOfWeek: "SATURDAY",
//                 openTime: "10:00",
//                 closeTime: "16:00",
//                 isOpen: true,
//               },
//               {
//                 dayOfWeek: "SUNDAY",
//                 openTime: "10:00",
//                 closeTime: "16:00",
//                 isOpen: false,
//               },
//             ],
//           },
//         },
//         include: {
//           workingHours: {
//             orderBy: {
//               dayOfWeek: "asc",
//             },
//           },
//         },
//       });
//     }

//     // Format the data
//     return {
//       success: true,
//       data: {
//         ...dealership,
//         createdAt: dealership.createdAt.toISOString(),
//         updatedAt: dealership.updatedAt.toISOString(),
//       },
//     };
//   } catch (error) {
//     throw new Error("Error fetching dealership info:" + error.message);
//   }
// }

// // Save working hours
// export async function saveWorkingHours(workingHours) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Check if user is admin
//     const user = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!user || user.role !== "ADMIN") {
//       throw new Error("Unauthorized: Admin access required");
//     }

//     // Get current dealership info
//     const dealership = await db.dealershipInfo.findFirst();

//     if (!dealership) {
//       throw new Error("Dealership info not found");
//     }

//     // Update working hours - first delete existing hours
//     await db.workingHour.deleteMany({
//       where: { dealershipId: dealership.id },
//     });

//     // Then create new hours
//     for (const hour of workingHours) {
//       await db.workingHour.create({
//         data: {
//           dayOfWeek: hour.dayOfWeek,
//           openTime: hour.openTime,
//           closeTime: hour.closeTime,
//           isOpen: hour.isOpen,
//           dealershipId: dealership.id,
//         },
//       });
//     }

//     // Revalidate paths
//     revalidatePath("/admin/settings");
//     revalidatePath("/"); // Homepage might display hours

//     return {
//       success: true,
//     };
//   } catch (error) {
//     throw new Error("Error saving working hours:" + error.message);
//   }
// }

// // Get all users
// export async function getUsers() {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Check if user is admin
//     const adminUser = await db.user.findUnique({
//       where: { clerkUserId: userId },
//     });

//     if (!adminUser || adminUser.role !== "ADMIN") {
//       throw new Error("Unauthorized: Admin access required");
//     }

//     // Get all users
//     const users = await db.user.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     return {
//       success: true,
//       data: users.map((user) => ({
//         ...user,
//         createdAt: user.createdAt.toISOString(),
//         updatedAt: user.updatedAt.toISOString(),
//       })),
//     };
//   } catch (error) {
//     throw new Error("Error fetching users:" + error.message);
//   }
// }

// // Update user role
// export async function updateUserRole(userId, role) {
//   try {
//     const { userId: adminId } = await auth();
//     if (!adminId) throw new Error("Unauthorized");

//     // Check if user is admin
//     const adminUser = await db.user.findUnique({
//       where: { clerkUserId: adminId },
//     });

//     if (!adminUser || adminUser.role !== "ADMIN") {
//       throw new Error("Unauthorized: Admin access required");
//     }

//     // Update user role
//     await db.user.update({
//       where: { id: userId },
//       data: { role },
//     });

//     // Revalidate paths
//     revalidatePath("/admin/settings");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     throw new Error("Error updating user role:" + error.message);
//   }
// }

"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Helper constant for the days of the week enum from your schema
const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

// -----------------------------------------------------------------------------
// Get dealership info with working hours (Find or Create Logic)
// -----------------------------------------------------------------------------
export async function getDealershipInfo() {
  try {
    const { userId } = await auth();
    // Assuming a user must be logged in to view settings, even if not an Admin yet
    if (!userId) throw new Error("Unauthorized");

    // 1. Get the dealership record
    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            // Correctly order by the enum's natural order
            dayOfWeek: "asc", 
          },
        },
      },
    });

    // 2. If no dealership exists, create a default one with default hours
    if (!dealership) {
      // Prepare default working hours data
      const defaultHours = DAYS_OF_WEEK.map((day) => ({
        dayOfWeek: day,
        day: day, // Prisma field 'day'
        openTime: day === "SATURDAY" ? "10:00" : "09:00",
        closeTime: day === "SATURDAY" ? "16:00" : "18:00",
        isOpen: day !== "SUNDAY",
      }));

      dealership = await db.dealershipInfo.create({
        data: {
          // Default name/address from schema used
          workingHours: {
            create: defaultHours,
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }

    // 3. Format the data for client
    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("[GET_DEALERSHIP_INFO_ERROR]", error);
    throw new Error("Error fetching dealership info: " + error.message);
  }
}

// -----------------------------------------------------------------------------
// Save working hours (Optimized with Upsert)
// -----------------------------------------------------------------------------
export async function saveWorkingHours(workingHours) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    // 2. Get current dealership info ID
    const dealership = await db.dealershipInfo.findFirst({
        select: { id: true }
    });

    if (!dealership) {
      // This should be unreachable due to getDealershipInfo logic, but is a safety check
      throw new Error("Dealership info not found in database."); 
    }
    const dealershipId = dealership.id;
    
    // 3. Prepare upsert transactions for all 7 days
    const transactions = workingHours.map((hour) => {
        // Simple validation
        if (!DAYS_OF_WEEK.includes(hour.dayOfWeek)) {
            throw new Error(`Invalid day of week value: ${hour.dayOfWeek}`);
        }
        
        return db.workingHour.upsert({
            where: {
                // Uses the compound unique index: @@unique([dealershipId, dayOfWeek])
                dealershipId_dayOfWeek: {
                    dealershipId: dealershipId,
                    dayOfWeek: hour.dayOfWeek,
                },
            },
            update: {
                openTime: hour.openTime,
                closeTime: hour.closeTime,
                isOpen: hour.isOpen,
                // Ensure 'day' field is included if necessary, matching dayOfWeek
                day: hour.dayOfWeek, 
            },
            create: {
                dealershipId: dealershipId,
                dayOfWeek: hour.dayOfWeek,
                day: hour.dayOfWeek,
                openTime: hour.openTime,
                closeTime: hour.closeTime,
                isOpen: hour.isOpen,
            },
        });
    });

    // 4. Execute all upserts in a single database transaction
    await db.$transaction(transactions);

    // 5. Revalidate paths
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error("[SAVE_WORKING_HOURS_ERROR]", error);
    // Provide a more descriptive error message in the console
    throw new Error("Error saving working hours: " + error.message);
  }
}

// -----------------------------------------------------------------------------
// Get all users
// -----------------------------------------------------------------------------
export async function getUsers() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if user is admin
    const adminUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Get all users
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("[GET_USERS_ERROR]", error);
    throw new Error("Error fetching users: " + error.message);
  }
}

// -----------------------------------------------------------------------------
// Update user role
// -----------------------------------------------------------------------------
export async function updateUserRole(userId, role) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) throw new Error("Unauthorized");

    // Check if user is admin
    const adminUser = await db.user.findUnique({
      where: { clerkUserId: adminId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }
    
    // Safety check: Prevent changing own role (optional)
    const targetUser = await db.user.findUnique({
        where: { id: userId },
        select: { clerkUserId: true }
    });

    if (targetUser?.clerkUserId === adminId && role !== "ADMIN") {
        throw new Error("Cannot demote your own admin role.");
    }


    // Update user role
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    // Revalidate paths
    revalidatePath("/admin/settings");

    return {
      success: true,
    };
  } catch (error) {
    console.error("[UPDATE_ROLE_ERROR]", error);
    throw new Error("Error updating user role: " + error.message);
  }
}