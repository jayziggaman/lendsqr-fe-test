import React, { createContext, useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Notification from './COMPONENTS/GENERAL-COMPONENTS/NOTIFICATION/Notification';
import Auth from './PAGES/AUTH/Auth';
import Dashboard from './PAGES/DASHBOARD/Dashboard';
import NotFound from './PAGES/NOT-FOUND/NotFound';



interface WindowDimensionsInterface {
  width: number, height: number
}


interface NotificationInterface {
  type: string, message: string
}


// Define the context interface
interface AppContextInterface {
  pathname: string;
  convertToLowercase: (text: string) => string;
  windowDimensions: WindowDimensionsInterface;
  showDashboardNav: boolean;
  setShowDashboardNav: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  notification: NotificationInterface;
  setNotification: React.Dispatch<React.SetStateAction<NotificationInterface>>;
  callNotification: (messageOptions: string[]) => void;
  handleModalClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;

}

// Create the context with a default value
export const AppContext = createContext<AppContextInterface | null>(null);

const App = () => {
  const { innerWidth, innerHeight } = window
  
  const [showDashboardNav, setShowDashboardNav] = useState<boolean>(false)
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensionsInterface>({
    width: innerWidth, height: innerHeight
  })
  const [showNotification, setShowNotification] = useState(false)
  const [notification, setNotification] = useState({
    type: '', message: ''
  })

  const location = useLocation();
  const { pathname } = location;



  // Update windowDimensions state when the window resizes.
  useEffect(() => {
    const windowResize = () => {
      const { innerWidth, innerHeight } = window
      setWindowDimensions({width: innerWidth, height: innerHeight})
    }

    window.addEventListener('resize', windowResize)

    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [])



  // Update root div display based on pathname and the size of the screen.
  useEffect(() => {
    const rootDiv = document.getElementById('root');

    if (rootDiv) {
      if (windowDimensions.width >= 1400) {
        if (pathname === '/dashboard') {
          rootDiv.style.display = 'grid';
          
        } else {
          rootDiv.style.display = 'block';
        }

      } else {
        rootDiv.style.display = 'block';
      }
    }
  }, [pathname, windowDimensions]);


  // A function thet converts a given text to lowercase. This is done to prevent of the toLowerCase method all over the app.
  function convertToLowercase(text: string) {
    return text ? text.toLowerCase() : ''
  }

  

  // This function prevents a modal from closing when the user clicks inside it. This is because the window object is set with event listeners to close modals whenever they are open.
  const handleModalClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation(); 
  };




  // This functions mimicks an async operation. It receives an array of message options (a good message & a bad message). This mimicks a successful operation and an unsuccessful one.
  function callNotification(messageOptions: string[]) {
    setShowNotification(true)

    const notificationOptions = ['good', 'bad']
    const index = Math.floor(Math.random() * 2)

    setNotification({
      type: notificationOptions[index],
      message: messageOptions[index]
    })
  }






  return (
    <AppContext.Provider
      value={{
        pathname, convertToLowercase, windowDimensions, showDashboardNav, setShowDashboardNav, showNotification, setShowNotification, notification, setNotification, callNotification, handleModalClick
      }}
    >
      <Notification />
      
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppContext.Provider>
  );
};

export default App;


export function useAppContext() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}