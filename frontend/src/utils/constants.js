import {
  PersonAddAlt1Rounded,
  GridViewOutlined,
  WorkHistory,
  PaymentsRounded,
  AccountBalanceRounded,
} from "@mui/icons-material";
const connection =
  "mongodb+srv://negokamgaing:<password>@app-rent-mern.hzderzk.mongodb.net/?retryWrites=true&w=majority";

const categories = [
  { name: "Dashboard", icon: <GridViewOutlined />, link: "/" },
  { name: "Locataires", icon: <PersonAddAlt1Rounded />, link: "/locataires" },
  { name: "Versement", icon: <AccountBalanceRounded />, link: "/versement" },
  { name: "Depenses", icon: <PaymentsRounded />, link: "/depenses" },
  { name: "Historiques", icon: <WorkHistory />, link: "/historiques" },
];

// Fonction pour générer les valeurs
function genererValeurChambre_A(index) {
  return `${index + 1}A`;
}
function genererValeurChambre_B(index) {
  return `${index + 1}B`;
}

// Création de la liste de chambres
const chambres = [];

// Boucle pour générer les valeurs et les ajouter à la liste
for (let i = 0; i < 32; i++) {
  const chambre = {
    value: genererValeurChambre_A(i),
    label: genererValeurChambre_A(i),
  };
  chambres.push(chambre);
}
for (let i = 0; i < 14; i++) {
  const chambre = {
    value: genererValeurChambre_B(i),
    label: genererValeurChambre_B(i),
  };
  chambres.push(chambre);
}
chambres.push(
  ...[
    { value: "studio 1B", label: "studio 1B" },
    { value: "studio 2B", label: "studio 2B" },
    { value: "studio 3B", label: "studio 3B" },
  ]
);

export { chambres, categories };
