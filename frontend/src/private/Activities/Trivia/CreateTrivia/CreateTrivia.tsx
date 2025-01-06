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
import {
  Backdrop,
  EditableLabel,
  EditableSelect,
} from '../../../../components';
import { useApi } from '../../../../hooks';
import { getCommunityDetails } from '../../../../services/firebase';
import {
  createOrUpdateActivity,
  getFullTrivia,
} from '../../../../services/firebase/activity';
import { createTriviaRoom } from '../../../../services/firebase/room';
import {
  useCommunityDetailsStore,
  useCreateTriviaStore,
} from '../../../../stores/zubstand';
import { AnswerText, QuestionItem } from './components';
import './CreateTrivia.css';

export const CreateTrivia = () => {
  const { communityId, activityId } = useParams();
  const [activityTile, setActivityTitle] = useState('Default title :)');
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [seasonOptions, setSeasonOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >();

  const navigate = useNavigate();

  const { addActivity, updateActivityName, getSeasons, setCommunityDetails } =
    useCommunityDetailsStore();

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

  const {
    data: getCommunityDetailsResponse,
    execute: getCommunityDetailsExecute,
  } = useApi({
    request: getCommunityDetails,
  });

  // Note: esto sucede solo si el usuario entra directamente a la url y por ende
  // no se carga los details de la comunidad
  useEffect(() => {
    if (getCommunityDetailsResponse) {
      console.log(getCommunityDetailsResponse);
      setCommunityDetails(communityId!, getCommunityDetailsResponse.data);
      const { seasons } = getCommunityDetailsResponse.data;
      console.log('*******************1', seasons);
      setSelectedSeason(seasons[0].id);
      setSeasonOptions(seasons.map((s) => ({ label: s.name, value: s.id })));
    }
  }, [communityId, getCommunityDetailsResponse, setCommunityDetails]);

  useEffect(() => {
    if (communityId) {
      const seasons = getSeasons(communityId);
      if (seasons) {
        console.log('*******************2', seasons);
        setSelectedSeason(seasons[0].id);
        setSeasonOptions(seasons.map((s) => ({ label: s.name, value: s.id })));
      } else {
        getCommunityDetailsExecute(communityId);
      }
    }

    if (communityId && activityId) {
      fetchTrivia({ activityId, communityId });
    }
  }, [
    activityId,
    communityId,
    fetchTrivia,
    getCommunityDetailsExecute,
    getSeasons,
  ]);

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
        navigate(`/community/${communityId}/activity/trivia/${id}`);
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
    navigate,
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
      seasonId: selectedSeason,
      details: questions,
      type: 'trivia',
    });
  };

  const handleStatTrivia = async () => {
    await createRoom({ communityId, activityId });
  };

  const anyError = error || fetchError || createRoomError;

  console.log(seasonOptions);

  return (
    <>
      {(loading || fetchLoading || createRoomLoading) && <Backdrop />}
      <Box className="question-top-bar">
        {seasonOptions && (
          <Box className="question-top-bar-input" sx={{ mr: 2 }}>
            <Typography variant="body1">Season:</Typography>
            <EditableSelect
              defaultValue={selectedSeason}
              options={seasonOptions}
            />
          </Box>
        )}
        <Box className="question-top-bar-input">
          <Typography variant="body1">Trivia Name:</Typography>
          <EditableLabel
            defaultValue={activityTile}
            onSave={(value) => setActivityTitle(value)}
          />
        </Box>
        <div className="btn-actions">
          {activityId && (
            <Button onClick={handleStatTrivia} variant="outlined" size="medium">
              Iniciar Room
            </Button>
          )}
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
