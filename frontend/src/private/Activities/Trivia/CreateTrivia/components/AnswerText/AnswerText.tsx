import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import {
  Box,
  Checkbox,
  FormControl,
  Input,
  InputAdornment,
  SvgIcon,
} from '@mui/material';
import './AnswerText.css';

interface Props {
  index: number;
  name: string;
  value: string;
  isCorrect: boolean;
  onChange: (value: string) => void;
  onToggleCorrect: (isCorrect: boolean) => void;
}

export const AnswerText = ({
  index,
  name,
  value,
  isCorrect,
  onChange,
  onToggleCorrect,
}: Props) => {
  return (
    <FormControl
      className="answer-text"
      sx={{
        backgroundColor: value.length > 0 ? getbgColor(index) : 'white',
      }}
    >
      <Input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="answer-text-input"
        placeholder={`Answer ${index + 1}`}
        startAdornment={
          <InputAdornment
            className="input-adorment"
            position="start"
            sx={{ backgroundColor: getbgColor(index) }}
          >
            {getShapeIcon(index)}
          </InputAdornment>
        }
      />
      <Box sx={{ marginLeft: '8px' }}>
        {value.length > 0 && (
          <Checkbox
            checked={isCorrect}
            onChange={(e) => onToggleCorrect(e.target.checked)}
            sx={{
              backgroundColor: 'white',
              color: isCorrect ? 'green' : 'gray',
              '&.Mui-checked': {
                color: 'green',
              },
            }}
          />
        )}
      </Box>
    </FormControl>
  );
};

const icons = [
  <SquareIcon className="input-adorment-icon" />,
  <CircleIcon className="input-adorment-icon" />,
  <SvgIcon className="input-adorment-icon">
    <path d="M12 2L22 20H2L12 2Z" />
  </SvgIcon>,
  <SvgIcon className="input-adorment-icon">
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>,
];

function getShapeIcon(index: number) {
  return icons[index] || icons[3];
}

function getbgColor(index: number) {
  const colors = ['red', 'blue', 'orange', 'green'];
  return colors[index] || 'white';
}
