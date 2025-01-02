import {
  AppBar,
  Box,
  Button,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import { onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Backdrop } from '../../../../components';
import { useApi } from '../../../../hooks';
import {
  endTrivia,
  getRoomRef,
  joinTriviaRoom,
  nextQuestion,
  startTrivia,
  submitAnswer,
} from '../../../../services/firebase';
import { useAuthStore } from '../../../../stores/zubstand/authStore';
import { RoomData } from '../../../../services/firebase/dtos';
import './TriviaRoom.css';
import { Podium, QuestionResults } from './components';

const defaultRoomData: RoomData = {
  id: '',
  name: '',
  status: 'waiting',
  currentQuestion: null,
  currentQuestionStartTime: null,
  currentQuestionResults: {},
  ownerId: '',
  questions: [],
  answers: {},
  results: {},
};

export const TriviaRoom = () => {
  const navigate = useNavigate();
  const { roomId, communityId } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { user } = useAuthStore();
  //const [showQuestionResults, setShowQuestionResults] = useState(false);

  const isOwner = roomData?.ownerId === user?.uid;
  const isPlayerInRoom =
    roomData?.players && user && user.uid in roomData.players;

  const {
    execute: startTriviaExecute,
    error: startTriviaError,
    loading: startTriviaLoading,
  } = useApi({
    request: startTrivia,
  });

  const {
    execute: submitAnswerExecute,
    error: submitAnswerError,
    loading: submitAnswerLoading,
  } = useApi({
    request: submitAnswer,
  });

  const {
    execute: nextQuestionExecute,
    error: nextQuestionError,
    loading: nextQuestionLoading,
  } = useApi({
    request: nextQuestion,
  });

  const {
    execute: endTriviaExecute,
    data: endTriviaResponse,
    error: endTriviaError,
    loading: endTriviaLoading,
  } = useApi({
    request: endTrivia,
  });

  const {
    execute: joinTriviaRoomExecute,
    error: joinTriviaRoomError,
    loading: joinTriviaRoomLoading,
  } = useApi({
    request: joinTriviaRoom,
  });

  useEffect(() => {
    if (endTriviaResponse) {
      navigate(`/community/${communityId}`);
    }
  }, [communityId, endTriviaResponse, navigate]);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = getRoomRef(roomId);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setRoomData(data);

        if (data.currentQuestion) {
          const elapsedTime = Math.floor(
            (Date.now() - data.currentQuestionStartTime) / 1000
          );
          const timeRemaining = Math.max(
            data.currentQuestion.timeLimit - elapsedTime,
            0
          );

          setRemainingTime(timeRemaining);
          setSelectedOption(null);
          //setShowQuestionResults(false);
        }
      } else {
        setRoomData(defaultRoomData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const timer = setTimeout(
      () => setRemainingTime((prev) => (prev as number) - 1),
      1000
    );

    if (remainingTime === 1) {
      //setShowQuestionResults(true);
    }

    return () => clearTimeout(timer);
  }, [remainingTime]);

  const handleAnswer = async () => {
    if (!selectedOption || !roomData?.currentQuestion?.id) return;

    await submitAnswerExecute({
      roomId,
      questionId: roomData.currentQuestion.id,
      answer: selectedOption,
    });

    setSelectedOption(null);
  };

  const handleStartTrivia = async () => {
    await startTriviaExecute({ roomId });
  };

  const handleNextQuestion = async () => {
    await nextQuestionExecute({ roomId });
  };

  const handleEndTrivia = async () => {
    await endTriviaExecute({ roomId });
  };

  const handleJoinTriviaRoom = async () => {
    await joinTriviaRoomExecute({ roomId, nickname: user?.email });
  };

  const renderPlayers = () => {
    if (!roomData?.players) {
      return <Typography>No hay jugadores en este room.</Typography>;
    }

    return (
      <Box>
        <Typography variant="h6">Jugadores en el room:</Typography>
        {Object.entries(roomData.players).map(
          ([userId, { nickname, score }]) => (
            <Typography key={userId}>
              {nickname} - {score} puntos
            </Typography>
          )
        )}
      </Box>
    );
  };

  const anyError =
    startTriviaError ||
    submitAnswerError ||
    nextQuestionError ||
    joinTriviaRoomError ||
    endTriviaError;

  if (!roomData || roomData.ownerId === '') {
    return <Typography>No se encontraron datos para este room.</Typography>;
  }

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {roomData?.name}
          </Typography>
          {!isPlayerInRoom && !isOwner && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleJoinTriviaRoom}
            >
              Join Trivia
            </Button>
          )}
          {roomData?.status === 'waiting' && isOwner && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleStartTrivia}
            >
              Start trivia
            </Button>
          )}
          {isOwner &&
            remainingTime === 0 &&
            roomData?.status === 'in_progress' && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleNextQuestion}
              >
                Siguiente Pregunta
              </Button>
            )}
          {isOwner && roomData?.status === 'finished' && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleEndTrivia}
            >
              Finalizar trivia
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box className="trivia-room">
        <Box className="trivia-room-aside">{renderPlayers()}</Box>
        <Divider orientation="vertical" />
        <Box className="trivia-room-content">
          {(!roomData ||
            startTriviaLoading ||
            submitAnswerLoading ||
            endTriviaLoading ||
            joinTriviaRoomLoading ||
            nextQuestionLoading) && <Backdrop />}
          {anyError && (
            <Typography variant="body2" color="error" sx={{ my: 2 }}>
              {anyError.message}
            </Typography>
          )}
          {roomData?.status === 'waiting' && (
            <Box>
              <Typography variant="h4">
                Esperando que host inicie partida...
              </Typography>
            </Box>
          )}

          {roomData?.status === 'in_progress' && roomData.currentQuestion && (
            <Box className="trivia-room-inprogress">
              <Typography variant="h5">
                {roomData.currentQuestion.question}
              </Typography>
              <Box>
                <Typography>Tiempo restante:</Typography>
                <Typography variant="h5">{remainingTime}s</Typography>
              </Box>
              {remainingTime === 0 && <QuestionResults roomData={roomData} />}
              <Box className="trivia-room-inprogress-inprogress">
                {roomData.currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedOption === option.value ? 'contained' : 'outlined'
                    }
                    onClick={() => setSelectedOption(option.value)}
                    disabled={!!selectedOption || remainingTime === 0}
                  >
                    {option.value}
                  </Button>
                ))}
              </Box>

              {!isOwner && (
                <Button
                  variant="contained"
                  onClick={handleAnswer}
                  disabled={!selectedOption}
                >
                  Enviar Respuesta
                </Button>
              )}
            </Box>
          )}
          {roomData?.status === 'finished' && roomData.players && (
            <Podium players={roomData.players} />
          )}
        </Box>
      </Box>
    </>
  );
};
