import { red, green, blue, teal } from "@mui/material/colors";

export enum Status {
  DONE = "Réalisée",
  MISSED = "Non réalisée",
  AFFECTED = "Planifiée",
  PENDING = "Non Planifiée",
}

export enum UserType {
  NURSE = "Infirmier",
  PATIENT = "Patient",
  MANAGER = "Manageur",
}

// Fonction retournant une couleur pour chaque valeur de l'enum
export function getColorForStatus(status: Status): string {
  switch (status) {
    case Status.DONE:
      return teal[500];
    case Status.MISSED:
      return red[500];
    case Status.AFFECTED:
      return green[600];
    case Status.PENDING:
    default:
      return blue[500];
  }
}
