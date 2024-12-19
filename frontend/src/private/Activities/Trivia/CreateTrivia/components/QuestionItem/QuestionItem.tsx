import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import { IconButton, Tooltip } from '@mui/material';
import './QuestionItem.css';

interface Props {
  label: string;
  isActive: boolean;
  onDuplicate: () => void;
  onRemove: () => void;
  isLastQuiz: boolean;
}

export const QuestionItem = ({
  label,
  isActive,
  onDuplicate,
  onRemove,
  isLastQuiz,
}: Props) => {
  const active = isActive ? 'active' : '';
  return (
    <div className={`questionItem ${active}`}>
      <div className="portrait-wrap">
        <p>{label}</p>
        <div className={`portrait ${active}`}></div>
      </div>
      <div className={`actions ${active}`}>
        <Tooltip title="Duplicar">
          <IconButton
            aria-label="duplicar"
            onClick={onDuplicate}
            sx={{ width: 20, height: 20 }}
          >
            <ContentCopyIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={isLastQuiz ? 'No se puede eliminar la única quiz' : 'Eliminar'}
        >
          <span>
            <IconButton
              aria-label="eliminar"
              onClick={onRemove}
              sx={{ width: 20, height: 20 }}
              disabled={isLastQuiz}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
