import EditIcon from '@mui/icons-material/Edit';
import '../../assets/css/mission.css';
import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem, GridToolbar, GridPaginationModel} from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { Button, Paper } from "@mui/material";
import { getAllMissionType } from "../../hook/missionType";
import { useEffect, useState } from "react";
import { MissionType } from "../../type/model";

export default function MissionsPage(){
    const navigate = useNavigate();
    const [missionTypeList, setMissionTypeList] = useState<MissionType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const openEditForm = (id : number) => {
        navigate('/mission_type_form/' + id);
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
                    label="Edit"
                    onClick={() => openEditForm(params.row.id)}
                />,
            ]
        },
    ];

    const listMission = async (page: number, perPage: number): Promise<void> => {
        const result = await getAllMissionType(page, perPage);
        setMissionTypeList(result);
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
                    columns={columns}
                    onPaginationModelChange={handlePaginationChanges}
                />
            </Paper>
        </div>
    );
}

