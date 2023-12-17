import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllCenters } from "../../requests/centers.ts";

export interface ICenter {
  id: number;
  name: string;
  desc: string;
  workday_start: string;
  workday_end: string;
}

export default function CenterPage() {
  const [centerList, setCenterList] = useState<ICenter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const fetchCenters = async (currentPage: number, pageSize: number) => {
    try {
      const response = await getAllCenters(currentPage, pageSize);
      const typedResponse: {
        data: Array<ICenter>;
        page: number;
        per_page: number;
        total: number;
        total_page: number;
      } | null = response as {
        data: Array<ICenter>;
        page: number;
        per_page: number;
        total: number;
        total_page: number;
      } | null;
      if (typedResponse) {
        setCenterList(typedResponse.data);
        setRowCount(typedResponse.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des centres", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Désignation",
      type: "string",
      flex: 0.25,
    },
    {
      field: "desc",
      headerName: "Description",
      type: "string",
      flex: 0.25,
    },
    {
      field: "workday_start",
      headerName: "Heure d'ouverture",
      type: "string",
      flex: 0.25,
    },
    {
      field: "workday_end",
      headerName: "Heure de fermeture",
      type: "string",
      flex: 0.25,
    },
  ];

  useEffect(() => {
    fetchCenters(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePaginationChanges = (params: GridPaginationModel) => {
    setCurrentPage(params.page + 1);
    setPageSize(params.pageSize);
  };

  return (
    <Box textAlign="center">
      <DataGrid
        style={{ border: "none" }}
        slots={{
          toolbar: GridToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: pageSize },
          },
        }}
        density="standard"
        pageSizeOptions={[5, 10, 25]}
        autoHeight
        rows={centerList}
        rowCount={rowCount}
        columns={columns}
        onPaginationModelChange={handlePaginationChanges}
      />
    </Box>
  );
}
