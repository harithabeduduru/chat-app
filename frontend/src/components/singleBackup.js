import { React, useState, useEffect} from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Text } from '@chakra-ui/layout'
import { IconButton } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons'; 
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { FormControl, Spinner,useToast } from '@chakra-ui/react';
import { Input } from '@chakra-ui/input'
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast()
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);



const fetchMessages = async() => {
  if (!selectedChat) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoading(true);

    const { data } = await axios.get(
      `/api/message/${selectedChat._id}`,
      config
    );

    //console.log(messages)
    setMessages(data);
    setLoading(false);

    socket.emit("join chat",selectedChat._id);
  } catch (error) {
    toast({
      title: 'Error Occured!',
      description: 'Failed to send the Message',
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'bottom'
    });
  }
};

useEffect(() => {
  fetchMessages();
  
},[selectedChat])


  const sendMessage = async(event) => {
    if (event.key === "Enter" && newMessage){
      try {
        const config = {
          headers : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,

          },
        };

        setNewMessage("");
        const {data} = await axios.post('/api/message', {
          content:newMessage,
          chatId:selectedChat._id,
        },
        config
      );

      console.log(data)
      
      setMessages([...messages, data]);

      }catch (error) {
        toast({
          title: 'Error Occured!',
          description: 'Failed to send the Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom'
        });
      }
    }
  }

useEffect(() => {
  return() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connection', () => setSocketConnected(true));
  }
}, [])


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing Indicator Logic
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            { !selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages} 
                  /> 
                </>
              )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
            <Spinner 
              size='xl'
              w={20}
              h={20}
              alignSelf='center'
              margin='auto'

            />
          ) : ( 
             <div className='messages'>
                <ScrollableChat messages={messages}/>

             </div>
          )}

            <FormControl 
              onKeyDown={sendMessage}
              isRequired
              mt={3}>
                
                <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
                

            </FormControl>

          </Box>
                </>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                    <Text fontSize='3xl' pb={3} fontFamily='Work sans'>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        
        </>

    )

};

export default SingleChat;