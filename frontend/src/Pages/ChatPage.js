import React from 'react';
import { Box } from '@chakra-ui/layout';
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/miscellaneous/Sidedrawer';
import ChatBox from '../components/ChatBox'
import MyChats from './MyChats';
import { useSafeLayoutEffect } from '@chakra-ui/react';
import { useState } from 'react';
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);


  return <div style={{ width: "100%" }}>
  { user && <SideDrawer /> }
    <Box
      display='flex'
      justifyContent='space-between'
      w='100%'
      h='91.5vh'
      p='10px'
    >
    { user &&  <MyChats fetchAgain={fetchAgain}/> }
    { user &&  <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> }

    </Box>

  </div>
}

export default ChatPage
