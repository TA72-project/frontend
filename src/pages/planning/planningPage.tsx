import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Button, Divider, Grid, Menu, MenuItem, MenuProps, Paper, Typography, alpha, styled } from '@mui/material';
import { useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TaskCard from '../../components/taskCard';
import { EventContentArg } from '@fullcalendar/core/index.js';

// More details on : https://fullcalendar.io/docs#toc

const todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

const threeDayLater = new Date();
threeDayLater.setDate(threeDayLater.getDate() + 2);

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

type Event = {
    id: number,
    title: string,
    start: string,
    end: string,
    url: string,
    extendedProps?: {
        department: string
    },
}

const INITIAL_EVENTS: Event[] = [
    {
        id: 1,
        title: 'Rendre visite au patient 2 avec 2 infirmières',
        start: yesterday.toISOString().replace(/T.*$/, ''),
        end: threeDayLater.toISOString().replace(/T.*$/, '') + 'T12:00:00',
        url: '/detail_mission/' + 1,
    },
    {
        id: 2,
        title: 'Patient X023',
        start: threeDayLater.toISOString().replace(/T.*$/, '') + 'T04:00:00',
        end: new Date('2023-11-30').toISOString().replace(/T.*$/, '') + 'T12:00:00',
        url: '/detail_mission/' + 2,
        extendedProps: {
            department: 'BioChemistry'
        },
    }
    ,
    {
        id: 3,
        title: 'BabySisting',
        start: threeDayLater.toISOString().replace(/T.*$/, '') + 'T04:00:00',
        end: new Date('2023-11-10').toISOString().replace(/T.*$/, '') + 'T12:00:00',
        url: '/detail_mission/' + 3,
        extendedProps: {
            department: 'BioChemistry'
        },
    }
];

const todayEvents = loadTodayEvent();

const state = {
    weekendsVisible: true,
    currentEvents: INITIAL_EVENTS
}

const StyledMenu = styled((props: MenuProps) => 
    (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}

            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));

export default function PlanningPage() {

    const businessHours= [ // specify an array instead
        {
            daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday, Tuesday, Wednesday
            startTime: '08:00', // 8am
            endTime: '18:00' // 6pm
        },
        {
            daysOfWeek: [ 6, 0 ], // Thursday, Friday
            startTime: '10:00', // 10am
            endTime: '16:00' // 4pm
        }
    ];

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12} sm={10} md={9}>
                        <Paper style={{padding: '15px'}}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin]}//interactionPlugin
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            initialView='dayGridMonth'
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={state.weekendsVisible}
                            businessHours={businessHours}
                            //events={state.currentEvents}
                            eventContent={renderEventContent}
                        />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={2} md={3}>
                        <Paper style={{padding: '15px'}}>
                            <div style={{textAlign: 'center'}}>
                                <Button
                                    id="demo-customized-button"
                                    aria-controls={open ? 'demo-customized-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
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
                                        'aria-labelledby': 'demo-customized-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleClose} disableRipple>
                                        <PictureAsPdfIcon/>
                                        Pdf
                                    </MenuItem>
                                    <Divider sx={{ my: 0.5 }} />
                                    <MenuItem onClick={handleClose} disableRipple>
                                        <CalendarMonthIcon/>
                                        GoogleCalendar
                                    </MenuItem>
                                    <Divider sx={{ my: 0.5 }} />
                                    <MenuItem onClick={handleClose} disableRipple>
                                        <InsertDriveFileIcon/>
                                        Excel
                                    </MenuItem>
                                </StyledMenu>
                            </div>
                            <br/>
                            {renderSidebar()}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

function renderSidebar() {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom style={{textAlign: 'center'}}>
            <strong>A faire aujourd'hui</strong>
        </Typography>
        {todayEvents.map(renderSidebarEvent)}
      </>
    )
}

function loadTodayEvent() {
    const event: Event[] = [];
    INITIAL_EVENTS.forEach(e => {
        if(e.start.replace(/T.*$/, '') === todayStr || 
            (new Date(e.start.replace(/T.*$/, '')) < new Date(todayStr) && new Date(e.end.replace(/T.*$/, '')) >= new Date(todayStr))
        ) {
            event.push(e);
        }
    });
    return event;
}

function renderEventContent(eventInfo:EventContentArg) {
  return (
    <>
      <i style={{margin: '5px'}}>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event:Event) {
  return (
    <TaskCard key={event.id} title={event.title} start={event.start} end={event.end} url={event.url}/>
  );
}
