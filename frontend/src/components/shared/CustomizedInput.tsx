import TextField from "@mui/material/TextField";

type Props = {
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomizedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      name={props.name}
      label={props.label}
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      slotProps={{
        inputLabel: { style: { color: "white" } },
        input: {
          style: {
            width: "400px",
            borderRadius: 10,
            fontSize: 20,
            color: "white",
          },
        },
      }}
    />
  );
};

export default CustomizedInput;