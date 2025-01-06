import { Box } from '@mui/material';
import { onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomRef } from '../../services/firebase';
import { RoomData } from '../../services/firebase/dtos';
import { HudTopbar, RemainingTimeDisplay, TopPlayersList } from './components';
import './HudTool.css';
import { QuestionResults } from '../Activities/Trivia/TriviaRoom/components';

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

export const HudTool = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

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
    if (remainingTime === null || remainingTime < 0) return;

    const timer = setTimeout(
      () => setRemainingTime((prev) => (prev as number) - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [remainingTime]);

  console.log(remainingTime);

  return (
    <Box className="container">
      {roomData && roomData?.status !== 'finished' && (
        <>
          <Box className="hud-topbar">
            <HudTopbar
              triviaTitle={roomData?.name}
              currentQuestion={roomData?.currentQuestion}
              status={roomData?.status}
            />
          </Box>
          <Box className="hud-aside">
            <TopPlayersList players={roomData?.players || {}} />
          </Box>
          {remainingTime !== null && remainingTime >= 0 && (
            <RemainingTimeDisplay remainingTime={remainingTime} />
          )}
          <Box className="hud-result">
            {remainingTime === -1 && (
              <QuestionResults roomData={roomData} showTitle={false} />
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
