import {
  Box,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { DetailsArrayItem } from "../../utils/types";

type Props = {
  mission: DetailsArrayItem[] | null;
};

export default function MissionDetailsComponent({ mission }: Props) {
  return (
    <div>
      {mission && mission.map((section) => (
        <Box
          key={section.title}
          sx={{ padding: "15px", backgroundColor: grey[50] }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {section.title}
          </Typography>
          <Table>
            <TableBody>
              {section.details.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="right" component="th" scope="row">
                    {item.label}
                  </TableCell>
                  <TableCell align="center">:</TableCell>
                  <TableCell>
                    {Array.isArray(item.value)
                      ? item.value.map((comp, i) => (
                          <Chip
                            key={i}
                            color={i < 3 ? "primary" : "default"}
                            label={comp}
                          />
                        ))
                      : item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}
    </div>
  );
}
