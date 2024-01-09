import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnGroupingModel,
  GridPaginationModel,
  GridRowParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  createMission,
  deleteMission,
  getAllMissions,
  updateMission,
} from "../../../requests/missions.ts";
import { useEffect, useState } from "react";
import {
  formatAddress,
  formatDate,
  formatDateToSave,
  formatNumberToTime,
} from "../../../utils/formatUtils.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { IMission, ISelectField } from "../../../utils/interfaces.ts";
import { useSnack } from "../../../context/snackbar/snackbarContext.ts";
import {
  LocalizationProvider,
  DateTimePicker,
  renderTimeViewClock,
  frFR,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getAllMissionType } from "../../../requests/missionTypes.ts";
import { getAllPatients } from "../../../requests/patients.ts";
import { useNavigate } from "react-router-dom";

const initialValue = {
  desc: "",
  start: new Date(),
  end: new Date(),
  recurrence_days: 0,
  people_required: 1,
  minutes_duration: 0,
  id_mission_type: 0,
  id_patient: 0,
};

export default function MissionsPage() {
  const navigate = useNavigate();
  const { snackbarValues, setSnackbarValues } = useSnack();
  const [missionList, setMissionList] = useState<IMission[]>([]);
  const [missionTypeList, setMissionTypeList] = useState<ISelectField[]>([]);
  const [patientList, setPatientList] = useState<ISelectField[]>([]);
  const [idMissionToDelete, setIdMissionToDelete] = useState<number>();
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [formValues, setFormValues] = useState<{
    id?: number;
    desc: string;
    start: Date;
    end: Date;
    recurrence_days: number;
    people_required: number;
    minutes_duration: number;
    id_mission_type: number;
    id_patient: number;
  }>(initialValue);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const openEditForm = (mission: IMission) => {
    setFormValues({
      id: mission.id,
      desc: mission.desc,
      start: new Date(mission.start),
      end: new Date(mission.end),
      recurrence_days: mission.recurrence_days,
      people_required: mission.people_required,
      minutes_duration: mission.minutes_duration,
      id_mission_type: mission.id_mission_type,
      id_patient: mission.id_patient,
    });
    handleOpenDialogForm();
  };

  const openDeleteForm = (id: number) => {
    setIdMissionToDelete(id);
    handleOpenDelete();
  };

  const loadMissionTypes = async () => {
    let total: number | undefined;
    const missionTypes: ISelectField[] = [];
    await getAllMissionType(1, 1).then((value) => (total = value?.total));
    if (total) {
      await getAllMissionType(1, total).then((value) => {
        if (value) {
          value.data.map((mt) =>
            missionTypes.push({
              name:
                mt.name +
                " - " +
                " Durée : " +
                formatNumberToTime(mt.minutes_duration) +
                " - Personne : " +
                mt.people_required,
              value: mt.id,
            }),
          );
        }
      });
      setMissionTypeList(missionTypes);
    }
  };

  const loadPatients = async () => {
    let total: number | undefined;
    const missionPatients: ISelectField[] = [];
    await getAllPatients(1, 1).then((value) => (total = value?.total));
    if (total) {
      await getAllPatients(1, total).then((value) => {
        if (value) {
          value.data.map((patient) => {
            if (patient.id) {
              missionPatients.push({
                name: patient.fname + " " + patient.lname,
                value: patient.id,
              });
            }
          });
        }
      });
      setPatientList(missionPatients);
    }
  };

  const fetchMissions = async (currentPage: number, pageSize: number) => {
    try {
      const response = await getAllMissions(currentPage, pageSize);
      if (response) {
        setMissionList(response.data);
        setRowCount(response.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des missions ", error);
    }
  };

  const setSuccess = () => {
    setSnackbarValues((prevState) => ({
      ...prevState,
      isOpen: true,
      severity: "success",
      message: "Operation réussie !",
    }));
    fetchMissions(currentPage, pageSize);
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

  const handleDeleteMission = async () => {
    try {
      if (idMissionToDelete) {
        await deleteMission(idMissionToDelete);
        fetchMissions(currentPage, pageSize);
      }
      setSuccess();
      handleCloseDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression de la mission ", error);
      setFail();
    }
  };

  const handleOpenDialogForm = () => {
    loadPatients();
    loadMissionTypes();
    setOpenDialogForm(true);
  };

  const handleCloseDialogForm = () => {
    setOpenDialogForm(false);
    setFormValues(initialValue);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "Type",
      type: "string",
      valueGetter: (params) => params.row.mission_type.name,
      flex: 0.06,
    },
    {
      field: "desc",
      headerName: "Description",
      type: "string",
      flex: 0.12,
    },
    {
      field: "start",
      headerName: "Début",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const startValue = params.value as string;
        const formattedDateTime = formatDate(startValue);
        return (
          <p style={{ whiteSpace: "pre-line", textAlign: "center" }}>
            {formattedDateTime}
          </p>
        );
      },
      flex: 0.1,
    },
    {
      field: "end",
      headerName: "Fin",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const startValue = params.value as string;
        const formattedDateTime = formatDate(startValue);
        return (
          <p style={{ whiteSpace: "pre-line", textAlign: "center" }}>
            {formattedDateTime}
          </p>
        );
      },
      flex: 0.1,
    },
    {
      field: "people_required",
      headerName: "Intervenant",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.05,
    },
    {
      field: "fname",
      valueGetter: (params) => params.row.patient.fname,
      headerName: "Prénom",
      type: "string",
      flex: 0.06,
    },
    {
      field: "lname",
      valueGetter: (params) => params.row.patient.lname,
      headerName: "Nom",
      type: "string",
      flex: 0.06,
    },
    {
      type: "string",
      field: "address",
      headerName: "Adresse",
      valueGetter: (params) => formatAddress(params.row.patient.address),
      flex: 0.1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      disableExport: true,
      headerAlign: "center",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<AssignmentIcon color="primary" />}
          label="Visualiser"
          onClick={() => navigate("/detail_mission/" + params.row.id)}
        />,
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

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Mission",
      headerAlign: "center",
      children: [
        { field: "type" },
        { field: "desc" },
        { field: "start" },
        { field: "end" },
        { field: "people_required" },
      ],
    },
    {
      groupId: "Patient",
      headerAlign: "center",
      children: [
        { field: "fname" },
        { field: "lname" },
        { field: "phone" },
        { field: "address" },
      ],
    },
  ];

  useEffect(() => {
    fetchMissions(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePaginationChanges = (params: GridPaginationModel) => {
    setCurrentPage(params.page + 1);
    setPageSize(params.pageSize);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formValues.id) {
        await updateMission({
          id: formValues.id,
          desc: formValues.desc,
          start: formatDateToSave(formValues.start),
          end: formatDateToSave(formValues.end),
          recurrence_days: formValues.recurrence_days,
          people_required: formValues.people_required,
          minutes_duration: formValues.minutes_duration,
          id_mission_type: formValues.id_mission_type,
          id_patient: formValues.id_patient,
        });
      } else {
        await createMission({
          desc: formValues.desc,
          start: formatDateToSave(formValues.start),
          end: formatDateToSave(formValues.end),
          recurrence_days: formValues.recurrence_days,
          people_required: formValues.people_required,
          minutes_duration: formValues.minutes_duration,
          id_mission_type: formValues.id_mission_type,
          id_patient: formValues.id_patient,
        });
      }
      setSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression de la compétence", error);
      setSnackbarValues((prevState) => ({
        ...prevState,
        isOpen: true,
        severity: "error",
        message:
          "Une erreur est survenue. Veuillez contacter le service technique.",
      }));
    }
    handleCloseDialogForm();
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
        onClick={handleOpenDialogForm}
      >
        Nouvelle mission
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
        rows={missionList}
        rowCount={rowCount}
        columns={columns}
        onPaginationModelChange={handlePaginationChanges}
        columnGroupingModel={columnGroupingModel}
        experimentalFeatures={{ columnGrouping: true }}
        getRowId={(row) => row.id}
      />
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={openDialogForm}
        onClose={handleCloseDialogForm}
        aria-labelledby="form"
        scroll="paper"
      >
        <DialogTitle id="form">
          {"Formulaire de "}
          {formValues.id ? "modification" : "création"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Type de mission"
                  required
                  fullWidth
                  value={
                    formValues.id_mission_type != 0
                      ? formValues.id_mission_type
                      : ""
                  }
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      id_mission_type: parseInt(e.target.value),
                    })
                  }
                >
                  {missionTypeList.map((option) => (
                    <MenuItem key={"mt" + option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Patient"
                  required
                  fullWidth
                  value={
                    formValues.id_patient != 0 ? formValues.id_patient : ""
                  }
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      id_patient: parseInt(e.target.value),
                    })
                  }
                >
                  {patientList.map((option) => (
                    <MenuItem
                      key={"patient" + option.value}
                      value={option.value}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider
                  adapterLocale="fr"
                  localeText={
                    frFR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                  dateAdapter={AdapterDayjs}
                >
                  <DateTimePicker
                    label="Début"
                    sx={{ width: "100%" }}
                    onChange={(value) =>
                      setFormValues({
                        ...formValues,
                        start: value?.toDate() ? value?.toDate() : new Date(),
                      })
                    }
                    defaultValue={dayjs(formValues.start)}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider
                  adapterLocale="fr"
                  localeText={
                    frFR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                  dateAdapter={AdapterDayjs}
                >
                  <DateTimePicker
                    label="Fin"
                    sx={{ width: "100%" }}
                    defaultValue={dayjs(formValues.end)}
                    onChange={(value) =>
                      setFormValues({
                        ...formValues,
                        end: value?.toDate() ? value?.toDate() : new Date(),
                      })
                    }
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  label="Fréquence (jours)"
                  name="recurrence_days"
                  type="number"
                  fullWidth
                  value={formValues.recurrence_days}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      recurrence_days: parseInt(e.target.value),
                    })
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  label="Personnes requises"
                  name="people_required"
                  type="number"
                  required
                  fullWidth
                  value={formValues.people_required}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      people_required: parseInt(e.target.value),
                    })
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  label="Durée (min)"
                  name="minutes_duration"
                  type="number"
                  required
                  fullWidth
                  value={formValues.minutes_duration}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      minutes_duration: parseInt(e.target.value),
                    })
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="desc"
                  type="text"
                  fullWidth
                  multiline
                  maxRows={5}
                  value={formValues.desc}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      desc: e.target.value,
                    })
                  }
                />
              </Grid>
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
        <DialogTitle>Supprimer une mission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Etes-vous sûr de vouloir supprimer cette mission ? <br />
            Cette action est irréversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Annuler</Button>
          <Button onClick={() => handleDeleteMission()} autoFocus>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
