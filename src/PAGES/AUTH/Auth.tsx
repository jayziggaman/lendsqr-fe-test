import React from 'react'
import "./Auth.scss"
import { ReactComponent as AuthIcon } from "./AUTH-ICONS/AUTH_ICON.svg"
import { ReactComponent as LogoIcon } from "../../GENERAL-ICONS/LARGE_LOGO_ICON.svg"
import { useState } from 'react'
import { useAppContext } from '../../App'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const { setShowNotification, setNotification, windowDimensions } = useAppContext()
  const { width: windowWidth } = windowDimensions

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()


  const authenticateUser = () => {
    if (email === '' || password === '') {
      setShowNotification(true)
    
      setNotification({
        type: "bad",
        message: "Fill in the form to sign in"
      })

    } else {
      navigate('/dashboard', { replace: true })
    }
  }


  return (
    <main className="auth-main">
      <section className="auth-main-section">
        <div className='auth-logo'>
          <LogoIcon />
        </div>

        {windowWidth >= 800 &&
          <div className="auth-cartoon">
            <AuthIcon />
          </div>
        }

        <form className="auth-form">
          <header className="auth-form-header">
            <h1>
              Welcome!
            </h1>

            <p>
              Enter details to login.
            </p>
          </header>


          <div className="auth-form-details">
            <label htmlFor="user-email">
              <input type="email" name='user-email' id='user-email' value={email}
                placeholder='Email' onChange={e => setEmail(e.target.value)} required
              />
            </label>
            
            <label htmlFor="user-password">
              <input type={showPassword ? "text" : "password"} name='user-password' id='user-password'
                value={password} placeholder='Password' onChange={e => setPassword(e.target.value)}
                required
              />

              <button
                onClick={e => {
                  e.preventDefault()
                  setShowPassword(!showPassword)
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </label>

            <button className='forgot-password-btn'
              onClick={e => e.preventDefault()}
            >
              FORGOT PASSWORD?
            </button>

            <button className='log-in-btn'
              onClick={e => {
                e.preventDefault()
                authenticateUser()
              }}
            >
              LOG IN
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Auth