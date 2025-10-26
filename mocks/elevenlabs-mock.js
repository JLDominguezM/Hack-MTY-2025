// Mock para @elevenlabs/react-native
import React from 'react';

export const ElevenLabsProvider = ({ children }) => children;

export const useConversation = () => ({
  status: 'disconnected',
  isSpeaking: false,
  lastAgentMessage: null,
  startSession: () => Promise.resolve(),
  sendUserMessage: () => Promise.resolve(),
  endSession: () => Promise.resolve(),
});