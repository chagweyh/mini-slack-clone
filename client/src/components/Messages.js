import React, { useState, useEffect, useRef } from 'react';
import { distanceInWordsToNow } from 'date-fns';
import socket from '../utils/socket';
import styled from 'styled-components';
import Feedback from './Feedback';

const StyledMessages = styled.div`
  padding: 10px 20px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin: 10px auto;
  display: flex;
`;

const Avatar = styled.img`
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;

const MessageInfo = styled.div`
  flex: 1 1;
  margin-left: 12px;
  span {
    display: inline-block;
  }
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 15px;
`;

const MessageDate = styled.span`
  font-size: 14px;
  margin-left: 10px;
  color: #99a5b1;
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 15px;
`;

const Info = styled.h2``;

function Messages({ currentChannel, messages }) {
  const messagesEl = useRef(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // scroll to the bottom
    messagesEl.current.scrollTop = messagesEl.current.scrollHeight;
  });
  useEffect(() => {
    socket.on('typing', (data) => {
      if (!data) {
        setInfo(null);
      } else {
        const { username, channel } = data;
        // verify if the sender and the receiver of
        // the message are on the same channel or not
        channel === currentChannel.name ? setInfo(`${username} is typing a message`) : setInfo(null);
      }
    });
  }, [currentChannel]);
  return (
    <StyledMessages ref={messagesEl}>
      {messages.map((message) => (
        <Message key={message._id}>
          <Avatar src={message.createdBy.gravatar} />
          <MessageInfo>
            <Username>{message.createdBy.username}</Username>
            <MessageDate>
              {distanceInWordsToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </MessageDate>
            <MessageText>{message.text}</MessageText>
          </MessageInfo>
        </Message>
      ))}
      {info && <Feedback text={info} />}
    </StyledMessages>
  );
}

export default Messages;
