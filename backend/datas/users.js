import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admn choupo",
    email: "choupomot237@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Abed",
    email: "negokamgaing@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
  {
    name: "Abdiel",
    email: "abdielk237@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export default users;
