export const Calculate = ({ Users }: { Users: any }) => {
  let sum = 0;
  for (let user of Users) {
    sum += user.selectedNum;
  }

  // Calculate the average and adjust it to 80%
  let res = (sum / Users.length) * 0.8;

  // Initialize closest user(s)
  let closestUsers = [Users[0]];
  let minDiff = Math.abs(Users[0].selectedNum - res);

  for (let i = 1; i < Users.length; ++i) {
    let diff = Math.abs(Users[i].selectedNum - res);
    if (diff < minDiff) {
      minDiff = diff;
      closestUsers = [Users[i]]; // Reset array with the new closest user
    } else if (diff === minDiff) {
      closestUsers.push(Users[i]); // Add to array if the difference is the same
    }
  }

  // Assuming you still want to return a single user as well as an array of users
  return { user: closestUsers[0], users: closestUsers };
};
