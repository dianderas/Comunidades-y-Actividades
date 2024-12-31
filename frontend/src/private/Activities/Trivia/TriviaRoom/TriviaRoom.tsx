import { Box, Button, Typography } from '@mui/material';
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

interface Question {
  id: string;
  question: string;
  options: { value: string }[];
  timeLimit: number;
}

interface RoomData {
  status: 'waiting' | 'in_progress' | 'finished';
  currentQuestion: Question | null;
  currentQuestionStartTime: number | null;
  currentQuestionResults: Record<string, number>;
  ownerId: string;
  questions: Question[];
  answers: Record<string, Record<string, string>>;
  results: Record<string, number>;
  players?: Record<string, { nickname: string; score: number }>;
}

const defaultRoomData: RoomData = {
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
  const [showQuestionResults, setShowQuestionResults] = useState(false);

  const isOwner = roomData?.ownerId === user?.uid;
  const isPlayerInRoom =
    roomData?.players && user && user.uid in roomData.players;

  if (!roomId) {
    navigate(`/community/${communityId}`);
  }

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
    if (!roomId) return;

    const roomRef = getRoomRef(roomId);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        console.log('data', data);
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
          setShowQuestionResults(false);
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
      setShowQuestionResults(true); // Mostrar resultados al acabar el tiempo
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

  const renderQuestionResults = () => (
    <Box>
      <Typography variant="h6">Resultados de la pregunta</Typography>
      {roomData?.currentQuestionResults &&
        Object.entries(roomData.currentQuestionResults).map(
          ([option, count]) => (
            <Typography key={option}>
              {option}: {count} respuestas
            </Typography>
          )
        )}
    </Box>
  );

  const renderFinalResults = () => (
    <Box>
      <Typography variant="h4">Resultados Finales</Typography>
      {Object.entries(roomData?.results || {}).map(([playerId, points]) => (
        <Typography key={playerId}>
          {playerId}: {points} puntos
        </Typography>
      ))}
      {isOwner && (
        <Button variant="contained" onClick={handleEndTrivia}>
          Finalizar trivia
        </Button>
      )}
    </Box>
  );

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
    <Box>
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
          <Typography>Esperando a jugadores...</Typography>
          {renderPlayers()}
          {isOwner && (
            <Button variant="contained" onClick={handleStartTrivia}>
              Start trivia
            </Button>
          )}
          {!isPlayerInRoom && !isOwner && (
            <Button variant="contained" onClick={handleJoinTriviaRoom}>
              Join Trivia
            </Button>
          )}
        </Box>
      )}

      {roomData?.status === 'in_progress' && roomData.currentQuestion && (
        <Box>
          <Typography variant="h5">
            {roomData.currentQuestion.question}
          </Typography>
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
          <Typography>Tiempo restante: {remainingTime}s</Typography>
          {!isOwner && (
            <Button
              variant="contained"
              onClick={handleAnswer}
              disabled={!selectedOption}
            >
              Enviar Respuesta
            </Button>
          )}
          {isOwner && remainingTime === 0 && (
            <Button variant="contained" onClick={handleNextQuestion}>
              Siguiente Pregunta
            </Button>
          )}
          {showQuestionResults && renderQuestionResults()}
        </Box>
      )}
      {roomData?.status === 'finished' && renderFinalResults()}
    </Box>
  );
};
