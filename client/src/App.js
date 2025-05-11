import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react"
import Navbar from './Component/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import Allroutes from "../src/Allroutes"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // <-- Updated import
import Drawersliderbar from '../src/Component/Leftsidebar/Drawersliderbar'
import Createeditchannel from './Pages/Channel/Createeditchannel';
import Videoupload from './Pages/Videoupload/Videoupload';
import { fetchallchannel } from './action/channeluser';
import { getallvideo } from './action/video';
import { getallcomment } from './action/comment';
import { getallhistory } from './action/history';
import { getalllikedvideo } from './action/likedvideo';
import { getallwatchlater } from './action/watchlater';
import CallRoom from './Pages/CallRoom/CallRoom';  // <-- Add the import for CallRoom

function App() {
  const [toggledrawersidebar, settogledrawersidebar] = useState({
    display: "none"
  });
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchallchannel())
    dispatch(getallvideo())
    dispatch(getallcomment())
    dispatch(getallhistory())
    dispatch(getalllikedvideo())
    dispatch(getallwatchlater())
  }, [dispatch])

  const toggledrawer = () => {
    if (toggledrawersidebar.display === "none") {
      settogledrawersidebar({
        display: "flex",
      });
    } else {
      settogledrawersidebar({
        display: "none",
      });
    }
  }
  
  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false);
  const [videouploadpage, setvideouploadpage] = useState(false);
  
  return (
    <Router>
      {
        videouploadpage && <Videoupload setvideouploadpage={setvideouploadpage} />
      }
      {editcreatechanelbtn && (
        <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn} />
      )}
      <Navbar seteditcreatechanelbtn={seteditcreatechanelbtn} toggledrawer={toggledrawer} />
      <Drawersliderbar toggledraw={toggledrawer} toggledrawersidebar={toggledrawersidebar} />
      
      {/* Add the route for CallRoom */}
      <Routes>
        <Route path="/" element={<Allroutes seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage} />} />
        
        <Route path="/call" element={<CallRoom />} />  {/* This is where CallRoom will be rendered */}
      </Routes>
    </Router>
  );
}

export default App;
