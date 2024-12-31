import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Backdrop, EditableLabel } from '../../../../components';
import { useApi } from '../../../../hooks';
import {
  createOrUpdateActivity,
  getFullTrivia,
} from '../../../../services/firebase/activity';
import {
  useCommunityDetailsStore,
  useCreateTriviaStore,
} from '../../../../stores/zubstand';
import { AnswerText, QuestionItem } from './components';
import './CreateTrivia.css';
import { createTriviaRoom } from '../../../../services/firebase/room';

export const CreateTrivia = () => {
  const { communityId, activityId } = useParams();
  const [activityTile, setActivityTitle] = useState('Default title :)');
  const navigate = useNavigate();

  const { addActivity, updateActivityName } = useCommunityDetailsStore();

  const {
    questions,
    activeQuestionId,
    setTrivia,
    addQuestion,
    removeQuestion,
    duplicateQuestion,
    setActiveQuestion,
    updateQuestion,
  } = useCreateTriviaStore();

  const {
    data: createOrUpdateResponse,
    loading,
    error,
    execute,
  } = useApi({
    request: createOrUpdateActivity,
  });

  const {
    data: fetchResponse,
    loading: fetchLoading,
    error: fetchError,
    execute: fetchTrivia,
  } = useApi({ request: getFullTrivia });

  const {
    data: createRoomResponse,
    loading: createRoomLoading,
    error: createRoomError,
    execute: createRoom,
  } = useApi({
    request: createTriviaRoom,
  });

  useEffect(() => {
    if (activityId && communityId) {
      fetchTrivia({ activityId, communityId });
    }
  }, [activityId, communityId, fetchTrivia]);

  // Nota: el removeQuestion esta causando una desincronizacion temporal en activeQuestionId, con esto lo aseguramos.
  useEffect(() => {
    if (!questions.some((question) => question.id === activeQuestionId)) {
      setActiveQuestion(questions[0].id);
    }
  }, [activeQuestionId, questions, setActiveQuestion]);

  useEffect(() => {
    if (createOrUpdateResponse) {
      const { data } = createOrUpdateResponse;
      setActivityTitle(data.name);
      if (data.action === 'created') {
        const { activityId: id, name, type, seasonName } = data;
        addActivity(communityId!, { id, name, seasonName, type });
      } else {
        // 'updated'
        updateActivityName(communityId!, activityId!, data.name);
      }
    }
  }, [
    activityId,
    addActivity,
    communityId,
    createOrUpdateResponse,
    updateActivityName,
  ]);

  useEffect(() => {
    if (fetchResponse?.data) {
      setActivityTitle(fetchResponse.data.activity.name);
      setTrivia(fetchResponse.data);
    }

    if (createRoomResponse) {
      const { data } = createRoomResponse;

      navigate(`/community/${communityId}/activity/room/${data.roomId}`);
    }
  }, [
    communityId,
    fetchResponse?.data,
    navigate,
    setTrivia,
    createRoomResponse,
  ]);

  const activeQuestion = questions.find(
    (question) => question.id === activeQuestionId
  );

  const handleSave = async () => {
    await execute({
      activityId,
      name: activityTile,
      communityId,
      details: questions,
      type: 'trivia',
    });
  };

  const handleStatTrivia = async () => {
    await createRoom({ communityId, activityId });
  };

  const anyError = error || fetchError || createRoomError;

  return (
    <>
      {(loading || fetchLoading || createRoomLoading) && <Backdrop />}
      <Box className="question-top-bar">
        <EditableLabel
          defaultValue={activityTile}
          onSave={(value) => setActivityTitle(value)}
        />
        <div className="btn-actions">
          <Button onClick={handleStatTrivia} variant="outlined" size="medium">
            Start Trivia
          </Button>
          <Button onClick={handleSave} variant="contained" size="medium">
            Save
          </Button>
          <IconButton
            aria-label="delete"
            onClick={() => navigate(`/community/${communityId}`)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </Box>
      <Box className="question-editor">
        <Box className="question-nav">
          {questions.map((question, index) => (
            <Box key={index} onClick={() => setActiveQuestion(question.id)}>
              <QuestionItem
                isActive={activeQuestionId === question.id}
                label={`${index + 1}. ${question.type}`}
                isLastQuiz={questions.length === 1}
                onDuplicate={() => duplicateQuestion(question.id)}
                onRemove={() => removeQuestion(question.id)}
              />
            </Box>
          ))}
          <Button onClick={addQuestion} sx={{ width: '100%' }}>
            Add Question
          </Button>
        </Box>
        <Box className="question-inputs">
          {anyError && (
            <Typography variant="body2" color="error" sx={{ my: 2 }}>
              {anyError.message}
            </Typography>
          )}
          {activeQuestion && (
            <>
              <FormControl className="question-title">
                <TextField
                  variant="outlined"
                  value={activeQuestion.question}
                  onChange={(e) =>
                    updateQuestion(activeQuestion.id, {
                      question: e.target.value,
                    })
                  }
                  placeholder="Ingrese la pregunta"
                />
              </FormControl>
              <div className="answers">
                {activeQuestion.options.map((option, index) => (
                  <div key={index} className="answer-item">
                    <AnswerText
                      index={index}
                      name={`answers.${index}`}
                      value={option.value}
                      isCorrect={!!option.isCorrect}
                      onChange={(value) => {
                        const updatedOptions = [...activeQuestion.options];
                        updatedOptions[index] = {
                          ...updatedOptions[index],
                          value,
                        };
                        updateQuestion(activeQuestion.id, {
                          options: updatedOptions,
                        });
                      }}
                      onToggleCorrect={(isCorrect) => {
                        const updatedOptions = activeQuestion.options.map(
                          (opt, i) => ({
                            ...opt,
                            isCorrect: i === index ? isCorrect : opt.isCorrect,
                          })
                        );
                        updateQuestion(activeQuestion.id, {
                          options: updatedOptions,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </Box>
        <Box className="question-settings">
          {activeQuestion && (
            <>
              <FormControl fullWidth className="question-setting">
                <InputLabel id="question-type">Question Type</InputLabel>
                <Select
                  labelId="question-type"
                  id="demo-simple-select"
                  value={activeQuestion.type}
                  label="Question Type"
                  onChange={(e) =>
                    updateQuestion(activeQuestion.id, {
                      type: e.target.value as 'quiz' | 'boolean' | 'typetext',
                    })
                  }
                >
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="boolean">True or False</MenuItem>
                  <MenuItem value="typetext">Type Text</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className="question-setting">
                <InputLabel id="question-time-limit">Time limit</InputLabel>
                <Select
                  labelId="question-time-limit"
                  id="question-time-limit"
                  value={activeQuestion.timeLimit}
                  label="Time limit"
                  onChange={(e) =>
                    updateQuestion(activeQuestion.id, {
                      timeLimit: parseInt(e.target.value as string),
                    })
                  }
                >
                  <MenuItem value="5">5 seconds</MenuItem>
                  <MenuItem value="10">10 seconds</MenuItem>
                  <MenuItem value="20">20 seconds</MenuItem>
                  <MenuItem value="30">30 seconds</MenuItem>
                  <MenuItem value="45">45 seconds</MenuItem>
                  <MenuItem value="60">1 minute</MenuItem>
                  <MenuItem value="90">1 minute 30 seconds</MenuItem>
                  <MenuItem value="120">2 minute</MenuItem>
                  <MenuItem value="180">3 minute</MenuItem>
                  <MenuItem value="240">4 minute</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className="question-setting">
                <InputLabel id="question-points">Points</InputLabel>
                <Select
                  labelId="question-points"
                  id="question-points"
                  value={activeQuestion.points}
                  label="Points"
                  onChange={(e) =>
                    updateQuestion(activeQuestion.id, {
                      points: e.target.value as 'standard' | 'double',
                    })
                  }
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="double">Double points</MenuItem>
                </Select>
              </FormControl>
              <div className="question-settings-actions">
                <Button
                  className="question-settings-action"
                  disabled={questions.length === 1}
                  onClick={() => removeQuestion(activeQuestion.id)}
                >
                  Remove
                </Button>
                <Button
                  className="question-settings-action"
                  onClick={() => duplicateQuestion(activeQuestion.id)}
                  variant="outlined"
                >
                  Duplicate
                </Button>
              </div>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CreateTrivia;
