import EditIcon from '@mui/icons-material/Edit';
import '../../assets/css/mission.css';
import { DataGrid, GridRowsProp, GridColDef, GridValueFormatterParams, GridRowParams, GridActionsCellItem, GridToolbar, GridColumnGroupingModel} from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";

export default function MissionsPage(){
    const navigate = useNavigate();

    const openEditForm = (id : number) => {
        navigate('/detail_mission/' + id);
    };

    const rows: GridRowsProp =
    [
        {
            id: 1,
            type: 'Type 1',
            desc: 'Description 1',
            start: '2023-10-15',
            end: '2023-10-20',
            people_required: 3,
            fname: 'John',
            lname: 'Doe',
            phone: '123-456-7890',
            address: '123 Main St',
            'visits.start': '2023-10-15',
            'visits.end': '2023-10-18',
            report: 'Report 1',
        },
        {
            id: 2,
            type: 'Type 2',
            desc: 'Description 2',
            start: '2023-11-01',
            end: '2023-11-10',
            people_required: 5,
            fname: 'Jane',
            lname: 'Smith',
            phone: '987-654-3210',
            address: '456 Elm St',
            'visits.start': '2023-11-01',
            'visits.end': '2023-11-05',
            report: 'Report 2',
        },
        {
            id: 3,
            type: 'Type 3',
            desc: 'Description 3',
            start: '2023-12-05',
            end: '2023-12-15',
            people_required: 2,
            fname: 'Alice',
            lname: 'Johnson',
            phone: '555-123-4567',
            address: '789 Oak St',
            'visits.start': '2023-12-05',
            'visits.end': '2023-12-10',
            report: 'Report 3',
        },
        {
            id: 4,
            type: 'Type 4',
            desc: 'Description 4',
            start: '2024-01-10',
            end: '2024-01-20',
            people_required: 4,
            fname: 'Bob',
            lname: 'Williams',
            phone: '333-555-7777',
            address: '101 Pine St',
            'visits.start': '2024-01-10',
            'visits.end': '2024-01-15',
            report: 'Report 4',
        },
        {
            id: 5,
            type: 'Type 5',
            desc: 'Description 5',
            start: '2024-02-15',
            end: '2024-02-25',
            people_required: 3,
            fname: 'Eva',
            lname: 'Brown',
            phone: '777-888-9999',
            address: '222 Cedar St',
            'visits.start': '2024-02-15',
            'visits.end': '2024-02-20',
            report: 'Report 5',
        },
    ];
      
    const columns: GridColDef[] =
    [
        {
            field: 'type',
            headerName: 'Type',
            type: 'string',
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
            type: 'date',
            headerAlign: 'center',
            valueGetter: (params) => {
                if (!params.value) {
                    return null;
                }
                return new Date(params.value);
            },
            flex: 0.05,
        },
        {
            field: 'end',
            headerName: 'Fin',
            type: 'date',
            headerAlign: 'center',
            valueGetter: (params) => {
                if (!params.value) {
                    return null;
                }
                return new Date(params.value);
            },
            flex: 0.05,
        },
        {
            field: 'people_required',
            headerName: 'Intervenant',
            type: 'number',
            flex: 0.05,
            headerAlign: 'right',
        },
        {
            field: 'fname',
            headerName: 'Prénom',
            type: 'string',
            flex: 0.06,
        },
        {
            field: 'lname',
            headerName: 'Nom',
            type: 'string',
            flex: 0.06,
        },
        {
            field: 'phone',
            headerName: 'Contact',
            type: 'string',
            flex: 0.05,
        },
        {
            type: 'string',
            field: 'address',
            headerName: 'Adresse',
            valueGetter: (params) => {
                if (!params.value) {
                    return params.value;
                }
                return params.value;
            },
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                if (params.value == null) {
                    return 'None';
                }
                return `${params.value.toLocaleString()} %`;
            },
            flex: 0.10,
        },
        {
            field: 'visits.start',
            headerName: 'Début',
            type: 'date',
            headerAlign: 'center',
            valueGetter: (params) => {
                if (!params.value) {
                    return null;
                }
                return new Date(params.value);
            },
            flex: 0.05,
        },
        {
            field: 'visits.end',
            headerName: 'Fin',
            type: 'date',
            headerAlign: 'center',
            valueGetter: (params) => {
                if (!params.value) {
                    return null;
                }
                return new Date(params.value);
            },
            flex: 0.05,
        },
        {
            field: 'report',
            headerName: 'Rapport',
            type: 'string',
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
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={() => openEditForm(params.row.id)}
                />,
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
        },
        {
            groupId: 'Bilan',
            headerAlign: 'center',
            children: [
                {field: 'visits.start'},
                {field: 'visits.end'},
                {field: 'report'},
            ],
        },
    ];
    
    return(
        <div>
            <Paper style={{boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px'}}>
                <DataGrid 
                    style={{border: 'none'}}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    density="standard"
                    pageSizeOptions={[5, 10, 25]}
                    autoHeight
                    rows={rows}
                    columns={columns}
                    columnGroupingModel={columnGroupingModel}
                    experimentalFeatures={{ columnGrouping: true }}
                />
            </Paper>
        </div>
    );
}

