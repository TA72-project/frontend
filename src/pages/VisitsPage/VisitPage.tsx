import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridPaginationModel,
  GridColumnGroupingModel,
  GridRowParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { INurseVisit, IReportVisit, IVisit } from "../../utils/interfaces.ts";
import {
  associateVisitNurse,
  deleteVisit,
  dissociateNurseVisit,
  getAllVisits,
  getVisitNurses,
  getVisitReports,
  updateVisit,
} from "../../requests/visits.ts";
import {
  formatAddress,
  formatDate,
  formatDateForTable,
  formatDateToSave,
  formatNumberToTime,
} from "../../utils/formatUtils.ts";
import { Status, getColorForStatus } from "../../datas/enums.tsx";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MissionDetailsComponent from "../../components/missionComponents/missionDetailsComponent.tsx";
import { grey } from "@mui/material/colors";
import {
  LocalizationProvider,
  DateTimePicker,
  renderTimeViewClock,
  frFR,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getAllNurses } from "../../requests/nurses.ts";
import { DetailsArrayItem } from "../../utils/types.ts";
import { useSnack } from "../../context/snackbar/snackbarContext.ts";

interface IVisitCompleted {
  id: number;
  visit: IVisit;
  nurses: INurseVisit[];
  status: Status;
  reports: IReportVisit[];
}

type Nurse = {
  name: string;
  value: number;
};

