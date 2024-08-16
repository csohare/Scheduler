import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { AuthContextType, useAuth } from "../context/authProvider";
import { useState, useEffect } from "react";
import { Box, Button, Container, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Tables } from "../util/types/supabaseTypes";
import { fetchReservations } from "../api/reservationQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import ReservationModal from "../components/reservationModal";
import BusinessHoursModal from "../components/businessHoursModal";

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
  const [error, setError] = useState<string | null>(null);

  const [resOpen, setResOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

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
          marginLeft={1.5}
          sx={{ marginTop: { xs: 2, sm: 2, md: 0, lg: 0 } }}
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
      <ReservationModal open={resOpen} setOpen={setResOpen} />
      <BusinessHoursModal open={businessOpen} setOpen={setBusinessOpen} />
    </Container>
  );
}
