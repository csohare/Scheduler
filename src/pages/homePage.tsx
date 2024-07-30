import { supabase } from "../config/supabaseClient";
import { useEffect, useLayoutEffect, useState } from "react";
import findFullIntervals from "../util/fullCourtIntervals";
import findHalfIntervals from "../util/halfCourtIntervals";
import allowedTimes from "../util/allowedTimes";
import { availableEnd } from "../util/allowedTimes";
import { ScheduleMeeting } from "react-schedule-meeting";
import { AvailableTimeslot, StartTimeEvent } from "react-schedule-meeting";
import { Check } from "@mui/icons-material";
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
  Backdrop,
  Alert,
  alpha,
} from "@mui/material";

export default function HomePage() {
  const [fullRes, setFullRes] = useState<AvailableTimeslot[]>([]);
  const [halfRes, setHalfRes] = useState<AvailableTimeslot[]>([]);
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<string>("");
  const [endTimes, setEndTimes] = useState<availableEnd[]>([]);
  const [fetchError, setFetchError] = useState(null);
  const [resType, setResType] = useState("full");
  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#202020";
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const today = new Date();
        const week = new Date(today);
        week.setDate(today.getDate() + 6);

        const fToday = today.toISOString().split("T")[0];
        const fWeek = week.toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("reservation")
          .select()
          .order("res_start", { ascending: true })
          .gte("res_start", fToday)
          .lte("res_end", fWeek);

        if (error) {
          throw error;
        } else {
          setFetchError(null);
          setFullRes(() => findFullIntervals(data));
          setHalfRes(() => findHalfIntervals(data));
        }
        setLoading(false);
      } catch (error: any) {
        setFetchError(error.message);
      }
    };
    const timeoutId = setTimeout(() => {
      fetchReservations();

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
          "Order canceled or failed. Try booking again or contact owner to make reservation",
        );
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleOnStartTimeSelect = (event: StartTimeEvent) => {
    const hours =
      Math.abs(
        Number(event.startTime) - Number(event.availableTimeslot.endTime),
      ) / 3.6e6;
    setStartTime(event.startTime);
    setEndTimes(allowedTimes(event.startTime, hours));
  };

  const handleEndTimeChange = (event: SelectChangeEvent) => {
    setEndTime(event.target.value);
  };

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(
      "https://fkwmyteahamhgaqsxetp.supabase.co/functions/v1/checkoutSession",
      {
        method: "POST",
        body: JSON.stringify({
          startTime: `${startTime?.toLocaleString()}`,
          endTime: `${new Date(endTime).toLocaleString()}`,
          resType,
        }),
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => res.json())
      .then((data) => (window.location.href = data.url));
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
    <Alert severity={success ? "success" : "error"}>{message}</Alert>
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
              label={resType === "full" ? "FULL COURT" : "HALF COURT"}
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
            backgroundColor="#27272a"
            eventDurationInMinutes={60}
            availableTimeslots={resType === "full" ? fullRes : halfRes}
            startTimeListStyle="scroll-list"
            onStartTimeSelect={handleOnStartTimeSelect}
            selectedStartTime={startTime}
          />
          <div className="mx-24">
            <form onSubmit={handleFormSubmit}>
              <TextField
                className="scale-110"
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
                margin="dense"
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
                className="scale-110"
                fullWidth
                margin="normal"
                focused
                sx={{
                  "& .MuiSelect-icon.Mui-disabled": {
                    color: "#E57E31",
                  },
                  "& .MuiSelect-icon": {
                    color: "#E57E31",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#E57E31",
                    },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#E57E31",
                  },
                }}
              >
                <InputLabel
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
                    className: "scale-x-110",
                  }}
                >
                  {renderedEndTimes}
                </Select>
              </FormControl>

              <Box
                className="mt-4 scale-125"
                textAlign="center"
                sx={{
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
                  disabled={endTime ? false : true}
                >
                  Create Reservation
                </Button>
              </Box>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
