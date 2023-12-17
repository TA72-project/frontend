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
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "../../requests/skills.ts";
import { useSnack } from "../../context/snackbar/snackbarContext.ts";
import { ISkill } from "../../utils/interfaces.ts";

export default function SkillsPage() {
  const { snackbarValues, setSnackbarValues } = useSnack();
  const [skillList, setSkillList] = useState<ISkill[]>([]);
  const [idSkillToDelete, setIdSkillToDelete] = useState<number>();
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

  const openEditForm = (skill: ISkill) => {
    setFormValues(skill);
    handleOpenDialogForm();
  };

  const openDeleteForm = (id: number) => {
    setIdSkillToDelete(id);
    handleOpenDelete();
  };

  const fetchSkills = async (currentPage: number, pageSize: number) => {
    try {
      const response = await getAllSkills(currentPage, pageSize);
      if (response) {
        setSkillList(response.data);
        setRowCount(response.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des compétences", error);
    }
  };

  const setSuccess = () => {
    setSnackbarValues((prevState) => ({
      ...prevState,
      isOpen: true,
      severity: "success",
      message: "Operation réussie !",
    }));
    fetchSkills(currentPage, pageSize);
  };

  const setFail = () => {
    setSnackbarValues((prevState) => ({
      ...prevState,
      isOpen: true,
      severity: "error",
      message:
        "Une erreur est survenue. Veuillez contacter le service technique.",
    }));
  };

  const handleDeleteSkill = async () => {
    try {
      if (idSkillToDelete) {
        await deleteSkill(idSkillToDelete);
        fetchSkills(currentPage, pageSize);
      }
      setSuccess();
      handleCloseDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression de la compétence", error);
      setFail();
    }
  };

  const handleSaveSkill = async () => {
    try {
      if (formValues.id != null) {
        await updateSkill(formValues.id, formValues.name);
      } else {
        await createSkill(formValues.name);
      }
      setSuccess();
      handleCloseDialogForm();
    } catch (error) {
      console.error("Erreur lors de la suppression de la compétence", error);
      setFail();
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
    fetchSkills(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePaginationChanges = (params: GridPaginationModel) => {
    setCurrentPage(params.page + 1);
    setPageSize(params.pageSize);
  };

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
        Nouvelle compétence
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
        rows={skillList}
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
        <DialogContent>
          <TextField
            label="Désignation"
            name="name"
            variant="outlined"
            style={{ width: "100%", marginTop: "10px" }}
            value={formValues.name}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                name: e.target.value,
              })
            }
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogForm}>Fermer</Button>
          <Button onClick={() => handleSaveSkill()} autoFocus>
            Enregistrer
          </Button>
        </DialogActions>
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
          <Button onClick={() => handleDeleteSkill()} autoFocus>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
