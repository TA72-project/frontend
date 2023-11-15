import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../../assets/css/mission.css';
import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem, GridToolbar, GridPaginationModel} from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import {deleteMissionType, getAllMissionType} from "../../../requests/missionTypes.ts";
import { useEffect, useState } from "react";

export interface IIdMissionType extends IMissionType {
    id: number;
}

export interface IMissionType {
    name: string,
    people_required: number,
    minutes_duration: number,
}

export default function MissionsPage(){
    const navigate = useNavigate();
    const [missionTypeList, setMissionTypeList] = useState<IIdMissionType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);

    const openEditForm = (id : number) => {
        navigate('/mission_type_form/' + id);
    };

    const fetchMissionTypes = async (currentPage: number, pageSize: number) => {
        try {
            const response = await getAllMissionType(currentPage, pageSize);
            const typedResponse: {data: Array<IIdMissionType>, page: number, per_page: number, total: number, total_page: number} | null = response as {data: Array<IIdMissionType>, page: number, per_page: number, total: number, total_page: number} | null;
            if(typedResponse){
                setMissionTypeList(typedResponse.data);
                setRowCount(typedResponse.total);
            }
        } catch(error) {
            console.error('Erreur lors de la récupération des types de mission', error);
        }
    };

    const handleDeleteMissionType = async (id: number) => {
        try {
            await deleteMissionType(id);
            fetchMissionTypes(currentPage,pageSize);
        } catch (error){
            console.error('Erreur lors de la suppression du type de mission', error);
        }
    }

    const columns: GridColDef[] =
    [
        {
            field: 'name',
            headerName: 'Désignation',
            type: 'string',
            flex: 0.25,
        },
        {
            field: 'people_required',
            headerName: 'Nombre de personne requise',
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            flex: 0.25,
        },
        {
            field: 'minutes_duration',
            headerName: 'Durée (Minutes)',
            type: 'number',
            align: 'center',
            headerAlign: 'center',
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
                    icon={<EditIcon color="primary" />}
                    label="Editer"
                    onClick={() => openEditForm(params.row.id)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Supprimer"
                    onClick={() => handleDeleteMissionType(params.row.id)}
                />
            ]
        },
    ];

    useEffect(() => {
        fetchMissionTypes(currentPage, pageSize)
    }, [currentPage, pageSize]);

    const handlePaginationChanges = (params:GridPaginationModel) => {
        setCurrentPage(params.page + 1);
        setPageSize(params.pageSize);
    };

    return(
        <Box textAlign="center">
            <Button
                variant="contained"
                color="success"
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
        </Box>
    );
}

