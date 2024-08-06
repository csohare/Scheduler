import { useNavigate } from "react-router-dom";
import { AuthContextType, useAuth } from "../context/authProvider";
import { useState, useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tables } from "../util/types/supabaseTypes";
import { fetchReservations } from "../api/reservationQuery";
import { DatePicker, TimeField } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200, sortable: false },
  { field: "res_start", headerName: "Start Time", width: 200 },
  { field: "res_end", headerName: "End Time", width: 200 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "type", headerName: "Type", width: 70 },
  { field: "status", headerName: "Status", width: 130 },
];

export default function Dashboard() {
  const { session } = useAuth() as AuthContextType;
  const [reservations, setReservations] = useState<
    Tables<"reservation">[] | undefined
  >([]);
  const [error, setError] = useState();
  const [resDate, setResDate] = useState<Dayjs | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session?.user.role !== "service_role") {
      navigate("/");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = new Date(today);
    week.setDate(today.getDate() + 11);

    fetchReservations(today, week)
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  console.log(resDate, error);

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        border={1}
        borderColor="#E57E31"
        borderRadius="16px"
        marginBottom="1rem"
      >
        <DatePicker
          value={resDate}
          onChange={(newDate) => setResDate(newDate)}
        />
        <TimeField />
        <TimeField />
        <Button variant="contained" color="warning" className="">
          Create Reservation
        </Button>
      </Box>
      <Box sx={{}}>
        <DataGrid
          rows={reservations}
          columns={columns}
          checkboxSelection
          sx={{ backgroundColor: "#E57E31" }}
        />
      </Box>
    </Container>
  );
}
