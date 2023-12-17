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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserType } from "../../datas/enums.tsx";
import { createManager, deleteManager, getAllManagers, udpdateManager } from "../../requests/managers.ts";
import { INurse, IPatient, IManager, ISkill,} from "../../utils/interfaces.ts";
import { createNurse, deleteNurse, getAllNurses, updateNurse } from "../../requests/nurses.ts";
import { createPatient, deletePatient, getAllPatients, updatePatient } from "../../requests/patients.ts";
import { formatAddress, formatNumberToTime, generateRandomString } from "../../utils/formatUtils.ts";
import { getAllCenters, getCenter } from "../../requests/centers.ts";
import { useSnack } from "../../context/snackbar/snackbarContext.ts";
import { getAllZones, getZone } from "../../requests/zones.ts";

interface ISelectField {
  name: string;
  value: number;
}

export default function UsersPage() {
  const { snackbarValues, setSnackbarValues } = useSnack();
  const columns: GridColDef[] = [
    {
      field: "fname",
      headerName: "Prénom",
      valueGetter: (params) => {
        return `${params.row.fname || ""}`;
      },
      type: "string",
      flex: 0.15,
    },
    {
      field: "lname",
      headerName: "Nom",
      valueGetter: (params) => {
        return `${params.row.lname || ""}`;
      },
      valueFormatter(params) {
        return params.value.toUpperCase();
      },
      type: "string",
      flex: 0.15,
    },
    {
      field: "mail",
      headerName: "Mail",
      type: "string",
      flex: 0.25,
    },
    {
      field: "phone",
      headerName: "Téléphone",
      valueGetter: (params) => {
        return `${params.row.phone || ""}`;
      },
      type: "string",
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
  const [userType, setUserType] = useState(UserType.MANAGER);
  const [userList, setUserList] = useState<IManager[] | IPatient[] | INurse[]>(
    [],
  );
  const [centerList, setCenterList] = useState<ISelectField[]>([]);
  const [zoneList, setZoneList] = useState<ISelectField[]>([]);
  const [columnList, setColumnList] = useState<GridColDef[]>(columns);
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idUserToDelete, setIdUserToDelete] = useState<number>();
  const [formValues, setFormValues] = useState<{
    id_user?: number;
    fname: string;
    lname: string;
    mail: string;
    phone: string;
    minutes_per_week?: number;
    skills?: ISkill[];
    id_address?: number;
    number?: number;
    street_name?: string;
    postcode?: string;
    city_name?: string;
    complement?: string;
    id_zone?: number;
    id_center?: number;
  }>({
    id_user: 0,
    fname: "",
    lname: "",
    mail: "",
    phone: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const initialiseForm = async (userCopy: INurse | IPatient | IManager) => {
    switch (userType) {
      case UserType.MANAGER:{
        const manager = userCopy as IManager;
        setFormValues({
          id_user: manager.id_user,
          fname: manager.fname,
          lname: manager.lname,
          mail: manager.mail,
          phone: manager.phone,
          id_center: manager.id_center,
        });
        break;
      }
      case UserType.NURSE:{
        const nurse = userCopy as INurse;
        const zoneNurse = await getZone(nurse.address.id_zone);
        if (zoneNurse) {
          const rep = await getCenter(zoneNurse.id_center);
          if (rep) {
            setFormValues({
              id_user: nurse.id_user,
              id_center: rep.id,
              fname: nurse.fname,
              lname: nurse.lname,
              mail: nurse.mail,
              phone: nurse.phone,
              id_address: nurse.id_address,
              number: nurse.address.number,
              street_name: nurse.address.street_name,
              postcode: nurse.address.postcode,
              city_name: nurse.address.city_name,
              complement: nurse.address.complement,
              id_zone: nurse.address.id_zone,
              minutes_per_week: nurse.minutes_per_week,
              skills: nurse.skills,
            });
          }
        }        
        break;
      }
      case UserType.PATIENT:{
        const patient = userCopy as IPatient;
        const zonePatient = await getZone(patient.address.id_zone);
        if (zonePatient) {
          const rep = await getCenter(zonePatient.id_center);
          if (rep) {
            setFormValues({
              id_user: patient.id_user,
              id_center: rep.id,
              fname: patient.fname,
              lname: patient.lname,
              mail: patient.mail,
              phone: patient.phone,
              id_address: patient.id_address,
              number: patient.address.number,
              street_name: patient.address.street_name,
              postcode: patient.address.postcode,
              city_name: patient.address.city_name,
              complement: patient.address.complement,
              id_zone: patient.address.id_zone,
            });
          }
        }
        break;
      }
    }
  };

  const openEditForm = (userCopy: INurse | IPatient | IManager) => {
    initialiseForm(userCopy);
    handleOpenDialogForm();
  };

  const openDeleteForm = (id: number) => {
    setIdUserToDelete(id);
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
  }

  const fetchUsers = async (currentPage: number, pageSize: number) => {
    try {
      let response;
      columns.pop();
      loadCenters();
      switch (userType) {
        case UserType.MANAGER:
          response = await getAllManagers(currentPage, pageSize);
          break;
        case UserType.NURSE:
          response = await getAllNurses(currentPage, pageSize);
          columns.push({
            field: "address",
            headerName: "Adresse",
            type: "string",
            valueGetter: (params) => {
              return params.row.address;
            },
            valueFormatter: (params) => {
              return `${formatAddress(params.value)}`;
            },
            flex: 0.2,
          });
          columns.push({
            field: "minutes_per_week",
            headerName: "Heure par semaine",
            type: "string",
            valueFormatter: (params) => {
              return `${formatNumberToTime(params.value)}`;
            },
            flex: 0.1,
          });
          break;
        case UserType.PATIENT:
          response = await getAllPatients(currentPage, pageSize);
          columns.push({
            field: "address",
            headerName: "Adresse",
            type: "string",
            valueGetter: (params) => {
              return params.row.address;
            },
            valueFormatter: (params) => {
              return `${formatAddress(params.value)}`;
            },
            flex: 0.3,
          });
          break;
      }
      if (response) {
        columns.push({
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
              onClick={() => openEditForm(params.row)}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon color="error" />}
              label="Supprimer"
              onClick={() => openDeleteForm(params.row.id)}
            />,
          ],
        });
        setColumnList(columns);
        setUserList(response.data);
        setRowCount(response.total);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  const handleUserTypeChange = (event: SelectChangeEvent) => {
    setUserType(event.target.value as UserType);
  };

  const getZonesFromIdCenter = async (idCenter: number) => {
    let total: number | undefined;
    const zones: ISelectField[] = [];
    await getAllZones(idCenter, 1, 1).then((value) => (total = value?.total));
    if (total) {
      await getAllZones(idCenter, 1, total).then((value) => {
        if (value) {
          value.data.map((zone) =>
            zones.push({
              name: zone.name,
              value: zone.id,
            }),
          );
        }
      });
    }
    if (zones.length > 0) {
      setFormValues({ ...formValues, id_zone: zones[0].value });
    } else {
      setFormValues({ ...formValues, id_zone: undefined });
    }
    setZoneList(zones);
  };

  const handleDeleteUser = async () => {
    try {
      if (idUserToDelete != null) {
        switch(userType) {
          case UserType.MANAGER:
            await deleteManager(idUserToDelete);
          break;
          case UserType.NURSE:
            await deleteNurse(idUserToDelete);
          break;
          case UserType.PATIENT:
            await deletePatient(idUserToDelete);
          break;
        }
        setSuccess();
      }
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
    handleCloseDelete();
  };

  const handleOpenDialogForm = () => {
    setOpenDialogForm(true);
  };

  const handleCloseDialogForm = () => {
    setFormValues({
      id_user: 0,
      fname: "",
      lname: "",
      mail: "",
      phone: "",
    });
    setOpenDialogForm(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
    if (
      formValues.id_center &&
      (userType == UserType.NURSE || userType == UserType.PATIENT)
    ) {
      getZonesFromIdCenter(formValues.id_center);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, userType, formValues.id_center]);

  const handlePaginationChanges = (params: GridPaginationModel) => {
    setCurrentPage(params.page + 1);
    setPageSize(params.pageSize);
  };

  const setSuccess = () => {
    setSnackbarValues((prevState) => ({
      ...prevState,
      isOpen: true,
      severity: "success",
      message: "Operation réussie !",
    }));
    fetchUsers(currentPage, pageSize);
    handleCloseDialogForm();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let address;
    if (formValues.id_zone) {
      address = {
        number: formValues.number ? formValues.number : 0,
        street_name: formValues.street_name ? formValues.street_name : "",
        postcode: formValues.postcode ? formValues.postcode : "",
        city_name: formValues.city_name ? formValues.city_name : "",
        complement: formValues.complement ? formValues.complement : "",
        id_zone: formValues.id_zone,
      };
    }
    switch (userType) {
      case UserType.MANAGER:
        try {
          if (formValues.id_user && formValues.id_center) {
            await udpdateManager({
              id_user: formValues.id_user,
              id_center: formValues.id_center,
              fname: formValues.fname,
              lname: formValues.lname,
              mail: formValues.mail,
              phone: formValues.phone,
            });
          } else {
            if (formValues.id_center) {
              await createManager({
                id_center: formValues.id_center,
                fname: formValues.fname,
                lname: formValues.lname,
                mail: formValues.mail,
                phone: formValues.phone,
                password: generateRandomString(),
              });
            }
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
        break;
      case UserType.NURSE:
        try {
          if (formValues.id_user && formValues.id_address && address) {
            await updateNurse({
              minutes_per_week: formValues.minutes_per_week as number,
              fname: formValues.fname,
              lname: formValues.lname,
              mail: formValues.mail,
              phone: formValues.phone,
              id_address: formValues.id_address,
              id_user: formValues.id_user,
              address: address,
            });
          } else {
            if (formValues.minutes_per_week && address) {
              await createNurse({
                minutes_per_week: formValues.minutes_per_week,
                fname: formValues.fname,
                lname: formValues.lname,
                mail: formValues.mail,
                phone: formValues.phone,
                password: generateRandomString(),
                address: address,
              });
            }
          }
          setSuccess();
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de la compétence",
            error,
          );
          setSnackbarValues((prevState) => ({
            ...prevState,
            isOpen: true,
            severity: "error",
            message:
              "Une erreur est survenue. Veuillez contacter le service technique.",
          }));
        }
        break;
      case UserType.PATIENT:
        try {
          if (formValues.id_user && address) {
            await updatePatient({
              fname: formValues.fname,
              lname: formValues.lname,
              mail: formValues.mail,
              phone: formValues.phone,
              id_user: formValues.id_user,
              id_address: formValues.id_address,
              address: address,
            });
          } else {
            if (address) {
              await createPatient({
                fname: formValues.fname,
                lname: formValues.lname,
                mail: formValues.mail,
                phone: formValues.phone,
                address: address,
              });
            }
          }
          setSuccess();
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de la compétence",
            error,
          );
          setSnackbarValues((prevState) => ({
            ...prevState,
            isOpen: true,
            severity: "error",
            message:
              "Une erreur est survenue. Veuillez contacter le service technique.",
          }));
        }
        break;
    }
    handleCloseDialogForm()
  };

  return (
    <Box>
      {snackbarValues.isOpen && (
        <div>
          {snackbarValues.severity === "success"}
          {snackbarValues.severity === "error"}
        </div>
      )}
      <FormControl style={{ minWidth: "250px" }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={userType}
          label="Catégorie"
          onChange={handleUserTypeChange}
        >
          {Object.values(UserType).map((value, index) => (
            <MenuItem key={"userType" + index} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="success"
        sx={{ m: 2 }}
        onClick={() => handleOpenDialogForm()}
      >
        {userType == UserType.MANAGER && "Nouveau manager"}
        {userType == UserType.PATIENT && "Nouveau patient"}
        {userType == UserType.NURSE && "Nouvel infirmier"}
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
        rows={userList}
        rowCount={rowCount}
        columns={columnList}
        onPaginationModelChange={handlePaginationChanges}
      />
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={openDialogForm}
        onClose={handleCloseDialogForm}
        aria-labelledby="form"
        scroll="paper"
      >
        <DialogTitle id="form">
          {"Formulaire de "}
          {formValues.fname != "" ? "modification" : "création"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers={true}>
            <Grid container spacing={1}>
              {centerList.length > 0 && (
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Centre"
                    required
                    fullWidth
                    value={formValues.id_center ? formValues.id_center : ""}
                    onChange={e => (setFormValues({
                      ...formValues,
                      id_center: parseInt(e.target.value),
                    }))}
                  >
                    {centerList.map((option) => (
                      <MenuItem
                        key={"Center" + option.value}
                        value={option.value}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {(userType == UserType.NURSE || userType == UserType.PATIENT) && (
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Zone"
                    required
                    fullWidth
                    value={formValues.id_zone ? formValues.id_zone : ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        id_zone: parseInt(e.target.value) as number,
                      })
                    }
                  >
                    {zoneList.map((option) => (
                      <MenuItem
                        key={"Zone" + option.value}
                        value={option.value}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label="Prénom"
                  name="fname"
                  type="text"
                  fullWidth
                  value={formValues.fname}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      fname: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nom"
                  name="lname"
                  type="text"
                  fullWidth
                  value={formValues.lname}
                  required
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      lname: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Adresse e-mail"
                  name="mail"
                  type="email"
                  fullWidth
                  value={formValues.mail}
                  required
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      mail: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Téléphone"
                  name="phone"
                  type="text"
                  fullWidth
                  value={formValues.phone}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      phone: e.target.value,
                    })
                  }
                />
              </Grid>
              {userType == UserType.NURSE && (
                <Grid item xs={12}>
                  <TextField
                    label="Minutes par semaine"
                    name="minutes_per_week"
                    type="number"
                    required
                    fullWidth
                    value={formValues.minutes_per_week}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        minutes_per_week: parseInt(e.target.value),
                      })
                    }
                    helperText="Tip : 2100 => 35h, 1200 => 20h, etc"
                    InputProps={{ inputProps: { min: 0, max: 10080, step: 5 } }}
                  />
                </Grid>
              )}

              {(userType == UserType.NURSE || userType == UserType.PATIENT) && (
                <>
                  <Grid item xs={4} md={3}>
                    <TextField
                      label="Numéro"
                      name="numero"
                      type="number"
                      required
                      fullWidth
                      value={formValues.number || 0}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          number: parseInt(e.target.value),
                        })
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <TextField
                      label="rue"
                      name="street_name"
                      type="text"
                      required
                      fullWidth
                      value={formValues.street_name}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          street_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={4} md={3}>
                    <TextField
                      label="Code postal"
                      name="postcode"
                      type="text"
                      required
                      fullWidth
                      value={formValues.postcode}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          postcode: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <TextField
                      label="ville"
                      name="city_name"
                      type="text"
                      required
                      fullWidth
                      value={formValues.city_name}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          city_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Complément"
                      name="complement"
                      type="text"
                      fullWidth
                      value={formValues.complement}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          complement: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </>
              )}
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
        <DialogTitle>Supprimer un utilisateur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Etes-vous sûr de vouloir supprimer cet utilisateur ? <br />
            Cette action est irréversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Annuler</Button>
          <Button onClick={() => handleDeleteUser()} autoFocus>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
