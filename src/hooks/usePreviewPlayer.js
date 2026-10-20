/* eslint-disable react-hooks/immutability -- expo-audio players are controlled by assigning properties (player.muted = …) */
import { useCallback, useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolvePreview } from '../services/deezer';

const MUTED_KEY = 'muted';

setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

// One looping audio player for the song attached to whichever quote is on screen.
export function usePreviewPlayer() {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [muted, setMutedState] = useState(false);
  const requestId = useRef(0);
  const mutedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(MUTED_KEY)
      .then((val) => val && setMutedState(JSON.parse(val)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    player.muted = muted;
  }, [muted, player]);

  const play = useCallback(
    async (quote) => {
      const id = ++requestId.current;
      player.pause();
      const uri = await resolvePreview(quote);
      // a newer play()/stop() happened while we were resolving
      if (id !== requestId.current) return;
      if (!uri) return;
      player.replace({ uri });
      player.loop = true;
      player.muted = mutedRef.current;
      player.play();
    },
    [player]
  );

  const stop = useCallback(() => {
    requestId.current++;
    player.pause();
  }, [player]);

  const setMuted = useCallback((val) => {
    setMutedState(val);
    AsyncStorage.setItem(MUTED_KEY, JSON.stringify(val)).catch(() => {});
  }, []);

  return { play, stop, muted, setMuted, playing: status.playing, buffering: status.isBuffering };
}

// Tap-to-preview for search results: one track at a time, no looping.
export function useTrackPreview() {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const sub = player.addListener('playbackStatusUpdate', (s) => {
      if (s.didJustFinish) setCurrentId(null);
    });
    return () => sub.remove();
  }, [player]);

  const toggle = useCallback(
    (track) => {
      if (currentId === track.id) {
        player.pause();
        setCurrentId(null);
        return;
      }
      player.replace({ uri: track.preview });
      player.play();
      setCurrentId(track.id);
    },
    [currentId, player]
  );

  const stop = useCallback(() => {
    player.pause();
    setCurrentId(null);
  }, [player]);

  return { toggle, stop, currentId, loading: currentId != null && !status.playing };
}
