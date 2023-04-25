import {
  Heading,
  Box,
  Button,
  HStack,
  Image,
  Input,
  Select,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useConversation, AudioDeviceConfig, ConversationConfig } from "vocode";
import MicrophoneIcon from "./MicrophoneIcon";
import AudioVisualization from "./AudioVisualization";
import { isMobile } from "react-device-detect";
import { ChatGPTAgentConfig } from "vocode";

const Conversation = ({
  config,
  setPromptPreamble,
}: {
  config: Omit<ConversationConfig, "audioDeviceConfig">;
  setPromptPreamble: (value: string) => void;
}) => {
  const [audioDeviceConfig, setAudioDeviceConfig] =
    React.useState<AudioDeviceConfig>({});
  const [inputDevices, setInputDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = React.useState<MediaDeviceInfo[]>(
    []
  );
  const { status, start, stop, analyserNode } = useConversation(
    Object.assign(config, { audioDeviceConfig })
  );

  React.useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        setInputDevices(
          devices.filter(
            (device) => device.deviceId && device.kind === "audioinput"
          )
        );
        setOutputDevices(
          devices.filter(
            (device) => device.deviceId && device.kind === "audiooutput"
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });

  const handlePromptPreambleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPromptPreamble(e.target.value);
  };

  const startConversation = () => {
    if (status === "connected") {
      stop();
    } else {
      start();
    }
  };

  return (
    <VStack>
      <Heading>GPT Sensei</Heading>

      <Image
        src="https://i.imgur.com/UNYegqr.png"
        alt="Example Image"
        width="300px"
        height="auto"
        onError={() => console.log("Failed to load image")}
      />
      <Input
        placeholder="Enter Agent's prompt Preamble"
        value={(config.agentConfig as ChatGPTAgentConfig).promptPreamble}
        onChange={handlePromptPreambleChange}
      />
      <Button onClick={startConversation}>
        {status === "connected" ? "End" : "Start Conversation"}
      </Button>
      {/*analyserNode && <AudioVisualization analyser={analyserNode} />*/}
      {/*<Button
        variant="link"
        disabled={["connecting", "error"].includes(status)}
        onClick={status === "connected" ? stop : start}
        position={"absolute"}
        top={"45%"}
        left={"50%"}
        transform={"translate(-50%, -50%)"}
      >
        <Box boxSize={75}>
          <MicrophoneIcon color={"#ddfafa"} muted={status !== "connected"} />
        </Box>
      </Button>
      <Box boxSize={50} />*/}
      {status === "connecting" && (
        <Box
          position={"absolute"}
          top="57.5%"
          left="50%"
          transform={"translate(-50%, -50%)"}
          padding={5}
        >
          <Spinner color="#FFFFFF" />
        </Box>
      )}
    </VStack>
  );
};

export default Conversation;
