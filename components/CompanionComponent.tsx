"use client";

import { getSubjectColor } from "@/constants"
import { vapi } from "@/lib/vapi.sdk";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Lottie, type LottieHandle } from "lottie-react";
import soundWaves from "@/constants/soundwaves.json";
import { configureAssistant } from "@/lib/utils";
import { addToSessionHistory } from "@/lib/actions/companion.action";

enum CallStatus {
  INACTIVE = 'inactive',
  'CONNECTING' = 'connecting',
  ACTIVE = 'active',
  ENDED = 'ended'
}

type DisplayMessage = {
  role: MessageRoleEnum;
  content: string;
  isPartial: boolean;
};

const CompanionComponent = ({ companionId, userName, userImage, name, subject, topic, voice, style, duration }: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setisMuted] = useState(false);
  const lottieRef = useRef<LottieHandle>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);

  useEffect(() => {
    // Simulate call status changes for demonstration purposes
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setisMuted(false);
      void addToSessionHistory(companionId).catch((error) => {
        console.error('Failed to save session history:', error);
      });
    };
    const onCallEnd = () => {
      setCallStatus(CallStatus.ENDED);
      setisMuted(false);
    };
    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcript.trim()) {
        const isPartial = message.transcriptType === 'partial';
        const newMessage = { role: message.role, content: message.transcript, isPartial };

        setMessages((previousMessages) => {
          const lastMessage = previousMessages.at(-1);

          if (isPartial && lastMessage?.role === message.role) {
            const isSameTranscript = lastMessage.content === newMessage.content;
            const isCumulativeTranscript = newMessage.content.startsWith(lastMessage.content);
            const isOlderTranscript = lastMessage.content.startsWith(newMessage.content);
            const content = isCumulativeTranscript
              ? newMessage.content
              : isSameTranscript || isOlderTranscript
                ? lastMessage.content
                : `${lastMessage.content} ${newMessage.content}`;

            return [...previousMessages.slice(0, -1), { ...newMessage, content }];
          }

          if (!isPartial && lastMessage?.isPartial && lastMessage.role === message.role) {
            const finalTextContainsPartial = newMessage.content.startsWith(lastMessage.content);
            const finalTextIsAlreadyIncluded = lastMessage.content.endsWith(` ${newMessage.content}`)
              || lastMessage.content === newMessage.content;
            const content = finalTextContainsPartial
              ? newMessage.content
              : finalTextIsAlreadyIncluded
                ? lastMessage.content
              : `${lastMessage.content} ${newMessage.content}`;

            return [...previousMessages.slice(0, -1), { ...newMessage, content }];
          }

          if (!isPartial && lastMessage?.role === message.role) {
            const isDuplicate = lastMessage.content === newMessage.content;
            const content = isDuplicate
              ? lastMessage.content
              : `${lastMessage.content} ${newMessage.content}`;

            return [...previousMessages.slice(0, -1), { ...newMessage, content }];
          }

          return [...previousMessages, newMessage];
        });
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: unknown) => {
      setCallStatus(CallStatus.ENDED);
      console.error(
        'Call error:',
        error instanceof Error
          ? error.message
          : JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);

      if (vapi.getDailyCallObject()) {
        void vapi.stop().catch(() => undefined);
      }
    }
  }, []);

  const toggleMicrophone = () => {
    if (callStatus !== CallStatus.ACTIVE) {
      return;
    }

    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setisMuted(!isMuted);
  }

  useEffect(() => {
    if (lottieRef.current) {
      if (isSpeaking) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isSpeaking]);

  const handleCall = async () => {
    if (callStatus === CallStatus.CONNECTING || callStatus === CallStatus.ACTIVE) {
      return;
    }

    if (vapi.getDailyCallObject()) {
      await vapi.stop();
    }

    setCallStatus(CallStatus.CONNECTING);
    const variableValues = {
      subject,
      topic,
      style,
    };
    const assistanceOverrides = {
      variableValues,
      clientMessages: ['transcript'],
      serverMessages: [],
    } as unknown as Parameters<typeof vapi.start>[1];

    try {
      await vapi.start(configureAssistant(voice, style), assistanceOverrides);
    } catch (error) {
      console.error('Failed to start call:', error);
      await vapi.stop().catch(() => undefined);
      setCallStatus(CallStatus.ENDED);
    }
  }
  const handleDisconnect = async () => {
    await vapi.stop();
  }

  return (
    <section className='flex min-h-[70vh] flex-col'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className='companion-section '>
          <div className='companion-avatar' style={{backgroundColor: getSubjectColor(subject)}}>
            <div className={cn('absolute transition-opacity duration-1000', (callStatus === CallStatus.ENDED || callStatus === CallStatus.INACTIVE) ? 'opacity-100' : 'opacity-0', callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse' )}>
              <Image src={`/icons/${subject}.svg`} alt={subject} width={36} height={36} />
            </div>
            <div className={cn('absolute transition-opacity duration-1000', isSpeaking && 'opacity-100')}>
              <Lottie
                lottieRef={lottieRef}
                src={soundWaves}
                autoplay={false}
                className='companion-lottie'
              />
            </div>
          </div>
          <p className='font-bold text-2xl'>{name}</p>
        </div>
        <div className='user-section'>
          <div className='user-avatar'>
            <Image src={userImage} alt={userName} width={136} height={130} />
            <p className='font-bold text-2xl'>{userName}</p>
          </div>
          <button className='btn-mic' onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
            <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt={isMuted ? 'Mic Off' : 'Mic On'} width={24} height={24} />
            <p className='text-sm'>{isMuted ? 'Unmute' : 'Mute'}</p>
          </button>
          <button className={cn(
            'rounded-lg py-2 cursor-pointer transition-colors w-full text-black',
            callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-green-500'
          )} onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall} disabled={callStatus === CallStatus.CONNECTING}>
            {callStatus === CallStatus.ACTIVE
              ? 'End Call'
              : callStatus === CallStatus.CONNECTING
                ? 'Connecting...'
                : 'Start Call'}
          </button>
        </div>
      </section>
      <section className='transcript'>
        <p className='w-full text-lg font-bold'>Conversation</p>
        <div className='transcript-message'>
          {messages.length === 0 ? (
            <p className='text-muted-foreground text-base'>Your conversation will appear here.</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  'mb-3 w-full min-w-0 whitespace-pre-wrap wrap-break-word rounded-lg border px-3 py-2 text-sm',
                  message.role === 'assistant'
                    ? 'border-border bg-muted text-foreground'
                    : 'border-primary bg-primary text-primary-foreground',
                  message.isPartial && 'opacity-70'
                )}
              >
                <p className='font-medium text-xs uppercase tracking-wide opacity-70'>
                  {message.role === 'assistant' ? 'Assistant' : 'You'}
                </p>
                <p>{message.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  )
}

export default CompanionComponent