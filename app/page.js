'use client'
import Image from "next/image";
import {useState} from "react";
import {Box, Stack, TextField, Button} from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant', 
    content: "Welcome to HeadStarterAI's Customer Support! I’m here to assist you with any\
    questions or issues related to our AI-powered interview platform designed specifically for software\
    engineering jobs. How can I assist you today?"}]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages)  => [
      ...messages, 
      {role: 'user', content: message},
      {role: 'assistant', content: ''}
    ])
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true});
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return ([
            ...otherMessages,
            {role: lastMessage.role, content: lastMessage.content + text}
          ]);
        })
        return reader.read().then(processText);
      })
    });
  }

  return (
      <Box 
            width="100vw" 
            height="100vh" 
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Stack
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
              width="600px"
              height="700px"
              border="1px solid black"
              p={2}
            >
            <Stack
              spacing={2}
              direction="column"
              flexGrow={1}
              overflow="auto"
              maxHeight="100%">
                {messages.map((message, index) => (
                  <Box key={index} display="flex" justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                    <Box
                      p={1}
                      borderRadius={5}
                      bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                      color="white"
                    >
                      {message.content}
                    </Box>
                  </Box>
                ))}
                </Stack>
                <Stack spacing={2} direction="row">
                  <TextField
                    label="Message"
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}/>
                  <Button variant="contained" onClick={sendMessage}>Send</Button>
                </Stack>
            </Stack>
          </Box>
      )
}
