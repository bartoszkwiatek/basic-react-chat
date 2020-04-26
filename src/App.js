import React, { useEffect, useState, useRef} from 'react';
import './App.css';
import * as io from 'socket.io-client';

const App = () => {
  // w celu uzycia wartosci w useEffect musze skorzystac z referencji tworzonej przez useRef
  const connectionRef = useRef();
  const messagesRef = useRef([]);

  const [messages, setMessages] = useState([]);
  const [myMessage, setMyMessages] = useState(messagesRef.current);

  useEffect(() => {
    // sprawdzam czy polaczenie zostalo juz nawiazane
    if (connectionRef.current === undefined) {
      // nawiazuje polaczenie
      connectionRef.current = io.connect('https://chat-server.fbg.pl');
      connectionRef.current.on('chat message', (message) => {
        messagesRef.current = [...messagesRef.current, message];
        setMessages(messagesRef.current);
      })
    }}, []);

  const handleMessageChange = (event) => {
    setMyMessages(event.target.value)
  }

  const handleSend = () => {
    connectionRef.current.emit('chat message', {
      text: myMessage,
      authorId: 'Bartek',
    });
  };
  return (<>
    <div>
      <input onChange={handleMessageChange} value={myMessage} />
      <button onClick={handleSend}>Send</button>
    </div>
    <ul>
      {messages.map((item, index) => <li key={index}><b>{item.authorId}:</b> {item.text}</li>)}
    </ul>
  </>
  );
}

export default App;
