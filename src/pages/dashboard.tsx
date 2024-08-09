/* TODO:
 *    Fix Delete reservation functionality
 *    Handle Modals for each case (set business hours given time range)
 *      - Invalidate all current CheckoutSessions
 *      - Create postgres function to check for reservations that are type business hour and remove those
 *      - Check for overlapping with current reservations
 *      - Add the new business hours
 *    Creating a reservation manually
 *      - Invalidate all checkout sessions
 *      - Check if reservation overlaps with any others
 *      - Return reservations that overlap if it does
 *      - If no overlap just insert it into reservations
 *   Handle errors from these operations with an alert at the top of the page
 */

import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { AuthContextType, useAuth } from "../context/authProvider";
import { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  Container,
  Fade,
  IconButton,
  Modal,
  styled,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Tables } from "../util/types/supabaseTypes";
import { fetchReservations } from "../api/reservationQuery";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledDateTimePicker = styled(DateTimePicker)({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white", // Default border color
    },
    "&:hover fieldset": {
      borderColor: "#E57E31", // Border color on hover
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E57E31", // Border color when focused
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
});

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", sortable: false, flex: 3 },
  { field: "res_start", headerName: "Start Time", flex: 2 },
  { field: "res_end", headerName: "End Time", flex: 2 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

const modalBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#222222",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "row",
};

export default function Dashboard() {
  const { session } = useAuth() as AuthContextType;
  const [reservations, setReservations] = useState<
    Tables<"reservation">[] | undefined
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [resStart, setResStart] = useState<Dayjs | null>(null);
  const [resEnd, setResEnd] = useState<Dayjs | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [resOpen, setResOpen] = useState(false);

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

      const { error } = await supabase
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
      window.location.reload();
    }
  };
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
    <Container>
      <Box sx={{ marginTop: 5 }}>
        <DataGrid
          rows={reservations}
          columns={columns}
          checkboxSelection
          autoHeight
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleRowSelection}
          sx={{
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
        {selectedRows.length !== 0 && (
          <IconButton onClick={handleDeleteReservations}>
            <DeleteIcon sx={{ color: "white" }} />
          </IconButton>
        )}
      </Box>
      <Box>
        <Button
          variant="contained"
          color="warning"
          onClick={() => setResOpen(true)}
          sx={{ marginTop: 2 }}
        >
          Create Reservation
        </Button>
      </Box>
      <Modal
        open={resOpen}
        onClose={() => setResOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={resOpen}>
          <Box sx={modalBoxStyle}>
            <StyledDateTimePicker
              value={resStart}
              onChange={(newStart) => setResStart(newStart)}
              sx={{ width: "auto", margin: 1 }}
            />
            <StyledDateTimePicker
              value={resEnd}
              onChange={(newEnd) => setResEnd(newEnd)}
              sx={{ width: "auto", margin: 1 }}
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleReservationSubmit}
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                width: "auto",
                maxWidth: "100%",
                margin: 1,
              }}
            >
              Create Reservation
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
