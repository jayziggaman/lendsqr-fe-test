import { ReactComponent as LargeLogoIcon } from "../../../GENERAL-ICONS/LARGE_LOGO_ICON.svg"
import { ReactComponent as SmallLogoIcon } from "../../../GENERAL-ICONS/SMALL_LOGO_ICON.svg"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import adedejiAvatar from "./HEADER_IMAGES/Adedeji.png"
import michaelAvatar from "./HEADER_IMAGES/Michael.png"
import xavierAvatar from "./HEADER_IMAGES/Xavier.jpg"
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import "./Header.scss"
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useAppContext } from "../../../App";



interface UserAccountInterface {
  name: string;
  avatar: string;
}


const Header = () => {
  const { windowDimensions, showDashboardNav, setShowDashboardNav } = useAppContext()
  const { width: windowWidth } = windowDimensions

  // Dummy data. Normally this would be the list of accounts the user has.
  const [userAccounts, setUserAccounts] = useState<UserAccountInterface[]>([
    {
      name: "Adedeji",
      avatar: adedejiAvatar
    },
    {
      name: "Michael O.",
      avatar: michaelAvatar
    },
    {
      name: "Xavier",
      avatar: xavierAvatar
    },
  ])
  // The current account the user is on.
  const [currentAccount, setCurrentAccount] = useState<UserAccountInterface>(userAccounts[0])
  const veryLargeScreen = 1400
  const largeScreen = 1000
  const midScreen = 850


  // This would be an asynchronous function that would use the new value (from the onChange event listener) of the select and fetch the correct account.
  function updateUserAccount(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target) {
      const newAccountName = e.target.value

      const newAccount = userAccounts.find(account => account.name === newAccountName)
      if (newAccount) {
        setCurrentAccount(newAccount)
      }
    }
  }


  return (
    <header className="app-header">
      {windowWidth < veryLargeScreen &&
        <button className="toggle-nav-btn"
          onClick={() => setShowDashboardNav(!showDashboardNav)}
        >
          {showDashboardNav ?
            <CloseIcon />
            :
            <MenuIcon />
          }
        </button>
      }

      <div className="header-logo">
        {windowWidth >= midScreen ?
          <LargeLogoIcon />
          :
          <SmallLogoIcon />
        }
      </div>

      <label htmlFor="header-search">
        <input type="text" name="header-search" id="header-search"
          placeholder='Search for anything'
        />

        <span>
          <SearchOutlinedIcon />
        </span>
      </label>

      <div className="header-details">
        {/* Rendering the less important components of the header in larger screens only to prevent a cramped look. */}
        {windowWidth >= largeScreen &&
          <>
            <Link to=''>
              Docs
            </Link>

            <button>
              <NotificationsOutlinedIcon />
            </button>
          </>
        }

        

        <div className="header-user-info">
          <div className="user-avatar">
            <img src={currentAccount.avatar} alt="" />
          </div>

          <div className="user-account">
            <select name="switch-account" id="switch-account"
              className="username"
              onChange={e => updateUserAccount(e)}
            >

              {userAccounts.map(account => {
                const { name } = account
                
                return (
                  <option key={name} value={name}>{name}</option>
                )
              })}
            </select>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header