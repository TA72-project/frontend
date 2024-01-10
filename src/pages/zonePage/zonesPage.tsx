import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridActionsCellItem,
  GridToolbar,
  GridPaginationModel,
} from "@mui/x-data-grid";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnack } from "../../context/snackbar/snackbarContext.ts";
import { IZone } from "../../utils/interfaces.ts";
import {
  createZone,
  deleteZone,
  getAllZones,
  updateZone,
} from "../../requests/zones.ts";
import { getAllCenters } from "../../requests/centers.ts";

interface ISelectField {
  name: string;
  value: number;
}

export default function ZonesPage() {
  const { snackbarValues, setSnackbarValues } = useSnack();
  const [idCenter, _] = useState("1");
  const [centerList, setCenterList] = useState<ISelectField[]>([]);
  const [zoneList, setZoneList] = useState<IZone[]>([]);
  const [idZoneToDelete, setIdZoneToDelete] = useState<number>();
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formValues, setFormValues] = useState<{
    id: number | null;
    name: string;
  }>({
    id: null,
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const openEditForm = (zoneCopy: IZone) => {
    setFormValues(zoneCopy);
    handleOpenDialogForm();
  };

  const openDeleteForm = (id: number) => {
    setIdZoneToDelete(id);
    handleOpenDelete();
  };

  const loadCenters = async () => {
    let total: number | undefined;
    const centers: ISelectField[] = [];
    await getAllCenters(1, 1).then((value) => (total = value?.total));
    if (total) {
      await getAllCenters(1, total).then((value) => {
        if (value) {
          value.data.map((center) =>
            centers.push({
              name: center.name,
              value: center.id,
            }),
          );
        }
      });
      setCenterList(centers);
    }
  };

  const fetchZones = async (
    idCenter: string,
    currentPage: number,
    pageSize: number,
  ) => {
    try {
      const response = await getAllZones(
        parseInt(idCenter),
        currentPage,
        pageSize,
      );
      if (response) {
        setZoneList(response.data);
        setRowCount(response.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des zones", error);
    }
  };

  const handleDeleteZone = async () => {
    try {
      if (idZoneToDelete) {
        await deleteZone(idZoneToDelete);
        fetchZones(idCenter, currentPage, pageSize);
      }
      handleCloseDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression de la zone", error);
    }
  };

  const handleSaveZone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formValues.id != null) {
        await updateZone(formValues.id, formValues.name);
      } else {
        await createZone(formValues.name);
      }
      setSnackbarValues((prevState) => ({
        ...prevState,
        isOpen: true,
        severity: "success",
        message: "Operation réussie !",
      }));
      fetchZones(idCenter, currentPage, pageSize);
      handleCloseDialogForm();
    } catch (error) {
      console.error("Erreur lors de la suppression de la zone", error);
      setSnackbarValues((prevState) => ({
        ...prevState,
        isOpen: true,
        severity: "error",
        message:
          "Une erreur est survenue. Veuillez contacter le service technique.",
      }));
    }
  };

  const handleOpenDialogForm = () => {
    setOpenDialogForm(true);
  };

  const handleCloseDialogForm = () => {
    setOpenDialogForm(false);
    setFormValues({
      id: null,
      name: "",
    });
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Désignation",
      type: "string",
      flex: 0.75,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      disableExport: true,
      headerAlign: "center",
      flex: 0.25,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Editer"
          onClick={() => openEditForm(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Supprimer"
          onClick={() => openDeleteForm(params.row.id)}
        />,
      ],
    },
  ];

  useEffect(() => {
    if (centerList.length < 1) {
      loadCenters();
    }
    fetchZones(idCenter, currentPage, pageSize);
  }, [currentPage, pageSize, idCenter, centerList.length]);

  const handlePaginationChanges = (params: GridPaginationModel) => {
    setCurrentPage(params.page + 1);
    setPageSize(params.pageSize);
  };

  if (centerList.length == 0) {
    return <div>{"Page is loading ..."}</div>;
  }

  return (
    <Box>
      {snackbarValues.isOpen && (
        <div>
          {snackbarValues.severity === "success"}
          {snackbarValues.severity === "error"}
        </div>
      )}
      <Button
        variant="contained"
        color="success"
        sx={{ m: 2 }}
        onClick={() => handleOpenDialogForm()}
      >
        Nouvelle zone
      </Button>
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
        rows={zoneList}
        rowCount={rowCount}
        columns={columns}
        onPaginationModelChange={handlePaginationChanges}
      />
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={openDialogForm}
        onClose={handleCloseDialogForm}
        aria-labelledby="form"
        scroll={"paper"}
      >
        <DialogTitle id="form">
          {"Formulaire de "}
          {formValues.name != "" ? "modification" : "création"}
        </DialogTitle>
        <form onSubmit={handleSaveZone}>
          <DialogContent>
            <Grid item xs={12}>
              <TextField
                label="Désignation"
                name="name"
                variant="outlined"
                fullWidth
                style={{ marginTop: "10px" }}
                value={formValues.name}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    name: e.target.value,
                  })
                }
                required
                autoFocus
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogForm}>Fermer</Button>
            <Button type="submit" autoFocus>
              Enregistrer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Supprimer une compétence</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Etes-vous sûr de vouloir supprimer cette compétence ? <br />
            Cette action est irréversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Annuler</Button>
          <Button onClick={() => handleDeleteZone()} autoFocus>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
