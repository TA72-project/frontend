import '../../../assets/css/mission.css';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridColumnGroupingModel, GridPaginationModel,
    GridRowParams,
    GridToolbar
} from '@mui/x-data-grid';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {deleteMission, getAllMissions} from "../../../requests/missions.ts";
import {useEffect, useState} from "react";
import {formatAddress, formatDate} from "../../../utils/formatUtils.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

interface IMissionPageProps {
    rows: Array<object> | null | undefined;
    paginationStates: {
        page: number,
        perPage: number,
    }
}

export default function MissionsPage() {

    const [missionsPageStates, setMissionsPageStates] = useState<IMissionPageProps>({
        rows: [],
        paginationStates: {
            page: 1,
            perPage: 5,
        },
    });

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal((prevState) => !prevState);

    const handleDeleteMission = async (id: number) => {
        try {
            await deleteMission(id);
            getAllMissions(missionsPageStates.paginationStates.page, missionsPageStates.paginationStates.perPage).then((value) => setMissionsPageStates((prevState) => ({
                ...prevState,
                rows: value?.data
            })));
        } catch (error) {
            console.error('Erreur lors de la suppression du type de mission', error);
        }
    }

    useEffect(() => {
        getAllMissions(missionsPageStates.paginationStates.page, missionsPageStates.paginationStates.perPage).then((value) => setMissionsPageStates((prevState) => ({
            ...prevState,
            rows: value?.data
        })));
    }, [missionsPageStates.paginationStates]);

    const columns: GridColDef[] =
        [
            {
                field: 'type',
                headerName: 'Type',
                type: 'string',
                valueGetter: (params) => params.row.mission_type.name,
                flex: 0.06,
            },
            {
                field: 'desc',
                headerName: 'Description',
                type: 'string',
                flex: 0.12,
            },
            {
                field: 'start',
                headerName: 'Début',
                headerAlign: 'center',
                align: 'center',
                renderCell: (params) => {
                    const startValue = params.value as string;
                    const formattedDateTime = formatDate(startValue);
                    return <p style={{whiteSpace: 'pre-line', textAlign: 'center'}}>{formattedDateTime}</p>;
                },
                flex: 0.1,
            },
            {
                field: 'end',
                headerName: 'Fin',
                headerAlign: 'center',
                align: 'center',
                renderCell: (params) => {
                    const startValue = params.value as string;
                    const formattedDateTime = formatDate(startValue);
                    return <p style={{whiteSpace: 'pre-line', textAlign: 'center'}}>{formattedDateTime}</p>;
                },
                flex: 0.1,
            },
            {
                field: 'people_required',
                headerName: 'Intervenant',
                type: 'number',
                headerAlign: 'left',
                align: 'left',
                flex: 0.05,
            },
            {
                field: 'fname',
                valueGetter: (params) => params.row.patient.fname,
                headerName: 'Prénom',
                type: 'string',
                flex: 0.06,
            },
            {
                field: 'lname',
                valueGetter: (params) => params.row.patient.lname,
                headerName: 'Nom',
                type: 'string',
                flex: 0.06,
            },
            {
                type: 'string',
                field: 'address',
                headerName: 'Adresse',
                valueGetter: (params) => formatAddress(params.row.patient.address),
                flex: 0.10,
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                disableExport: true,
                headerAlign: 'center',
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        icon={<EditIcon color="primary"/>}
                        label="Editer"
                        onClick={handleOpenModal}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon color="error"/>}
                        label="Supprimer"
                        onClick={() => handleDeleteMission(params.row.id)}
                    />
                ]
            },
        ];

    const columnGroupingModel: GridColumnGroupingModel =
        [
            {
                groupId: 'Mission',
                headerAlign: 'center',
                children: [
                    {field: 'type'},
                    {field: 'desc'},
                    {field: 'start'},
                    {field: 'end'},
                    {field: 'people_required'},
                ],
            },
            {
                groupId: 'Patient',
                headerAlign: 'center',
                children: [
                    {field: 'fname'},
                    {field: 'lname'},
                    {field: 'phone'},
                    {field: 'address'},
                ],
            }
        ];

    return (
        <Box textAlign="center">
            <Button
                variant="contained"
                color="success"
                sx={{m: 2}}
                onClick={handleOpenModal}>
                Nouvelle mission
            </Button>
            <DataGrid
                style={{border: 'none'}}
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={{
                    pagination: {paginationModel: {pageSize: 5}},
                }}
                density="standard"
                pageSizeOptions={[5, 10, 25]}
                autoHeight
                rows={missionsPageStates.rows ?? []}
                columns={columns}
                columnGroupingModel={columnGroupingModel}
                experimentalFeatures={{columnGrouping: true}}
                getRowId={(row) => row.id}
                onPaginationModelChange={(params: GridPaginationModel) => setMissionsPageStates((prevState) => ({
                    ...prevState,
                    paginationStates: {...prevState.paginationStates, page: params.page + 1, perPage: params.pageSize}
                }))}
            />
            <Dialog
                onClose={handleOpenModal}
                open={openModal}
            >
                <DialogTitle>
                    Créer ou modifier une mission
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions sx={{justifyContent: 'center'}}>
                    <IconButton
                        onClick={handleOpenModal}
                    >
                        <CloseIcon
                            color="error"
                        />
                    </IconButton>
                    <IconButton
                        onClick={handleOpenModal}
                    >
                        <SaveIcon
                            color="success"
                        />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

