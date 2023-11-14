import '../../assets/css/mission.css';
import {DataGrid, GridColDef, GridColumnGroupingModel, GridToolbar} from '@mui/x-data-grid';
import {Paper} from "@mui/material";
import {getAllMissions} from "../../requests/missions.ts";
import {useEffect, useState} from "react";
import {formatAddress, formatDate} from "../../utils/formatUtils.ts";

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
                flex: 0.05,
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
                flex: 0.05,
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
            }
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
        <div>
            <Paper style={{boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px'}}>
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
                />
            </Paper>
        </div>
    );
}

