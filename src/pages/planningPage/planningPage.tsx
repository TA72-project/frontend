import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TaskCardComponent from "../../components/taskCardComponent/taskCardComponent.tsx";
import {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import frLocale from "@fullcalendar/core/locales/fr";
import { getAllMissions } from "../../requests/missions.ts";
import {
  associateVisitNurse,
  createVisit,
  dissociateNurseVisit,
  getAllVisits,
  getVisitNurses,
  getVisitReports,
  updateVisit,
} from "../../requests/visits.ts";

import {
  formatAddress,
  formatDate,
  formatDateToSave,
  formatNumberToTime,
} from "../../utils/formatUtils.ts";
import { DetailsArrayItem } from "../../utils/types.ts";
import MissionDetailsComponent from "../../components/missionComponents/missionDetailsComponent.tsx";
import {
  DateTimePicker,
  LocalizationProvider,
  frFR,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { getAllNurses } from "../../requests/nurses.ts";
import { useSnack } from "../../context/snackbar/snackbarContext.ts";
import { IMission, IReportVisit, IVisit } from "../../utils/interfaces.ts";
import { Status, getColorForStatus } from "../../datas/enums.tsx";
import { grey } from "@mui/material/colors";

type VisitStatus = {
  status: Status;
  idVisit?: number;
  editable: boolean;
};

type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    patient: string;
    duration: string;
    idMission: number;
    visitStatus: VisitStatus;
    eventStart: string;
    eventEnd: string;
  };
};

type ExtraData = {
  status: Status;
  start: Date;
  end: Date;
  duration: number;
  eventStart: Date;
  eventEnd: Date;
  idVisit?: number;
  idMission?: number;
};

type SelectedEvent = {
  mission: DetailsArrayItem[];
  extra: ExtraData;
};

type Nurse = {
  name: string;
  value: number;
};

const initialEvent = {
  mission: [],
  extra: {
    status: Status.DONE,
    start: new Date(),
    end: new Date(),
    duration: 0,
    eventStart: new Date(),
    eventEnd: new Date(),
  },
};

