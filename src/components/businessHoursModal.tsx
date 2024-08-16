import { Dayjs } from "dayjs";
import { useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
} from "@mui/material";
import { StyledDatePicker } from "./styledDatePicker";
import { StyledTimePicker } from "./styledTimePicker";
import insertBusinessHours from "../util/insertBusinessHours";

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

type BusinessHoursModalProps = {
  open: boolean;
  setOpen: (newValue: boolean) => void;
};

export default function BusinessHoursModal({
  open,
  setOpen,
}: BusinessHoursModalProps) {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [openTime, setOpenTime] = useState<Dayjs | null>(null);
  const [closeTime, setCloseTime] = useState<Dayjs | null>(null);
  const [error, setError] = useState("");

  const handleBusinessHoursSubmit = async () => {
    if (!startDate || !endDate || !openTime || !closeTime) {
      setError("Fill Out all Form Fields");
    } else {
      if (endDate.toDate() < startDate.toDate()) {
        setError("Start Date Cannot Be After End Date");
      }
      if (closeTime <= openTime) {
        setError("Open Time Cannot Be the Same or After Closing Time");
      }
      try {
        await insertBusinessHours(
          startDate.toDate(),
          endDate.toDate(),
          openTime.toDate(),
          closeTime.toDate(),
        );
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
            <Typography variant="h6">Set Business Hours</Typography>
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
          <Box
            display="flex"
            flexDirection="column"
            alignContent="center"
            justifyContent="center"
          >
            <Box marginY={1} display="flex" justifyContent="center">
              <StyledDatePicker
                label="Start Date"
                sx={{ margin: 1 }}
                value={startDate}
                onChange={(newStartDate) => setStartDate(newStartDate)}
              />
              <StyledDatePicker
                label="End Date"
                sx={{ margin: 1 }}
                value={endDate}
                onChange={(newEndDate) => setEndDate(newEndDate)}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <StyledTimePicker
                label="Open Time"
                sx={{ margin: 1 }}
                value={openTime}
                onChange={(newOpenTime) => setOpenTime(newOpenTime)}
              />
              <StyledTimePicker
                label="Close Time"
                sx={{ margin: 1 }}
                value={closeTime}
                onChange={(newCloseTime) => setCloseTime(newCloseTime)}
              />
            </Box>
            <Button
              variant="contained"
              color="warning"
              onClick={handleBusinessHoursSubmit}
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                width: "auto",
                maxWidth: "100%",
                margin: 1,
                marginTop: 2,
              }}
            >
              Set Business Hours
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
