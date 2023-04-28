import "@fontsource/inter";
import "./App.css";
import React from "react";

import {
  Box,
  ChakraProvider,
  Flex,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import Conversation from "./components/Conversation";

import { isChrome, isMobile, isSafari } from "react-device-detect";
import { WarningIcon } from "@chakra-ui/icons";
import {
  DeepgramTranscriberConfig,
  LLMAgentConfig,
  AzureSynthesizerConfig,
  VocodeConfig,
  EchoAgentConfig,
  ChatGPTAgentConfig,
  RESTfulUserImplementedAgentConfig,
  WebSocketUserImplementedAgentConfig,
} from "vocode";
import { inject } from "@vercel/analytics";

inject();

const App = () => {
  const transcriberConfig: Omit<
    DeepgramTranscriberConfig,
    "samplingRate" | "audioEncoding"
  > = {
    type: "transcriber_deepgram",
    chunkSize: 2048,
    endpointingConfig: {
      type: "endpointing_punctuation_based",
      time_cutoff_seconds: 1.0, // 1.0seconds
    } as PunctuationEndpointingConfig, // Use the new type here
  };

  const synthesizerConfig: Omit<
    AzureSynthesizerConfig,
    "samplingRate" | "audioEncoding"
  > = {
    type: "synthesizer_azure",
    shouldEncodeAsWav: true,
    voiceName: "en-US-SteffanNeural",
  };
  const vocodeConfig: VocodeConfig = {
    apiKey: process.env.REACT_APP_VOCODE_API_KEY || "",
  };

  const [promptPreamble, setPromptPreamble] = React.useState(
    "you are an English Teacher. Start a general conversation. Start practicing role-playing English conversation.This time it is a scene of self-introduction with someone you have just met for the first time. Please introduce yourself and engage in daily conversation as if you and I were meeting for the first time.- Your name is Sensei - I am a beginner in English. I want to practice my English so you don't talk too much. One question per reply.End with a question sentence if at all possible."
  );

  const agentConfig: ChatGPTAgentConfig = {
    type: "agent_chat_gpt",
    initialMessage: { type: "message_base", text: "Hello!" },
    promptPreamble,
    endConversationOnGoodbye: true,
    generateResponses: true,
    cutOffResponse: {},
  };
  // add this to the agentConfig object
  type PunctuationEndpointingConfig = {
    type: "endpointing_punctuation_based";
    time_cutoff_seconds: number;
  };

  return (
    <ChakraProvider>
      {(isMobile || !isChrome) && !isSafari ? (
        <VStack padding={10} alignItems="center">
          <WarningIcon boxSize={100} />
          <Text paddingTop={4}>
            This demo works on: Chrome (desktop) and Safari (desktop, mobile)
            only!
          </Text>
        </VStack>
      ) : (
        <Conversation
          config={{
            transcriberConfig,
            agentConfig,
            synthesizerConfig,
            vocodeConfig,
          }}
          setPromptPreamble={setPromptPreamble}
        />
      )}
    </ChakraProvider>
  );
};

export default App;
