import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../assets/css/mission.css';
import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem, GridToolbar, GridPaginationModel} from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { Button, Paper } from "@mui/material";
import { deleteMissionType, getAllMissionType } from "../../hook/missionType";
import { useEffect, useState } from "react";
import { MissionType } from "../../type/model";
import Swal from 'sweetalert2'

export default function MissionsPage(){
    const navigate = useNavigate();
    const [missionTypeList, setMissionTypeList] = useState<MissionType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);

    const openEditForm = (id : number) => {
        navigate('/mission_type_form/' + id);
    };

    const openDeleteConfirmation = (id: number) => {
        const swalWithBootstrapButtons = Swal.mixin({
            toast: true,
        });
        swalWithBootstrapButtons.fire({
            title: "Etes-vous sûr de vouloir supprimer ?",
            text: "Cette action est irrévocable !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Valider",
            cancelButtonText: "Annuler",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteMissionType(id);
                if(res == 200) {
                    swalWithBootstrapButtons.fire({
                        title: "Opération réussie",
                        text: "L'enregistrement a été supprimé",
                        icon: "success",
                        timer: 1000
                    });
                    listMission(currentPage, pageSize);
                }                
            } 
            else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Annulation",
                    text: "Votre action a été annulée",
                    icon: "error",
                    timer: 1000
                });
            }
        });
    };
      
    const columns: GridColDef[] =
    [
        {
            field: 'name',
            headerName: 'Désignation',
            type: 'string',
            flex: 0.25,
        },
        {
            field: 'peopleRequired',
            headerName: 'Nombre de personne requise',
            type: 'number',
            flex: 0.25,
        },
        {
            field: 'minutesDuration',
            headerName: 'Durée (Minute)',
            type: 'number',
            headerAlign: 'right',
            flex: 0.25,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            disableExport: true,
            headerAlign: 'center',
            flex: 0.25,
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<EditIcon/>}
                    label="Editer"
                    onClick={() => openEditForm(params.row.id)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon/>}
                    label="Supprimer"
                    onClick={() => openDeleteConfirmation(params.row.id)}
                />
            ]
        },
    ];

    const listMission = async (page: number, perPage: number): Promise<void> => {
        const result = await getAllMissionType(page, perPage);
        setMissionTypeList(result.data);
        setRowCount(result.total);
    };

    useEffect(() => {
        listMission(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handlePaginationChanges = (params:GridPaginationModel) => {
        setCurrentPage(params.page + 1);
        setPageSize(params.pageSize);
    };

    return(
        <div>
            <Paper style={{boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px'}}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{m:2}}
                    onClick={() => navigate('/mission_type_form')}>
                    Nouveau type
                </Button>
                <DataGrid 
                    style={{border: 'none'}}
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
                    rows={missionTypeList}
                    rowCount={rowCount}
                    columns={columns}
                    onPaginationModelChange={handlePaginationChanges}
                />
            </Paper>
        </div>
    );
}

