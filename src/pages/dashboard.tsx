import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { AuthContextType, useAuth } from "../context/authProvider";
import { useState, useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tables } from "../util/types/supabaseTypes";
import { fetchReservations } from "../api/reservationQuery";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", sortable: false, flex: 2 },
  { field: "res_start", headerName: "Start Time", flex: 1 },
  { field: "res_end", headerName: "End Time", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

export default function Dashboard() {
  const { session } = useAuth() as AuthContextType;
  const [reservations, setReservations] = useState<
    Tables<"reservation">[] | undefined
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [resStart, setResStart] = useState<Dayjs | null>(null);
  const [resEnd, setResEnd] = useState<Dayjs | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = new Date(today);
    week.setDate(today.getDate() + 11);

    fetchReservations(today, week)
      .then((data) => {
        const formattedData = data?.map((res) => {
          return {
            ...res,
            res_start: new Date(res.res_start).toLocaleString(),
            res_end: new Date(res.res_end).toLocaleString(),
          };
        });
        setReservations(formattedData);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  if (!session || session?.user.role !== "service_role") {
    return <Navigate to={"/"} replace />;
  }

  const handleReservationSubmit = async () => {
    if (!resStart || !resEnd) {
      setError("Please set start and end time");
    } else {
      const res_start = resStart.toDate().toLocaleString();
      const res_end = resEnd.toDate().toLocaleString();
      console.log(res_start, res_end);

      const { data, error } = await supabase
        .from("reservation")
        .insert([
          {
            res_start,
            res_end,
            type: "full",
            status: "COMPLETE",
            name: "ADMIN",
          },
        ])
        .select();
      if (error) {
        setError(error.message);
      }
      console.log(data);
      window.location.reload();
    }
  };
  console.log(error);

  //TODO: style reservation creation and add delete reservation functionality on the reservation data grid
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        border={1}
        borderColor="#E57E31"
        borderRadius="16px"
        width="100%"
        marginY="1rem"
      >
        <DateTimePicker
          value={resStart}
          onChange={(newStart) => setResStart(newStart)}
        />
        <DateTimePicker
          value={resEnd}
          onChange={(newEnd) => setResEnd(newEnd)}
        />
        <Button
          variant="contained"
          color="warning"
          onClick={handleReservationSubmit}
        >
          Create Reservation
        </Button>
      </Box>
      <Box sx={{}}>
        <DataGrid
          rows={reservations}
          columns={columns}
          checkboxSelection
          autoHeight
          sx={{
            color: "white",
            "& .MuiTablePagination-root": { color: "white" },
            "& .Mui-checked": {
              color: "#E57E31",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#E57E31",
              color: "black",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#E57E31",
              color: "black",
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
    </Container>
  );
}
