import { User } from "@prisma/client";

export const Calculate = ({ Users }: { Users: User[] }) => {
  let sum = 0;
  for (let i = 0; i < Users.length; ++i) {
    sum += Users[i].selectedNum || 0;
  }

  // Calculate the average and adjust it to 80%
  let res = (sum / Users.length) * 0.8;

  // Find the user whose selectedNum is closest to res
  let closestUser = Users[0];
  let closestUsers = [Users[0]]; // Initialize with the first user
  let minDiff = Math.abs(Users[0].selectedNum || 0 - res);

  for (let i = 1; i < Users.length; ++i) {
    let diff = Math.abs(Users[i].selectedNum || 0 - res);
    if (diff <= minDiff) {
      if (diff === minDiff) {
        closestUsers.push(Users[i]); // Add to array if the difference is the same
      } else {
        minDiff = diff;
        closestUser = Users[i];
        closestUsers = [Users[i]]; // Reset array with the new closest user
      }
    }
  }

  return { user: closestUser, users: closestUsers };
};