export default function VisitPage() {
  const { snackbarValues, setSnackbarValues } = useSnack();
  const [visitList, setVisitList] = useState<IVisitCompleted[]>([]);
  const [visitSelected, setVisitSelected] = useState<IVisitCompleted>();
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [mission, setMission] = useState<DetailsArrayItem[]>([]);
  const [allNurses, setAllNurses] = useState<Array<Nurse>>([]);
  const [formValues, setFormValues] = useState<{
    start: Date;
    end: Date;
    nurses: Array<Nurse>;
  }>({
    start: new Date(),
    end: new Date(),
    nurses: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const fetchVisits = async (currentPage: number, pageSize: number) => {
    try {
      const response = await getAllVisits(currentPage, pageSize);
      if (response) {
        const visitList = response.data;
        const promises = visitList.map(async (visit) => {
          let nurses: INurseVisit[] = [];
          let reports: IReportVisit[] = [];
          let status: Status = Status.AFFECTED;

          const response1 = await getVisitNurses(visit.id);
          const response2 = await getVisitReports(visit.id);

          if (response1) {
            nurses = response1.data;
          }
          if (response2 && response2.data.length > 0) {
            status = Status.DONE;
            reports = response2.data;
          } else {
            if (new Date(visit.start).getTime() > new Date().getTime()) {
              status = Status.AFFECTED;
            } else {
              status = Status.MISSED;
            }
          }

          const visitToAdd: IVisitCompleted = {
            id: visit.id,
            visit,
            nurses,
            status,
            reports,
          };
          return visitToAdd;
        });

        const visitCompleted = await Promise.all(promises);
        setVisitList(visitCompleted);
        setRowCount(response.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des visites", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "status",
      headerName: "Statut",
      valueGetter: (params) => {
        return `${params.row.status || ""}`;
      },
      renderCell: (params) => {
        return (
          <Chip
            label={params.value}
            sx={{
              backgroundColor: getColorForStatus(params.value),
              color: "white",
              fontWeight: "bold",
            }}
          />
        );
      },
      type: "string",
      flex: 0.1,
    },
    {
      field: "start",
      headerName: "Début",
      type: "string",
      valueGetter: (params) => {
        return `${params.row.visit.start || ""}`;
      },
      valueFormatter(params) {
        return formatDateForTable(new Date(params.value));
      },
      flex: 0.12,
    },
    {
      field: "end",
      headerName: "Fin",
      type: "string",
      valueGetter: (params) => {
        return `${params.row.visit.end || ""}`;
      },
      valueFormatter(params) {
        return formatDateForTable(new Date(params.value));
      },
      flex: 0.12,
    },
    {
      field: "type",
      headerName: "Type",
      valueGetter: (params) => {
        return `${params.row.visit.mission.mission_type.name || ""}`;
      },
      valueFormatter: (params) => {
        return `${params.value}`;
      },
      type: "string",
      flex: 0.08,
    },
    {
      field: "fullName",
      headerName: "Nom et prénom",
      type: "string",
      valueGetter: (params) => {
        return `${params.row.visit.mission.patient.fname || ""} ${
          params.row.visit.mission.patient.lname || ""
        }`;
      },
      valueFormatter: (params) => {
        return `${params.value}`;
      },
      flex: 0.1,
    },
    {
      field: "address",
      headerName: "Adresse",
      type: "string",
      valueGetter: (params) => {
        return params.row.visit.mission.patient.address;
      },
      valueFormatter: (params) => {
        return `${formatAddress(params.value)}`;
      },
      flex: 0.15,
    },
    {
      field: "nurses",
      headerName: "Intervenants",
      type: "string",
      valueGetter: (params) => {
        return params.row.nurses;
      },
      valueFormatter: (params) => {
        let nurses = "";
        params.value.map((n: INurseVisit) => {
          nurses += n.fname + " " + n.lname + "; ";
        });
        return nurses;
      },
      flex: 0.15,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      disableExport: true,
      headerAlign: "center",
      flex: 0.1,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Editer"
          onClick={() => openEditForm(params.row as IVisitCompleted)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Supprimer"
          onClick={() => openDeleteForm(params.row as IVisitCompleted)}
        />,
      ],
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "Visite",
      children: [{ field: "status" }, { field: "start" }, { field: "end" }],
    },
    {
      groupId: "Mission",
      children: [{ field: "type" }, { field: "desc" }],
    },
    {
      groupId: "Patient",
      children: [{ field: "fullName" }, { field: "address" }],
    },
  ];

  const loadAllNurses = async () => {
    let total: number | undefined;
    const nurses: Nurse[] = [];
    await getAllNurses(1, 1).then((value) => (total = value?.total));
    if (total) {
      await getAllNurses(1, total).then((value) => {
        if (value) {
          value.data.map((n) => {
            if(n.id) {
              nurses.push({ name: n.fname + " " + n.lname, value: n.id });
            }            
          });
        }
      });
    }
    setAllNurses(nurses);
  };

  const initialiseForm = async (
    start: Date,
    end: Date,
    nursesVisit: INurseVisit[],
  ) => {
    const nurses: Nurse[] = [];
    nursesVisit.map((n) =>
      nurses.push({ name: n.fname + " " + n.lname, value: n.id }),
    );

    setFormValues({
      start: start,
      end: end,
      nurses: nurses,
    });
  };

  const openEditForm = (visitCopy: IVisitCompleted) => {
    loadAllNurses();
    setVisitSelected(visitCopy);
    initialiseForm(
      new Date(visitCopy.visit.start),
      new Date(visitCopy.visit.end),
      visitCopy.nurses,
    );
    if (visitCopy.visit) {
      const missionInfos: DetailsArrayItem[] = [
        {
          details: [
            {
              label: "Type",
              value: visitCopy.visit.mission.mission_type.name,
            },
            {
              label: "Date de début",
              value: formatDate(visitCopy.visit.mission.start.toString()),
            },
            {
              label: "Date de fin",
              value: formatDate(visitCopy.visit.mission.end.toString()),
            },
            {
              label: "Durée",
              value: formatNumberToTime(
                visitCopy.visit.mission.minutes_duration,
              ),
            },
            {
              label: "Personne requise",
              value: visitCopy.visit.mission.people_required,
            },
            { label: "Description", value: visitCopy.visit.mission.desc },
          ],
          title: "Détail de la mission",
        },
        {
          details: [
            {
              label: "Nom et prénom ",
              value:
                visitCopy.visit.mission.patient.lname +
                " " +
                visitCopy.visit.mission.patient.fname,
            },
            {
              label: "Téléphone",
              value: visitCopy.visit.mission.patient.phone,
            },
            {
              label: "Adresse",
              value: formatAddress(visitCopy.visit.mission.patient.address),
            },
          ],
          title: "Patient",
        },
      ];
      setMission(missionInfos);
    }
    setOpenDialogForm(true);
  };

  const openDeleteForm = (visitCopy: IVisitCompleted) => {
    setVisitSelected(visitCopy);
    handleOpenDelete();
  };

  useEffect(() => {
    fetchVisits(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePaginationChanges = (params: GridPaginationModel) => {
    setCurrentPage(params.page + 1);
    setPageSize(params.pageSize);
  };

  const handleCloseDialogForm = () => {
    setOpenDialogForm(false);
    setFormValues({ start: new Date(), end: new Date(), nurses: [] });
  };

  const getNurse = (nurse: INurseVisit) => {
    return nurse.fname + " " + nurse.lname;
  };

  const getReport = (idNurse: number, reports: IReportVisit[]) => {
    if (reports && reports.length > 0) {
      const report = reports.filter((v) => v.id_nurse == idNurse)[0];
      return report ? report.report : "Aucun rapport enregistré";
    }
    return "Aucun rapport enregistré";
  };

  const saveEvent = async (idVisit: number | undefined) => {
    try {
      if (idVisit && visitSelected) {
        await updateVisit(
          idVisit,
          formatDateToSave(formValues.start),
          formatDateToSave(formValues.end),
        );
        visitSelected.nurses.map(async (nurse) => {
          await dissociateNurseVisit(idVisit, nurse.id);
        });
        formValues.nurses.map(async (nurse) => {
          await associateVisitNurse(idVisit, nurse.value);
        });
        setSnackbarValues((prevState) => ({
          ...prevState,
          isOpen: true,
          severity: "success",
          message: "Operation réussie !",
        }));
        fetchVisits(currentPage, pageSize);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la visite :", error);
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

  const handleDeleteVisit = async () => {
    try {
      if (visitSelected) {
        visitSelected.nurses.map(async (nurse) => {
          await dissociateNurseVisit(visitSelected.id, nurse.id);
        });
        await deleteVisit(visitSelected.id);
        setSnackbarValues((prevState) => ({
          ...prevState,
          isOpen: true,
          severity: "success",
          message: "Operation réussie !",
        }));
        fetchVisits(currentPage, pageSize);
      }
      handleCloseDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression de la visite", error);
    }
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <Box textAlign="center">
      {snackbarValues.isOpen && (
        <div>
          {snackbarValues.severity === "success"}
          {snackbarValues.severity === "error"}
        </div>
      )}
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
        rows={visitList}
        rowCount={rowCount}
        columns={columns}
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroupingModel}
        onPaginationModelChange={handlePaginationChanges}
      />

      {visitSelected && (
        <Dialog
          fullWidth={true}
          maxWidth={"lg"}
          open={openDialogForm}
          onClose={handleCloseDialogForm}
          scroll={"paper"}
        >
          <DialogTitle>
            <Chip
              label={"Intervention : " + visitSelected.status}
              sx={{
                backgroundColor: getColorForStatus(visitSelected.status),
                color: "white",
                fontWeight: "bold",
              }}
            />
          </DialogTitle>
          <DialogContent>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Paper style={{ padding: "5px" }}>
                  <MissionDetailsComponent mission={mission} />
                </Paper>
              </Grid>
              {(visitSelected.status == Status.DONE ||
                visitSelected.status == Status.MISSED) && (
                <Grid item xs={12} md={6}>
                  <Paper style={{ padding: "5px" }}>
                    <Paper
                      elevation={0}
                      style={{ padding: "15px", backgroundColor: grey[50] }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Bilan d'intervention</strong>
                      </Typography>
                      <Table>
                        <TableBody>
                          <TableRow key={"startEvent"}>
                            <TableCell align="right" component="th" scope="row">
                              Début
                            </TableCell>
                            <TableCell align="center">:</TableCell>
                            <TableCell>
                              {formatDate(visitSelected.visit.start.toString())}
                            </TableCell>
                          </TableRow>
                          <TableRow key={"endEvent"}>
                            <TableCell align="right" component="th" scope="row">
                              Fin
                            </TableCell>
                            <TableCell align="center">:</TableCell>
                            <TableCell>
                              {formatDate(visitSelected.visit.end.toString())}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          <strong>Intervenants et rapports</strong>
                        </Typography>
                        {visitSelected.nurses &&
                          visitSelected.nurses.map((n, index) => (
                            <Accordion key={index}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{getNurse(n)}</Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                style={{ backgroundColor: grey[50] }}
                              >
                                <Typography>
                                  Rapport :{" "}
                                  {getReport(n.id, visitSelected.reports)}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                      </Grid>
                    </Paper>
                  </Paper>
                </Grid>
              )}
              {visitSelected.status == Status.AFFECTED && (
                <Grid item xs={12} md={6}>
                  <Paper style={{ padding: "5px" }}>
                    <Paper
                      elevation={0}
                      style={{ padding: "15px", backgroundColor: grey[50] }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>Plannification</strong>
                      </Typography>
                      <form>
                        <Grid
                          container
                          rowSpacing={2}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                          <Grid item xs={12}>
                            <LocalizationProvider
                              adapterLocale="fr"
                              localeText={
                                frFR.components.MuiLocalizationProvider
                                  .defaultProps.localeText
                              }
                              dateAdapter={AdapterDayjs}
                            >
                              <DateTimePicker
                                label="Début"
                                sx={{ width: "100%" }}
                                onChange={(event) =>
                                  setFormValues({
                                    ...formValues,
                                    start: new Date(event?.$d),
                                  })
                                }
                                defaultValue={dayjs(visitSelected.visit.start)}
                                viewRenderers={{
                                  hours: renderTimeViewClock,
                                  minutes: renderTimeViewClock,
                                  seconds: renderTimeViewClock,
                                }}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12}>
                            <LocalizationProvider
                              adapterLocale="fr"
                              localeText={
                                frFR.components.MuiLocalizationProvider
                                  .defaultProps.localeText
                              }
                              dateAdapter={AdapterDayjs}
                            >
                              <DateTimePicker
                                label="Fin"
                                sx={{ width: "100%" }}
                                defaultValue={dayjs(visitSelected.visit.end)}
                                onChange={(event) => {
                                  setFormValues({
                                    ...formValues,
                                    end: new Date(event?.$d),
                                  });
                                }}
                                viewRenderers={{
                                  hours: renderTimeViewClock,
                                  minutes: renderTimeViewClock,
                                  seconds: renderTimeViewClock,
                                }}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12}>
                            <Autocomplete
                              multiple
                              id="nurse"
                              value={formValues.nurses || null}
                              options={allNurses}
                              getOptionLabel={(option) => option.name}
                              onChange={(event, newValue) => {
                                setFormValues({
                                  ...formValues,
                                  nurses: newValue,
                                });
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              }
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  value={formValues.nurses || null}
                                  label="Intervenants"
                                  placeholder="Ajouter"
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </form>
                    </Paper>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogForm}>Fermer</Button>
            {visitSelected.status != Status.MISSED &&
              visitSelected.status != Status.DONE && (
                <Button
                  onClick={() => saveEvent(visitSelected.id)}
                  autoFocus
                  variant="contained"
                >
                  Enregistrer
                </Button>
              )}
          </DialogActions>
        </Dialog>
      )}

      {visitSelected && (
        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle>Supprimer une visite</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Etes-vous sûr de vouloir supprimer cette visite ? <br />
              Cette action est irréversible
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Annuler</Button>
            <Button onClick={() => handleDeleteVisit()} autoFocus>
              Valider
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
