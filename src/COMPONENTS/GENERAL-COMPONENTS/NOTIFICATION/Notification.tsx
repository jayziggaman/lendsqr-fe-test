import React, { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../../../App'
import { motion } from 'framer-motion'
import "./Notification.scss"


const Notification = () => {
  const { showNotification, setShowNotification, notification, setNotification } = useAppContext()
  const { type, message } = notification

  const notificationTimer = 5000



  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), notificationTimer);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  
  return (
    <div
      className={`notification ${type} ${showNotification && message !== "" ? 'active' : ''}`}
    >
      <div className="notification-div">
        <span className="notification-message">
          {message}
        </span>

        <button onClick={() => setShowNotification(false)}>
          <CloseIcon />
        </button>

        <motion.span className="notification-timer"
          initial={{ width: '100%' }}
          animate={{ width: !showNotification ? '0%' : '100%' }}
          transition={{ duration: (notificationTimer / 1000), ease: "linear" }}
        ></motion.span>
        </div>
    </div>
  )
}

export default Notification