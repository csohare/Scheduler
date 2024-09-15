import { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { fetchCheckoutSession } from "../api/checkoutSessionQuery";

type reservationConfirmationModalProps = {
  open: boolean;
  setOpen: (newValue: boolean) => void;
  startTime: Date;
  endTime: string;
  resType: string;
};

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
  color: "white",
  width: { xs: "90%", sm: "70%" },
  maxWidth: "700px",
};

export default function ReservationConfirmationModal({
  open,
  setOpen,
  startTime,
  endTime,
  resType,
}: reservationConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const createReservation = () => {
    setLoading(true);
    fetchCheckoutSession(startTime!, endTime, resType)
      .then((data) => {
        window.location.href = data.url;
      })
      .catch((error) => {
        console.log(error);
        window.location.href =
          "http://" +
          window.location.host +
          window.location.pathname +
          "?success=overlap";
      });
  };
  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (
          loading &&
          (reason === "backdropClick" || reason === "escapeKeyDown")
        ) {
          return;
        }
        setLoading(false);
        setOpen(false);
      }}
      disableEscapeKeyDown={loading}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: { timeout: 500 },
      }}
    >
      <Fade in={open}>
        <Box sx={modalBoxStyle}>
          <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Confirm Reservation
            </Typography>
            <Typography variant="h6">
              {startTime?.toDateString() +
                " " +
                startTime?.toLocaleTimeString() +
                " "}
              to {endTime}
            </Typography>
            <Typography variant="h6">
              {resType.charAt(0).toUpperCase()}
              {resType.slice(1)} Court
            </Typography>
            <Alert severity="error" sx={{ marginTop: 1 }}>
              Bookings are non-refundable. The cancellation policy is at the
              sole discretion of the facility. Please note that the facility may
              delay bookings by 5 minutes. Alcohol is prohibited on the
              facility's grounds. Pending reservations will be held for 5
              minutes before being released.
            </Alert>
            <Button
              variant="contained"
              size="large"
              disabled={loading ? true : false}
              sx={{
                marginTop: 3,
                backgroundColor: "#E57E31",
                "&.Mui-disabled": {
                  color: "#949494",
                },
                "&:hover": {
                  backgroundColor: "#E57E31",
                },
              }}
              onClick={createReservation}
            >
              Create Reservation
              {loading && (
                <CircularProgress
                  size={20}
                  thickness={4}
                  sx={{ marginLeft: 1, color: "white" }}
                />
              )}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
