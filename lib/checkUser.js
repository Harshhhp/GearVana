import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No Clerk user found");
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      console.log("User already exists:", loggedInUser.email);
      return loggedInUser;
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl, 
        email: user.emailAddresses[0].emailAddress,
      },
    });

    console.log("New user created:", newUser.email);
    return newUser;

  } catch (error) {
    console.log(error.message);

  }
};
