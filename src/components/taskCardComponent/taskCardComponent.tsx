import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { formatDate } from "../../utils/formatUtils";

interface ITaskCardComponentProps {
  title: string;
  start: string;
  end: string;
  patient?: string;
}

export default function TaskCardComponent({
  title,
  start,
  end,
  patient,
}: ITaskCardComponentProps) {
  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton alignItems="flex-start">
        <ListItemText
          primary={title}
          secondary={
            <React.Fragment>
              Début : <strong>{formatDate(start)}</strong> <br />
              Fin : <strong>{formatDate(end)}</strong> <br />
              Patient : <strong>{patient}</strong>
            </React.Fragment>
          }
        />
      </ListItemButton>
      <Divider />
    </List>
  );
}
