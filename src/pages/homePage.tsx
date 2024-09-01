import { useEffect, useState } from "react";
import findFullIntervals from "../util/fullCourtIntervals";
import findHalfIntervals from "../util/halfCourtIntervals";
import allowedTimes from "../util/allowedTimes";
import { fetchReservations } from "../api/reservationQuery";
import { fetchCheckoutSession } from "../api/checkoutSessionQuery";
import { availableEnd } from "../util/allowedTimes";
import { ScheduleMeeting } from "react-schedule-meeting";
import { AvailableTimeslot, StartTimeEvent } from "react-schedule-meeting";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function HomePage() {
  const [fullRes, setFullRes] = useState<AvailableTimeslot[]>([]);
  const [halfRes, setHalfRes] = useState<AvailableTimeslot[]>([]);
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<string>("");
  const [endTimes, setEndTimes] = useState<availableEnd[]>([]);
  const [resType, setResType] = useState("full");
  const [loading, setLoading] = useState(true);
  const [csLoading, setCsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handlePageHide = () => {
      window.addEventListener("pageshow", () => {
        window.location.reload();
      });
    };
    window.addEventListener("pagehide", handlePageHide);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = new Date(today);
    week.setDate(today.getDate() + 11);

    const timeoutId = setTimeout(() => {
      fetchReservations(today, week)
        .then((data) => {
          setFullRes(() => findFullIntervals(data!));
          setHalfRes(() => findHalfIntervals(data!));
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          navigate("/error", { state: { error } });
        });
      const query = new URLSearchParams(window.location.search);
      const res = query.get("success");

      if (res === "true") {
        setSuccess(true);
        setMessage(
          "Reservation created! You will receive an email confirmation soon. Thank you for booking with us!",
        );
      }
      if (res === "false") {
        setSuccess(false);
        setMessage(
          "Order canceled or failed. Try booking again. If problem persists contact damon@theboombase.com for more information.",
        );
      }
      if (res === "overlap") {
        setSuccess(false);
        setMessage(
          "Reservation overlaps with another. Please try booking another time!",
        );
      }
    }, 500);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleOnStartTimeSelect = (event: StartTimeEvent) => {
    const hours =
      Math.abs(
        Number(event.startTime) - Number(event.availableTimeslot.endTime),
      ) / 3.6e6;
    setStartTime(event.startTime);
    setEndTimes(allowedTimes(event.startTime, hours));
    setEndTime("");
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleEndTimeChange = (event: SelectChangeEvent) => {
    setEndTime(event.target.value);
  };

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCsLoading(true);
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
        //navigate("/error", { state: { error } });
      });
  };

  const renderedEndTimes = endTimes.map((endTime) => {
    return (
      <MenuItem
        key={endTime.endTimeString}
        value={endTime.endTimeString.split(`${endTime.duration} Hour: `)[1]}
      >
        {endTime.endTimeString}
      </MenuItem>
    );
  });

  const alertMessage = (
    <Alert
      className="mx-3"
      severity={success ? "success" : "error"}
      onClose={() => {
        setMessage("");
      }}
    >
      {message}
    </Alert>
  );

  return (
    <div className="container flex flex-col mx-auto mt-1 h-screen justify-start align-middle">
      {loading ? (
        <div className="flex h-full justify-center">
          <div className="my-auto scale-150">
            <CircularProgress
              sx={{
                color: "#E57E31",
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          {message && alertMessage}
          <Box display="flex" justifyContent="center" alignContent="center">
            <img
              className="transition ease-in-out scale-125 select-none hover:cursor-pointer hover:scale-150 duration-300"
              src="/logo.png"
              onClick={() => {
                navigate("/");
              }}
            />
          </Box>
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
            borderBottom="3px solid white"
            marginTop={6}
            marginBottom={1}
            marginX={3}
          >
            <Button
              onClick={() => {
                setResType("full");
                setStartTime(undefined);
                setEndTime("");
              }}
              size="large"
              sx={{
                backgroundColor: `${resType === "full" ? "white" : "transparent"}`,
                color: `${resType === "full" ? "black" : "white"}`,
                fontSize: "1.25rem",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "white", color: "black" },
              }}
            >
              Full Court $150/h
            </Button>
            <Button
              onClick={() => {
                setResType("half");
                setStartTime(undefined);
                setEndTime("");
              }}
              size="large"
              sx={{
                backgroundColor: `${resType === "half" ? "white" : "transparent"}`,
                color: `${resType === "half" ? "black" : "white"}`,
                fontSize: "1.25rem",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "white", color: "black" },
              }}
            >
              Half Court $75/h
            </Button>
          </Box>
          <ScheduleMeeting
            borderRadius={15}
            primaryColor="#E57E31"
            backgroundColor="#333333"
            eventDurationInMinutes={30}
            availableTimeslots={resType === "full" ? fullRes : halfRes}
            //startTimeListStyle="scroll-list"
            onStartTimeSelect={handleOnStartTimeSelect}
            selectedStartTime={startTime}
            skipConfirmCheck={true}
          />
          <div className="mx-5">
            <form onSubmit={handleFormSubmit}>
              <TextField
                className=""
                value={
                  startTime
                    ? `${startTime?.toDateString()} ${startTime?.toLocaleTimeString()}`
                    : ""
                }
                color="primary"
                label={"Start Time"}
                variant="outlined"
                focused
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#E57E31",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#E57E31",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                }}
              />
              <FormControl
                className={`w-full ${startTime && !endTime && "animate-bounce"}`}
                disabled={!startTime ? true : false}
                fullWidth
                margin="normal"
                focused
                sx={{
                  "& .MuiSelect-icon.Mui-disabled": {
                    color: "black",
                  },
                  "& .MuiSelect-icon": {
                    color: `${startTime && !endTime ? "white" : "#E57E31"}`,
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: `${startTime && !endTime ? "white" : "#E57E31"}`,
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: `${startTime && !endTime ? "white" : "#E57E31"}`,
                  },
                }}
              >
                <InputLabel
                  className="pl-3"
                  id="end_label"
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                  }}
                >
                  Available End Times
                </InputLabel>
                <Select
                  labelId="end_label"
                  label="Available End Times"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      color: "white",
                    },
                  }}
                  MenuProps={{
                    className: "",
                  }}
                >
                  {renderedEndTimes}
                </Select>
              </FormControl>

              <Box
                marginBottom="2rem"
                className="mt-4 scale-125"
                textAlign="center"
                sx={{
                  "& .MuiCircularProgress-root": {
                    color: "white",
                  },
                  "& .MuiButton-root.Mui-disabled": {
                    color: "#949494",
                  },
                  button: {
                    color: "white",
                    bgcolor: "#E57E31",
                    "&:hover": {
                      backgroundColor: "#E57E31",
                    },
                  },
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={endTime && !csLoading ? false : true}
                >
                  Create Reservation
                  {csLoading && (
                    <CircularProgress
                      className="ml-3"
                      size={20}
                      thickness={4}
                    />
                  )}
                </Button>
              </Box>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
