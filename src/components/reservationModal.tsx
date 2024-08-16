import { Dayjs } from "dayjs";
import { useState } from "react";
import {
  Modal,
  Fade,
  Box,
  Backdrop,
  Select,
  FormControl,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { StyledDateTimePicker } from "./styledDateTimePicker";
import insertReservation from "../api/insertReservation";

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
  flexDirection: "column",
};

type ReservationModalProps = {
  open: boolean;
  setOpen: (newValue: boolean) => void;
};

export default function ReservationModal({
  open,
  setOpen,
}: ReservationModalProps) {
  const [resStart, setResStart] = useState<Dayjs | null>(null);
  const [resEnd, setResEnd] = useState<Dayjs | null>(null);
  const [resName, setResName] = useState<string>("ADMIN");
  const [resType, setResType] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleReservationSubmit = async () => {
    if (!resStart || !resEnd || !resType) {
      setError("Please Fill Out All Form Fields");
    } else {
      const res_start = resStart.toDate().toLocaleString();
      const res_end = resEnd.toDate().toLocaleString();

      if (resEnd.toDate() <= resStart.toDate()) {
        setError("Reservation Start Time Cannot Be After End Time");
        return;
      }
      try {
        await insertReservation(res_start, res_end, resType, resName!);
        window.location.reload();
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setResName("ADMIN");
        setResStart(null);
        setResEnd(null);
        setOpen(false);
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalBoxStyle}>
          <Box
            display="flex"
            justifyContent="center"
            color="white"
            marginBottom={2}
          >
            <Typography variant="h6">Create Single Reservation</Typography>
          </Box>
          {error && (
            <Alert
              severity="error"
              onClose={() => {
                setError("");
              }}
              sx={{ marginBottom: 2 }}
            >
              {error}
            </Alert>
          )}
          <Box display="flex" flexDirection="column" alignContent="center">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="start"
              alignContent="center"
            >
              <StyledDateTimePicker
                label="Start Time"
                value={resStart}
                onChange={(newStart) => setResStart(newStart)}
                sx={{ margin: 1 }}
              />
              <StyledDateTimePicker
                label="End Time"
                value={resEnd}
                onChange={(newEnd) => setResEnd(newEnd)}
                sx={{ margin: 1 }}
              />
            </Box>
            <Box
              display="flex"
              alignContent="center"
              justifyContent="start"
              marginY={2}
            >
              <TextField
                label="Reservation Name"
                value={resName}
                onChange={(e) => {
                  setResName(e.target.value);
                }}
                sx={{
                  margin: 1,
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderWidth: "2px",
                      borderColor: "#E57E31",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#E57E31",
                    },
                    "& input": {
                      color: "white",
                    },
                  },
                }}
              ></TextField>
              <FormControl fullWidth sx={{ margin: 1 }}>
                <InputLabel
                  sx={{
                    color: "white",
                    "&.Mui-focused": { color: "white" },
                  }}
                >
                  Reservation Type
                </InputLabel>
                <Select
                  label="Reservation Type"
                  value={resType}
                  onChange={(e) => {
                    setResType(e.target.value);
                  }}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E57E31",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "2px",
                      borderColor: "#E57E31",
                    },
                    "& .MuiSelect-icon": {
                      color: "white",
                    },
                  }}
                >
                  <MenuItem value="full">Full Court</MenuItem>
                  <MenuItem value="half">Half Court</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
        </Box>
      </Fade>
    </Modal>
  );
}
