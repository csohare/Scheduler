import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { AuthContextType, useAuth } from "../context/authProvider";
import { useState, useEffect } from "react";
import { Box, Button, Container, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Tables } from "../util/types/supabaseTypes";
import { fetchReservations } from "../api/reservationQuery";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import ReservationModal from "../components/reservationModal";
import BusinessHoursModal from "../components/businessHoursModal";

const CLOSED = "#949494";
const FULL = "#90ee90";
const PENDING = "#ffa500";
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", sortable: false, flex: 3 },
  { field: "res_start", headerName: "Start Time", flex: 2 },
  { field: "res_end", headerName: "End Time", flex: 2 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

export default function Dashboard() {
  const { session } = useAuth() as AuthContextType;
  const [reservations, setReservations] = useState<
    Tables<"reservation">[] | undefined
  >([]);
  const [events, setEvents] = useState<DayPilot.EventData[] | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [resOpen, setResOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [startDate, setStartDate] = useState<DayPilot.Date | undefined>(
    DayPilot.Date.now(),
  );

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = new Date(today);
    week.setDate(today.getDate() + 11);

    fetchReservations(today, week)
      .then((data) => {
        const formattedData = data
          ?.map((res) => {
            if (res.status === "HOURS") {
              return null;
            }
            return {
              ...res,
              res_start: new Date(res.res_start).toLocaleString(),
              res_end: new Date(res.res_end).toLocaleString(),
            };
          })
          .filter((item) => item !== null);
        const formattedEvents = data?.map((res) => {
          let text = `Type: ${res.type} court \nName: ${res.name}\nStatus: ${res.status}`;
          let background = FULL;

          if (res.status === "HOURS") {
            text = `Closed`;
            background = CLOSED;
          } else if (res.status === "PENDING") {
            background = PENDING;
          }
          return {
            id: res.id,
            text,
            start: dayjs(res.res_start).format("YYYY-MM-DDTHH:mm:ss"),
            end: dayjs(res.res_end).format("YYYY-MM-DDTHH:mm:ss"),
            backColor: background,
            resizeDisabled: true,
            moveDisabled: true,
            clickDisabled: true,
            deleteDisabled: true,
            rightClickDisabled: true,
          };
        });
        setEvents(formattedEvents);
        setReservations(formattedData);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (!session || session?.user.role !== "service_role") {
    return <Navigate to={"/"} replace />;
  }

  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    setSelectedRows(selectionModel);
  };

  const handleDeleteReservations = async () => {
    const response = await supabase
      .from("reservation")
      .delete()
      .in("id", selectedRows);
    console.log(response);
    window.location.reload();
  };

  console.log(error);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          marginTop: 5,
          flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
        }}
        display="flex"
        alignContent="start"
        justifyContent="start"
      >
        <Box display="flex" flexGrow={1}>
          <DataGrid
            rows={reservations}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={handleRowSelection}
            autoHeight
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-overlay": {
                backgroundColor: "transparent",
                fontSize: "1rem",
              },
              color: "white",
              "& .MuiSelect-icon": {
                color: "white",
              },
              "& .MuiIconButton-root.Mui-disabled": { color: "black" },
              "& .MuiIconButton-root": { color: "white" },
              "& .MuiTablePagination-root": { color: "white" },
              "& .MuiCheckbox-root": {
                color: "white",
              },
              "& .MuiCheckbox-root.Mui-checked": {
                color: "white",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#E57E31",
                color: "black",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#E57E31",
                color: "black",
              },
              "& .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                ":hover": {
                  backgroundColor: "rgba(229, 126, 49, 0.4)",
                },
                backgroundColor: "rgba(229, 126, 49, 0.4)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(229, 126, 49, 0.2)",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            marginLeft: { md: 1.5, lg: 1.5 },
            marginTop: { xs: 2, sm: 2, md: 0, lg: 0 },
          }}
        >
          <Button
            variant="contained"
            color="warning"
            onClick={() => setResOpen(true)}
            sx={{
              marginBottom: 1.5,
              padding: 2,
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Create Reservation
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setBusinessOpen(true)}
            sx={{
              marginBottom: 1.5,
              padding: 2,
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Set Business Hours
          </Button>
          {selectedRows.length !== 0 && (
            <IconButton onClick={handleDeleteReservations}>
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box display="flex" flexDirection="row" marginY={3}>
        <DayPilotNavigator
          selectMode="Week"
          showMonths={3}
          skipMonths={3}
          selectionDay={startDate}
          onTimeRangeSelected={(args) => {
            setStartDate(args.day);
          }}
        />
        <DayPilotCalendar
          viewType="Week"
          startDate={startDate}
          events={events}
          heightSpec="Full"
          durationBarVisible={false}
        />
      </Box>
      <ReservationModal open={resOpen} setOpen={setResOpen} />
      <BusinessHoursModal open={businessOpen} setOpen={setBusinessOpen} />
    </Container>
  );
}
