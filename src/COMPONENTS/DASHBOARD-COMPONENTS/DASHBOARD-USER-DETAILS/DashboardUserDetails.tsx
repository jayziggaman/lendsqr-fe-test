import React, { useEffect, useState } from 'react'
import "./DashboardUserDetails.scss"
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import { NavLink } from 'react-router-dom'
import { useDashboardContext } from '../../../PAGES/DASHBOARD/Dashboard';
import { ReactComponent as UsersIcon } from "./DASHBOARD_USERDETAILS_ICONS/NoUserIcon.svg"
import { ReactComponent as ActiveTierStarIcon } from "./DASHBOARD_USERDETAILS_ICONS/ActiveTierStarIcon.svg"
import { ReactComponent as InactiveTierStarIcon } from "./DASHBOARD_USERDETAILS_ICONS/InactiveTierStarIcon.svg"
import Loading from '../../GENERAL-COMPONENTS/LOADING/Loading';
import FetchFailed from '../../GENERAL-COMPONENTS/FETCH-FAILED/FetchFailed';
import { activateUserArray, blacklistUserArray } from '../DASHBOARD-USERS-LIST/DashboardUsersList';
import { useAppContext } from '../../../App';




// A user's details when the user clicks "View Details"
const DashboardUserDetails = () => {
  const { callNotification } = useAppContext()
  const { userId, users, formatter, deleteSearchParamsKey } = useDashboardContext()

  const [loading, setLoading] = useState<boolean>(true)
  const [fetchFailed, setFetchFailed] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)



  useEffect(() => {
    if (users) {
      const thisUser = users.find(user => user.id === userId)

      if (thisUser) {
        setUser(thisUser)

      } else {
        setLoading(false)
        setFetchFailed(true)
      }
    }
  }, [userId, users])
  

  useEffect(() => {
    if (user) {
      setLoading(false)
    } 
  }, [user])



  if (loading) {
    return (
      <Loading />
    )

  } else if (fetchFailed) {
    return (
      <FetchFailed 
        message="Couldn't get users this user's details"
      />
    )

  } else if (user) {
    const {
      userTier, accountNumber, educationAndEmployment, guarantors, socials, personalInformation, bankName, accountBalance
    } = user;
    const { fullName } = personalInformation

    const userDetailsArray = [
      { personalInformation }, { educationAndEmployment }, { socials }, { guarantors },
    ]


    return (
      <>
        <section className="dashboard-header user-details">
          <button
            onClick={() => deleteSearchParamsKey("userId")}
          >
            <WestOutlinedIcon />
  
            <span>Back to users</span>
          </button>
  
          <div className="dashboard-header-options">
            <h2>User Details</h2>
  
            <div className="dashboard-header-btns">
              <button className='blacklist-btn'
                onClick={() => callNotification(blacklistUserArray)}
              >BLACKLIST USER</button>

              <button className='activate-btn'
                onClick={() => callNotification(activateUserArray)}
              >ACTIVATE USER</button>
            </div>
          </div>
  
          <div className="dashboard-header-tab">
            <div className="dashboard-header-tab-div">
              <div className="tab-user-info">
                <div className="user-pfp-name">
                  <div className="user-pfp">
                    <UsersIcon />
                  </div>
                  <div className="user-name">
                    <b>{fullName}</b>
                    <p>{userId?.slice(0, 8)}</p>
                  </div>
                </div>
    
                <div className="user-tier">
                  <span>User's Tier</span>
    
                  <span className='user-tier-stars'>
                    {[1, 2, 3].map((_, ind) => {
                      const starNumber = ind + 1;
                      const condition = starNumber > parseInt(userTier);
    
                      return (
                        <React.Fragment key={ind}>
                          {condition ? (
                            <InactiveTierStarIcon />
                          ) : (
                            <ActiveTierStarIcon />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </span>
                </div>
    
                <div className="user-balance">
                  <b>{formatter.format(parseFloat(accountBalance))}</b>
                  <p>{accountNumber}/{bankName}</p>
                </div>
              </div>
    
              <div className="tab-nav">
                <ul>
                  <li><NavLink to='' className='active-link'>General Details</NavLink></li>
                  <li><NavLink to=''>Documents</NavLink></li>
                  <li><NavLink to=''>Bank Details</NavLink></li>
                  <li><NavLink to=''>Loans</NavLink></li>
                  <li><NavLink to=''>Savings</NavLink></li>
                  <li><NavLink to=''>App and System</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
  
        <section className="dashboard-content user-details">
          {userDetailsArray.map((userDetail, ind) => {

            return (
              <React.Fragment key={ind}>
                {Object.entries(userDetail).map(([key, value]) => (
                    
                  <UserDetailsSection key={key} userDetails={{ title: key, details: value }} />
                ))}
              </React.Fragment>
            )
          })}
        </section>
      </>
    );
  } else {
    return null;
  }
  
}

export default DashboardUserDetails




const UserDetailsSection = ({ userDetails }: {
  userDetails: any
}) => {
  const { formatKey } = useDashboardContext()
  const { title, details } = userDetails


  return (
    <div className="user-detail-section">
      <h3>{formatKey(title)}</h3>

      <div className="user-details">
        {title === "guarantors" ?
          <>
            {details.map((detail: any, ind: number) => {

              return (
                <div key={ind} className='user-details-div'>
                  {Object.entries(detail).map(([key, value]) => {

                    return (
                        <UserDetail key={key} detail={{ title: key, value }} />
                    )
                  })}
                </div>
              )
            })}
          </>
          :
          <div className='user-details-div'>
            {Object.entries(details).map(([key, value]) => {

              return (
                <UserDetail key={key} detail={{ title: key, value }} />
              )
            })}
          </div>
        }
      </div>
    </div>
  )
}




const UserDetail = ({ detail }: {
  detail: { title: string, value: any };
}) => {
  const { formatter, formatKey } = useDashboardContext()
  const { title, value } = detail


  function formatValue(value: string) {
    if (title === 'monthlyIncome' || title === 'loanPayment') {
      if (typeof value === 'string') {
        return formatter.format(parseFloat(value))
  
      } else if (typeof value === 'number') {
        return formatter.format(value)
      }
  
      return formatter.format(parseFloat(value[0])) + '-' + formatter.format(parseFloat(value[1]))

    } else {
      return value
    }
  }

  return (
    <div className="user-detail">
      <p>
        {formatKey(title)}
      </p>

      <b>
        {formatValue(value)}
      </b>
    </div>
  )
}