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
  Switch,
  FormControlLabel,
  Alert,
  alpha,
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
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePopState);

    const timeoutId = setTimeout(() => {
      fetchReservations()
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
      clearTimeout(timeoutId);
      window.removeEventListener("popstate", handlePopState);
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
  };

  const handleEndTimeChange = (event: SelectChangeEvent) => {
    setEndTime(event.target.value);
  };

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCsLoading(true);
    fetchCheckoutSession(startTime!, endTime, resType)
      .then((data) => {
        console.log(data);
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === false) {
      setResType("half");
    } else {
      setResType("full");
    }
    setStartTime(undefined);
    setEndTime("");
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
          <div className="pl-5 pt-5">
            <FormControlLabel
              className="scale-125"
              control={
                <Switch
                  defaultChecked
                  onChange={handleSwitchChange}
                  style={{ pointerEvents: "auto" }}
                />
              }
              label={
                resType === "full" ? "FULL COURT $150/h" : "HALF COURT $75/h"
              }
              style={{ pointerEvents: "none" }}
              sx={{
                paddingY: "1em",
                paddingLeft: "1em",
                "& .MuiTypography-root": {
                  padding: "7px",
                  borderWidth: "3px",
                  borderRadius: "5px",
                  borderColor: "#E57E31",
                  fontWeight: "900",
                  fontSize: "1.15em",
                  color: "white",
                },
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#E57E31",
                  "&:hover": {
                    backgroundColor: alpha("#E57E31", 0.1),
                  },
                },
                "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
                  backgroundColor: "#E57E31",
                },
              }}
            />
          </div>
          <ScheduleMeeting
            borderRadius={25}
            primaryColor="#E57E31"
            backgroundColor="#333333"
            eventDurationInMinutes={60}
            availableTimeslots={resType === "full" ? fullRes : halfRes}
            startTimeListStyle="scroll-list"
            onStartTimeSelect={handleOnStartTimeSelect}
            selectedStartTime={startTime}
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
                    color: "white",
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
                  className={`${endTime && "animate-pulse"}`}
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
