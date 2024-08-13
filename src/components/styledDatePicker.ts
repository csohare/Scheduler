import { DatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/material";

export const StyledDatePicker = styled(DatePicker)({
  "& .MuiInputLabel-root": {
    color: "white",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "#E57E31",
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E57E31",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
});