type DateRange = {
  startDate: Date;
  endDate: Date;
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function PlanningPage() {
  const { snackbarValues, setSnackbarValues } = useSnack();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [missions, setMissions] = useState<Array<IMission> | null | undefined>(
    null,
  );
  const [allNurses, setAllNurses] = useState<Array<Nurse>>([]);
  const [visits, setVisits] = useState<
    Map<number, Array<IVisit>> | null | undefined
  >(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [eventList, setEventList] = useState<Event[] | null | undefined>(null);
  const [eventSelected, setEventSelected] =
    useState<SelectedEvent>(initialEvent);
  const [todayEvents, setTodayEvents] = useState<Event[] | null | undefined>(
    null,
  );
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [visitReports, setVisitReports] = useState<Array<IReportVisit>>([]);
  const [visitNurses, setVisitNurses] = useState<Array<Nurse>>([]);
  const [formValues, setFormValues] = useState<{
    start: Date;
    end: Date;
    nurses: Array<Nurse>;
  }>({
    start: new Date(),
    end: new Date(),
    nurses: [],
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpenDialogForm = () => {
    setOpenDialogForm(true);
  };

  const handleCloseDialogForm = () => {
    setOpenDialogForm(false);
    setFormValues({ start: new Date(), end: new Date(), nurses: [] });
    setVisitNurses([]);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const businessHours = [
    {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: "08:00",
      endTime: "18:00",
    },
    {
      daysOfWeek: [6, 0],
      startTime: "10:00",
      endTime: "16:00",
    },
  ];

  const loadAllMissions = async () => {
    let total: number | undefined;
    await getAllMissions(1, 1).then((value) => (total = value?.total));
    if (total) {
      await getAllMissions(1, total).then(async (value) => {
        let visitList: Array<IVisit>;
        await getAllVisits(1, 1).then((value) => (total = value?.total));
        if (total) {
          await getAllVisits(1, total).then((value) => {
            if (value) {
              visitList = value.data;
            }
          });
        }
        const missionIds: number[] = [];
        const visitMap: Map<number, Array<IVisit>> = new Map<
          number,
          Array<IVisit>
        >();
        value?.data.map((m) => {
          missionIds.push(m.id);
        });
        missionIds.forEach((id) => {
          visitMap.set(
            id,
            visitList.filter((v) => v.id_mission == id),
          );
        });
        const nurses: Nurse[] = [];
        await getAllNurses(1, 1).then((value) => (total = value?.total));
        if (total) {
          await getAllNurses(1, total).then((value) => {
            if (value) {
              value.data.map((n) => {
                if (n.id) {
                  nurses.push({ name: n.fname + " " + n.lname, value: n.id });
                }
              });
            }
          });
        }
        setAllNurses(nurses);
        setVisits(visitMap);
        setMissions(value?.data);
      });
    }
  };

  const getStatusEvent = useCallback(
    (mission_id: number, mission_start: Date, mission_end: Date) => {
      const visitRelated: Array<IVisit> | undefined = visits
        ?.get(mission_id)
        ?.filter(
          (v) =>
            new Date(v.start).getTime() >= mission_start.getTime() &&
            new Date(v.start).getTime() <= mission_end.getTime(),
        );
      if (visitRelated && visitRelated.length > 0) {
        if (mission_start.getTime() > new Date().getTime()) {
          return {
            status: Status.AFFECTED,
            idVisit: visitRelated[0].id,
            editable: true,
          };
        } else {
          return {
            status: Status.DONE,
            idVisit: visitRelated[0].id,
            editable: false,
          };
        }
      } else {
        if (mission_start.getTime() > new Date().getTime()) {
          return { status: Status.PENDING, editable: true };
        } else {
          return { status: Status.MISSED, editable: false };
        }
      }
    },
    [visits],
  );

  const getInfoVisit = useCallback(
    (idMission: number, idVisit: number) => {
      const visitRelated = visits
        ?.get(idMission)
        ?.filter((v) => v.id == idVisit)[0];
      return visitRelated;
    },
    [visits],
  );

  const loadTodayEvent = useCallback(() => {
    if (todayEvents == null && eventList) {
      const events: Event[] = [];
      const currentDate = new Date();
      currentDate.setHours(0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      eventList.forEach((e) => {
        const eventStart = new Date(
          e.start.replace(/T.*$/, "T00:00:00"),
        ).getTime();
        const eventEnd = new Date(e.end.replace(/T.*$/, "T00:00:00")).getTime();
        if (
          eventStart == currentDate.getTime() ||
          (eventStart < currentDate.getTime() &&
            eventEnd >= currentDate.getTime())
        ) {
          events.push(e);
        }
      });
      setTodayEvents(events);
    }
  }, [eventList, todayEvents]);

  const loadEvents = useCallback(() => {
    if (missions) {
      const events: Event[] = [];
      missions.forEach((mission) => {
        const missionStart = new Date(mission.start).getTime();
        const missionEnd = new Date(mission.end).getTime();
        const duration = missionEnd - missionStart;
        if (!mission.recurrence_days) {
          if (
            missionStart <= dateRange.endDate.getTime() &&
            (missionStart >= dateRange.startDate.getTime() ||
              missionEnd >= dateRange.startDate.getTime())
          ) {
            const status = getStatusEvent(
              mission.id,
              new Date(mission.start),
              new Date(mission.end),
            );

            let start = mission.start;
            let end = mission.end;

            if (status.idVisit) {
              const visit = getInfoVisit(mission.id, status.idVisit);
              if (visit) {
                start = new Date(visit.start).toISOString();
                end = new Date(visit.end).toISOString();
              }
            }

            const event: Event = {
              id: events.length + 1,
              title: mission.mission_type.name,
              start: start,
              end: end,
              backgroundColor: getColorForStatus(status.status),
              borderColor: getColorForStatus(status.status),
              extendedProps: {
                patient: `${mission.patient.fname} ${mission.patient.lname}`,
                duration: `${mission.minutes_duration} min`,
                idMission: mission.id,
                visitStatus: status,
                eventStart: mission.start,
                eventEnd: mission.end,
              },
            };
            events.push(event);
          }
        } else {
          if (missionStart < dateRange.startDate.getTime()) {
            const diff =
              Math.floor(
                (dateRange.startDate.getTime() - missionStart) / 86400000,
              ) + 1;
            const repetition = Math.floor(42 / mission.recurrence_days);
            const startHour =
              new Date(mission.start).getHours() * 3600000 +
              new Date(mission.start).getMinutes() * 60000 +
              new Date(mission.start).getSeconds() * 1000;
            let nextEvent =
              dateRange.startDate.getTime() -
              (diff % mission.recurrence_days) * 86400000 +
              startHour;

            for (let i: number = 1; i <= repetition; i++) {
              if (
                new Date(nextEvent) >= dateRange.startDate &&
                new Date(nextEvent) < dateRange.endDate
              ) {
                const status = getStatusEvent(
                  mission.id,
                  new Date(nextEvent),
                  new Date(nextEvent + duration),
                );

                let start = new Date(nextEvent).toISOString();
                let end = new Date(nextEvent + duration).toISOString();

                if (status.idVisit) {
                  const visit = getInfoVisit(mission.id, status.idVisit);
                  if (visit) {
                    start = new Date(visit.start).toISOString();
                    end = new Date(visit.end).toISOString();
                  }
                }

                const event: Event = {
                  id: events.length + 1,
                  title: mission.mission_type.name,
                  start: start,
                  end: end,
                  backgroundColor: getColorForStatus(status.status),
                  borderColor: getColorForStatus(status.status),
                  extendedProps: {
                    patient: `${mission.patient.fname} ${mission.patient.lname}`,
                    duration: `${mission.minutes_duration} min`,
                    idMission: mission.id,
                    visitStatus: status,
                    eventStart: new Date(nextEvent).toISOString(),
                    eventEnd: new Date(nextEvent + duration).toISOString(),
                  },
                };
                events.push(event);
              }
              nextEvent = nextEvent + mission.recurrence_days * 86400000;
            }
          } else {
            if (new Date(mission.start) < dateRange.endDate) {
              const diff = Math.floor(
                (dateRange.endDate.getTime() - missionStart) / 86400000,
              );
              const repetition = Math.floor(diff / mission.recurrence_days) + 1;
              let nextEvent = missionStart;
              for (let i: number = 1; i <= repetition; i++) {
                if (
                  nextEvent >= dateRange.startDate.getTime() &&
                  nextEvent < dateRange.endDate.getTime()
                ) {
                  const status = getStatusEvent(
                    mission.id,
                    new Date(nextEvent),
                    new Date(nextEvent + duration),
                  );

                  let start = new Date(nextEvent).toISOString();
                  let end = new Date(nextEvent + duration).toISOString();

                  if (status.idVisit) {
                    const visit = getInfoVisit(mission.id, status.idVisit);
                    if (visit) {
                      start = new Date(visit.start).toISOString();
                      end = new Date(visit.end).toISOString();
                    }
                  }

                  const event: Event = {
                    id: events.length + 1,
                    title: mission.mission_type.name,
                    start: start,
                    end: end,
                    backgroundColor: getColorForStatus(status.status),
                    borderColor: getColorForStatus(status.status),
                    extendedProps: {
                      patient: `${mission.patient.fname} ${mission.patient.lname}`,
                      duration: `${mission.minutes_duration} min`,
                      idMission: mission.id,
                      visitStatus: status,
                      eventStart: new Date(nextEvent).toISOString(),
                      eventEnd: new Date(nextEvent + duration).toISOString(),
                    },
                  };
                  events.push(event);
                }
                nextEvent = nextEvent + mission.recurrence_days * 86400000;
              }
            }
          }
        }
      });
      setEventList(events);
      loadTodayEvent();
    }
  }, [
    dateRange.endDate,
    dateRange.startDate,
    getInfoVisit,
    getStatusEvent,
    loadTodayEvent,
    missions,
  ]);

  const changeDatesSet = (dateInfo: DatesSetArg) => {
    const newStartDate = new Date(dateInfo.startStr);
    const newEndDate = new Date(dateInfo.endStr);

    if (
      newStartDate.getTime() !== dateRange.startDate.getTime() ||
      newEndDate.getTime() !== dateRange.endDate.getTime()
    ) {
      setDateRange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  };

  const initialiseForm = async (
    start: Date,
    end: Date,
    idVisit: number | undefined,
  ) => {
    const nurses: Nurse[] = [];
    if (idVisit) {
      await getVisitNurses(idVisit).then((value) => {
        if (value) {
          value.data.map((n) =>
            nurses.push({ name: n.fname + " " + n.lname, value: n.id }),
          );
        }
      });
    }

    setFormValues({
      start: start,
      end: end,
      nurses: nurses,
    });
    setVisitNurses(nurses);
  };

  const getReports = async (id: number) => {
    await getVisitReports(id).then((value) => {
      if (value) {
        setVisitReports(value.data);
      }
    });
  };

  const getNurse = (id: number) => {
    if (visitNurses.length > 0) {
      const nurse = visitNurses.filter((n) => n.value == id)[0];
      return nurse?.name;
    }
    return "";
  };

  const getReport = (id: number) => {
    if (visitReports && visitReports.length > 0) {
      const report = visitReports.filter((v) => v.id_nurse == id)[0];
      return report ? report.report : "Aucun rapport enregistré";
    }
    return "Aucun rapport enregistré";
  };

  const handleEventClick = (eventClickInfo: EventClickArg) => {
    if (
      eventClickInfo.event._def != null &&
      eventClickInfo.event._instance != null &&
      missions &&
      visits
    ) {
      const mission: IMission = missions.filter(
        (m) => m.id == eventClickInfo.event._def.extendedProps.idMission,
      )[0];
      const start = new Date(
        eventClickInfo.event._instance.range.start.getTime() +
          eventClickInfo.event._instance.range.start.getTimezoneOffset() *
            60000,
      );
      const end = new Date(
        eventClickInfo.event._instance.range.end.getTime() +
          eventClickInfo.event._instance.range.end.getTimezoneOffset() * 60000,
      );

      const missionInfos: DetailsArrayItem[] = [
        {
          details: [
            {
              label: "Type",
              value: eventClickInfo.event._def.title,
            },
            {
              label: "Date de début",
              value: formatDate(start.toString()),
            },
            {
              label: "Date de fin",
              value: formatDate(end.toString()),
            },
            {
              label: "Durée",
              value: formatNumberToTime(mission.minutes_duration),
            },
            { label: "Personne requise", value: mission.people_required },
            { label: "Description", value: mission.desc },
          ],
          title: "Détail de la mission",
        },
        {
          details: [
            {
              label: "Nom et prénom ",
              value: mission.patient.lname + " " + mission.patient.fname,
            },
            { label: "Téléphone", value: mission.patient.phone },
            { label: "Adresse", value: formatAddress(mission.patient.address) },
          ],
          title: "Patient",
        },
      ];

      const eventStart = new Date(
        eventClickInfo.event._def.extendedProps.eventStart,
      );
      const eventEnd = new Date(
        eventClickInfo.event._def.extendedProps.eventEnd,
      );

      if (eventClickInfo.event._def.extendedProps.visitStatus.idVisit) {
        getReports(eventClickInfo.event._def.extendedProps.visitStatus.idVisit);
        initialiseForm(
          start,
          end,
          eventClickInfo.event._def.extendedProps.visitStatus.idVisit,
        );
      } else {
        initialiseForm(
          eventStart,
          eventEnd,
          eventClickInfo.event._def.extendedProps.visitStatus.idVisit,
        );
      }

      const sEvent: SelectedEvent = {
        mission: missionInfos,
        extra: {
          status: eventClickInfo.event._def.extendedProps.visitStatus.status,
          start: start,
          end: end,
          duration: mission.minutes_duration,
          eventStart: eventStart,
          eventEnd: eventEnd,
          idVisit: eventClickInfo.event._def.extendedProps.visitStatus.idVisit,
          idMission: mission.id,
        },
      };
      setEventSelected(sEvent);
      handleClickOpenDialogForm();
    }
  };

  const renderSidebar = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Chip label="A faire aujourd'hui" />
        {todayEvents?.map(renderSidebarEvent)}
        {todayEvents?.length == 0 && (
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <EventBusyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Aucune mission prévue" />
            </ListItem>
          </List>
        )}
      </div>
    );
  };

  const saveEvent = async (
    idMission: number | undefined,
    idVisit: number | undefined,
  ) => {
    try {
      let idNewVisit: number;
      if (idVisit) {
        await updateVisit(
          idVisit,
          formatDateToSave(formValues.start),
          formatDateToSave(formValues.end),
        );
        visitNurses.map(async (nurse) => {
          await dissociateNurseVisit(idVisit, nurse.value);
        });
        idNewVisit = idVisit;
      } else {
        if (idMission) {
          const response = await createVisit(
            formatDateToSave(formValues.start),
            formatDateToSave(formValues.end),
            idMission,
          );
          if (response) {
            idNewVisit = response;
          }
        }
      }
      formValues.nurses.map(async (nurse) => {
        await associateVisitNurse(idNewVisit, nurse.value);
      });
      setSnackbarValues((prevState) => ({
        ...prevState,
        isOpen: true,
        severity: "success",
        message: "Operation réussie !",
      }));
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

  useEffect(() => {
    if (!missions) {
      loadAllMissions();
    }
    loadEvents();

  }, [dateRange.startDate, missions]);

  return (
    <div>
      {snackbarValues.isOpen && (
        <div>
          {snackbarValues.severity === "success"}
          {snackbarValues.severity === "error"}
        </div>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={10} md={9}>
            <Paper style={{ padding: "15px" }}>
              <div style={{ textAlign: "right" }}>
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<FileDownloadIcon />}
                >
                  Exporter sous format
                </Button>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} disableRipple>
                    <PictureAsPdfIcon />
                    Pdf
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleClose} disableRipple>
                    <CalendarMonthIcon />
                    GoogleCalendar
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleClose} disableRipple>
                    <InsertDriveFileIcon />
                    Excel
                  </MenuItem>
                </StyledMenu>
              </div>
              <br />
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                locales={[frLocale]}
                locale="fr"
                initialView="dayGridMonth"
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                eventDisplay={"list-items"}
                businessHours={businessHours}
                weekNumbers={true}
                eventContent={renderEventContent}
                datesSet={changeDatesSet}
                droppable={false}
                eventClick={handleEventClick}
                events={eventList as EventSourceInput}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <Paper style={{ padding: "15px" }}>{renderSidebar()}</Paper>
          </Grid>
        </Grid>
        <Dialog
          fullScreen={fullScreen}
          fullWidth={true}
          maxWidth={eventSelected.extra.status == Status.MISSED ? "sm" : "lg"}
          open={openDialogForm && !!eventSelected}
          onClose={handleCloseDialogForm}
          aria-labelledby="assignForm"
          scroll={"paper"}
        >
          <DialogTitle id="assignForm">
            <Chip
              label={"Mission : " + eventSelected.extra.status}
              sx={{
                backgroundColor: getColorForStatus(eventSelected.extra.status),
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
              <Grid
                item
                xs={12}
                md={eventSelected.extra.status == Status.MISSED ? 12 : 6}
              >
                <Paper style={{ padding: "5px" }}>
                  <MissionDetailsComponent mission={eventSelected?.mission} />
                </Paper>
              </Grid>
              {eventSelected.extra.status == Status.DONE && (
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
                              {formatDate(eventSelected.extra.start.toString())}
                            </TableCell>
                          </TableRow>
                          <TableRow key={"endEvent"}>
                            <TableCell align="right" component="th" scope="row">
                              Fin
                            </TableCell>
                            <TableCell align="center">:</TableCell>
                            <TableCell>
                              {formatDate(eventSelected.extra.end.toString())}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          <strong>Intervenants et rapports</strong>
                        </Typography>
                        {visitNurses &&
                          visitNurses.map((n, index) => (
                            <Accordion key={index}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{getNurse(n.value)}</Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                style={{ backgroundColor: grey[50] }}
                              >
                                <Typography>
                                  Rapport : {getReport(n.value)}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                      </Grid>
                    </Paper>
                  </Paper>
                </Grid>
              )}
              {(eventSelected.extra.status == Status.AFFECTED ||
                eventSelected.extra.status == Status.PENDING) && (
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
                                minDateTime={dayjs(
                                  eventSelected.extra.eventStart,
                                )}
                                maxDateTime={dayjs(
                                  new Date(
                                    eventSelected.extra.eventEnd.getTime() -
                                      eventSelected.extra.duration * 60000,
                                  ),
                                )}
                                onChange={(value) =>
                                  setFormValues({
                                    ...formValues,
                                    start: value?.toDate()
                                      ? value?.toDate()
                                      : new Date(),
                                  })
                                }
                                defaultValue={dayjs(eventSelected.extra.start)}
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
                                minDateTime={dayjs(
                                  new Date(
                                    formValues.start.getTime() +
                                      eventSelected.extra.duration * 60000,
                                  ),
                                )}
                                maxDateTime={dayjs(
                                  eventSelected.extra.eventEnd,
                                )}
                                defaultValue={dayjs(eventSelected.extra.end)}
                                onChange={(value) => {
                                  setFormValues({
                                    ...formValues,
                                    end: value?.toDate()
                                      ? value?.toDate()
                                      : new Date(),
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
                                event.preventDefault();
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
            {eventSelected.extra.status != Status.MISSED &&
              eventSelected.extra.status != Status.DONE && (
                <Button
                  onClick={() =>
                    saveEvent(
                      eventSelected.extra.idMission,
                      eventSelected.extra.idVisit,
                    )
                  }
                  autoFocus
                  variant="contained"
                >
                  Enregistrer
                </Button>
              )}
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <i
        style={{
          margin: "5px",
          fontSize: "11px",
        }}
      >
        {eventInfo.event.title + " : " + eventInfo.event.extendedProps.duration}
        <br />
        <strong>{eventInfo.event.extendedProps.patient}</strong>
      </i>
    </>
  );
}

function renderSidebarEvent(event: Event) {
  return (
    <TaskCardComponent
      key={event.id}
      title={event.title}
      start={event.start}
      end={event.end}
      patient={event.extendedProps?.patient}
    />
  );
}
