import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import {  useDashboardContext, UserInterface } from '../../../PAGES/DASHBOARD/Dashboard'
import "./DashboardUsersList.scss"
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../App';
import { ReactComponent as UsersIcon } from "./DASHBOARD-SVG/USERS_ICON.svg"
import { ReactComponent as ActiveUsersIcon } from "./DASHBOARD-SVG/ACTIVE_USERS_ICON.svg"
import { ReactComponent as UsersWithLoansIcon } from "./DASHBOARD-SVG/USERS_WITH_LOANS_ICON.svg"
import { ReactComponent as UsersWithSavingsIcon } from "./DASHBOARD-SVG/USERS_WITH_SAVINGS_ICON.svg"
import Loading from '../../GENERAL-COMPONENTS/LOADING/Loading';



interface FilterParametersInterface {
  organization: string;
  name: string;
  emailAddress: string;
  dateJoined: string;
  phoneNumber: string;
  status: string;
}



interface DashboardUsersListContextInterface {
  users: UserInterface[] | null;
  setUsersToDisplay: React.Dispatch<React.SetStateAction<UserInterface[] | null>>;

  showFilterMenu: boolean;
  setShowFilterMenu: React.Dispatch<React.SetStateAction<boolean>>;
}



const DashboardUsersListContext = createContext<DashboardUsersListContextInterface | null>(null)


function useDashboardUsersListContext () {
  const context = useContext(DashboardUsersListContext);

  if (!context) {
    throw new Error('useDashboardUsersListContext must be used within an DashboardUsersListContext');
  }

  return context
}


export const blacklistUserArray = ["User successfully added to blacklist", `Couldn't add user to blacklist. Try again`]

export const activateUserArray = ["User successfully activated", `Couldn't activate user. Try again`]




// The list of users in the dashboard and the 4 tabs above - USERS, ACTIVE USERS (the default state)
const DashboardUsersList = () => {
  const { convertToLowercase, handleModalClick, callNotification } = useAppContext()
  const { users, loading, searchParams, updateSearchParamsValue, deleteSearchParamsKey, formatKey } = useDashboardContext()

  const [dataLoading, setDataLoading] = useState(true)

  // The list of users to be displayed on the screen depending on the "page" the user is on and what filters they use
  const [usersToDisplay, setUsersToDisplay] = useState<any>(null)

  // The page number which the user is on. Eg page 1 of 10. Set to a default of 1 (Page 1)
  const paramsPageNumber = searchParams.get('page')
  const [pageNumber, setPageNumber] = useState<number>(
    paramsPageNumber ? parseInt(paramsPageNumber) : 1
  )
  
  // UPP - usersPerPage. The number of users(usersToDisplay) the user wants per page. Eg showing 10 out of 500 or showing 20 out of 500 
  const paramsUsersPerPage = searchParams.get("upp") 
  const [usersPerPage, setUsersPerPage] = useState<string>(
    paramsUsersPerPage ? paramsUsersPerPage : "10"
  )


  // Options for the user to select how many users they want to see per page
  const UPP_OPTIONS: string[] = ['10', '20', '50', '100', '250', '500']
  const [usersPerPageOptions, setUsersPerPageOptions] = useState<string[]>([
    '10', '20', '50', '100', '250', '500'
  ])

  // UTP = usersToDisplay. The lowerLimit refers to the first argument passed to the built-in slice method for paginating the usersToDisplay array. The upperLimit is the second argument.
  const [UTDSliceLowerLimit, setUTDSliceLowerLimit] = useState<number>(0)
  const [UTDSliceUpperLimit, setUTDSliceUpperLimit] = useState<number>(
    parseInt(usersPerPage) * pageNumber
  )

  // The total number of pages (the number of the last page). It depends on the usersToDisplay length and the value of usersPerPage
  const [lastPage, setLastPage] = useState<number>(
    usersToDisplay ? Math.ceil(usersToDisplay.length / parseInt(usersPerPage)) : 1
  )

  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false)

  // This filterParameters variable holds the data gotten from the URL searchParams. It is updated everytime searchParams changes.
  const [filterParameters, setFilterParameters] = useState<FilterParametersInterface>({
    organization: searchParams.get('organization') || '',
    name: searchParams.get('name') || '',
    emailAddress: searchParams.get('email') || '',
    status: searchParams.get('status') || '',
    dateJoined: searchParams.get('date') || '',
    phoneNumber: searchParams.get('phoneNumber') || ''
  })
  


  // Initially, loading is true until usersToDisplay is fetched
  useEffect(() => {
    if (usersToDisplay) {
      setDataLoading(false)
    }
  }, [usersToDisplay])


  useEffect(() => {
    const windowClick = () => {
      // Remove popup info when the user clicks on any part of the screen
      const infoPopUps = document.querySelectorAll('td.user-info-popup')
      infoPopUps.forEach(div => {
        if (div) {
          div.classList.remove('active')
        }
      })


      // Remove filter menu when the user clicks on any part of the screen
      if (showFilterMenu) {
        setShowFilterMenu(false)
      }
    }

    window.addEventListener('click', windowClick)

    return () => {
      window.removeEventListener('click', windowClick)
    }
  }, [showFilterMenu])


  useEffect(() => {
    const paramsPageNumber = searchParams.get('page');
  
    // Update page number based on searchParams
    if (paramsPageNumber) {
      setPageNumber(parseInt(paramsPageNumber));

    } else {
      setPageNumber(1);
    }
  
    // Update filterParameters in one setState call
    const newFilterParameters: any = { ...filterParameters };

    Object.entries(filterParameters).forEach(([key, _]) => {
      const paramValue = searchParams.get(key);
      newFilterParameters[key] = paramValue || '';
    });
    
    setFilterParameters(newFilterParameters);



    const paramsUsersPerPage = searchParams.get("upp") 
    if (paramsUsersPerPage) {
      setUsersPerPage(paramsUsersPerPage)

    } else {
      setUsersPerPage("10")
    }
    
  }, [searchParams]);
  


  useEffect(() => {
    if (users) {
      if (filterParameterActive()) {
        const filteredUsers: UserInterface[] = [];
  
        users.forEach(user => {
          let isUserValid = true; // Assume user is valid initially
    
          // Check if the user matches all filter parameters
          Object.entries(filterParameters).forEach(([key, value]) => {
            const thisUser = user;
            const userValue = thisUser[key as keyof UserInterface];
    
            // For status, it has to be exactly the same. If not when the user searches for "active" users, "inactive" users will also show up
            if (key === 'status') {
              // Check if `userValue` is a string before calling `convertToLowercase`
              if (value && typeof userValue === 'string' && convertToLowercase(userValue) !== convertToLowercase(value)) {
                isUserValid = false; 
              }
            } else {
              if (value && typeof userValue === 'string' && !convertToLowercase(userValue).includes(convertToLowercase(value))) {
                isUserValid = false; 
              }
            }
          });
    
          // If the user is valid for all filters, add to filteredUsers
          if (isUserValid) {
            filteredUsers.push(user);
          }
        });
    
        setUsersToDisplay([...filteredUsers]);

      } else {
        setUsersToDisplay([...users])
      }
      
    }
  }, [filterParameters, users]);
  


  useEffect(() => {
    const parsedUsersPerPage = parseInt(usersPerPage)

    const highestUserIndex: number = pageNumber * parsedUsersPerPage

    // Updating the upper and lower slice limits depending on the usersPerPage
    setUTDSliceLowerLimit(highestUserIndex - parsedUsersPerPage)
    setUTDSliceUpperLimit(highestUserIndex)
    

    // Updating lastPage depending on the usersPerPage
    if (usersToDisplay) {
      setLastPage(Math.ceil(usersToDisplay.length / parsedUsersPerPage))
    }



    const newUsersPerPageOptions: string[] = UPP_OPTIONS.filter(option => {
      const parsedOption = parseInt(option)

      if (usersToDisplay && parsedOption <= usersToDisplay.length) {
        return option
      }
    })
    setUsersPerPageOptions(
      newUsersPerPageOptions.length === 0 && usersToDisplay ?
        [usersToDisplay.length.toString()] : [...newUsersPerPageOptions]
    )
  }, [usersToDisplay, usersPerPage, pageNumber])
  


  useEffect(() => {
    // when usersPerPage is changed, pageNumber is reset to 1.
    updateSearchParamsValue("page", "1")
  }, [usersPerPage])



  // This is the popup that shows "view details", "bloacklist user" & "activate user". Since each line has this popup, it would be difficult to track it with state, therefore we traverse the DOM to find thr right popupup div.
  function showInfoPopup(e: React.MouseEvent<HTMLTableDataCellElement>) {
    // Handle modal click is here because the window has an event listener to remove popups. Without this function, immediately the user clicks on the horizontal ellipses (on the far right of each row) the popup would open and close immediately.
    handleModalClick(e)

    // Selecting all popups to remove the active state initially
    const userInfoPopups = document.querySelectorAll("td.user-info-popup")

    userInfoPopups.forEach(popup => {
      if (popup) {
        popup.classList.remove('active')
      }
    })

    // Adding the active state to this particular popup
    const thisElement = e.currentTarget
    thisElement?.nextElementSibling?.classList.add('active')
  }



  function closePopup(e: React.MouseEvent<HTMLTableDataCellElement>) {
    const target = e.target as HTMLElement;

    // Ensure target is an HTMLElement and has the 'active' class before removing it
    if (target && target.classList.contains('active')) {
      target.classList.remove('active');
    }
  }



  // This function checkswhat page the user is in and return an array of numbers for navigation. (Max 5 numbers)
  const getPageNumbers = () => {
    const pageNumbers = [];

    // If the pages are 5 or less, return an array of numbers 1 to 5
    if (lastPage <= 5) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    // Else we check what page the user is in and return a befitting array
    if (pageNumber <= 2) {
      pageNumbers.push(1, 2, 3, '...', lastPage - 1, lastPage);

    } else if (pageNumber >= lastPage - 2) {
      pageNumbers.push(1, 2, '...', lastPage - 2, lastPage - 1, lastPage);

    } else {
      pageNumbers.push(
        pageNumber - 1,
        pageNumber,
        pageNumber + 1,
        '...',
        lastPage - 1,
        lastPage
      );
    }

    return pageNumbers;
  };



  // This function checks to see if any filter is active such as username, organization etc
  const filterParameterActive = () => {
    for (const [_, value] of Object.entries(filterParameters)) {
      if (value !== '') {
        return true; // Exit function immediately if a non-empty value is found
      }
    }
    return false; // Return false if no non-empty values were found
  };
  

  
  return (
    <DashboardUsersListContext.Provider
      value={{
        setUsersToDisplay, users, showFilterMenu, setShowFilterMenu
      }}
    >
      {dataLoading || loading ?
        <Loading />
        :
        <>
          <section className="dashboard-header users-list">
            <h2>
              Users
            </h2>

            <div className="dashboard-header-tabs">
              {/* {dashboardInfo?.userStats.map(info => {
                const { title, count } = info
                
                return 
              })} */}
              {/* Can't map through dashboardInfo.userStats of them because they have different icons */}
              <DashboardHeaderTab
                title='users'
              >
                <UsersIcon />
              </DashboardHeaderTab>

            
              <DashboardHeaderTab
                title='active users'
              >
                <ActiveUsersIcon />
              </DashboardHeaderTab>

            
              <DashboardHeaderTab
                title='users with loans'
              >
                <UsersWithLoansIcon />
              </DashboardHeaderTab>

            
              <DashboardHeaderTab
                title='users with savings'
              >
                <UsersWithSavingsIcon />
              </DashboardHeaderTab>
            </div>
          </section>

          <section className="dashboard-content users-list"
            style={{
              marginTop: filterParameterActive() ? '4.5rem' : "0"
            }}
          >
            <>
              <div className="filter-parameters">
                {Object.entries(filterParameters).map(([key, value]) => {
                  if (value !== '') {
                    return (
                      <div key={key} className="filter-parameter">
                        <span className="filter-parameter-key">
                          {formatKey(key)}
                        </span>
        
                        <button className="filter-parameter-value-cancel"
                          onClick={() => deleteSearchParamsKey(key)}
                        >
                          <span className="filter-parameter-value">
                            {value}
                          </span>
        
                          <CloseIcon />
                        </button>
                      </div>
                    )
                  }
                })}
              </div>

              {usersToDisplay?.length === 0 ?
                <NoUsersToDisplay />
                :
                <>
                  <div className="users-to-display">
                    <table>
                      <thead>
                        <tr>
                          <TableHead text="ORGANIZATION" />
                        
                          <TableHead text="USERNAME" />
                        
                          <TableHead text="EMAIL" />
                        
                          <TableHead text="PHONE NUMBER" />
                        
                          <TableHead text="DATE JOINED" />
                        
                          <TableHead text="STATUS" />
                        </tr>
                      </thead>

                      <tbody>
                        {usersToDisplay?.slice(UTDSliceLowerLimit, UTDSliceUpperLimit)
                          .map((user: any) => {
                            const { id, personalInformation, dateJoined, status } = user
                            const { fullName, phoneNumber, emailAddress } = personalInformation


                            return (
                              <tr key={id}>
                                <td>Lendsqr</td>
                                <td>{fullName}</td>
                                <td>{emailAddress}</td>
                                <td>{phoneNumber}</td>
                                <td>{dateJoined}</td>
                                <td className='status'>
                                  <span className={status.toLocaleLowerCase()}>
                                    {status}
                                  </span>
                                </td>

                                <td className='show-options' role="button"
                                  onClick={e => showInfoPopup(e)}
                                >
                                  <span>
                                    <MoreVertOutlinedIcon />
                                  </span>
                                </td>


                                <td className="user-info-popup" role="button"
                                  onClick={(e: React.MouseEvent<HTMLTableDataCellElement>) => {
                                    const target = e.currentTarget as HTMLElement;

                                    if (target.classList.contains('active')) {
                                      closePopup(e);
                                    } else {
                                      handleModalClick(e);
                                    }
                                  }}
                                  
                                >
                                  <Link to={`/dashboard?userId=${id}`}>
                                    <FilterListOutlinedIcon />

                                    <span>
                                      View Details
                                    </span>
                                  </Link>

                                  <button
                                    onClick={() => callNotification(blacklistUserArray)}
                                  >
                                    <FilterListOutlinedIcon />

                                    <span>
                                      Blacklist User
                                    </span>
                                  </button>
                              
                                  <button
                                    onClick={() => callNotification(activateUserArray)}
                                  >
                                    <FilterListOutlinedIcon />

                                    <span>
                                      Activate User
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="dashboard-users-list-pagination">
                    <div className="pagination-select">
                      <span>
                        Showing
                      </span>

                      <select name="pagination-select" id="pagination-select"
                        value={usersPerPage}
                        onChange={e => {
                          updateSearchParamsValue("upp", e.target.value)
                        }}
                        
                      >
                        {usersPerPageOptions.map(option => {
                          return (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          )
                        })}
                      </select>

                      <span>
                        out of {usersToDisplay?.length}
                      </span>
                    </div>

                    <div className="pagination-nav">
                      <button className='pagination-nav-arrow'
                        onClick={() => {
                          const newPageNumber = pageNumber - 1
                          updateSearchParamsValue("page", newPageNumber.toString())
                        }}
                        style={{ opacity: pageNumber === 1 ? 0.5 : 1 }}
                        disabled={pageNumber === 1}
                      >
                        <KeyboardArrowLeftIcon />
                      </button>

                      <div className="pagination-nav-numbers">
                        {getPageNumbers()?.map(pageElement => {
                          return (
                            <React.Fragment key={pageElement}>
                              {typeof pageElement === 'number' ?
                                <button key={pageElement}
                                  onClick={() => updateSearchParamsValue("page", pageElement.toString())}
                                  className={pageNumber === pageElement ? 'active' : ''}
                                >
                                  {pageElement}
                                </button>
                                :
                                <span>
                                  {pageElement}
                                </span>
                              }
                            </React.Fragment>
                          )
                        })}
                      </div>

                      <button className='pagination-nav-arrow'
                        onClick={() => {
                          const newPageNumber = pageNumber + 1
                          updateSearchParamsValue("page", newPageNumber.toString())
                        }}
                        style={{ opacity: pageNumber === lastPage ? 0.5 : 1 }}
                        disabled={pageNumber === lastPage}
                      >
                        <KeyboardArrowRightIcon />
                      </button>
                    </div>
                  </div>

                  <DashboardFilter />
                </>
              }
            </>
          </section>
        </>
      }
    </DashboardUsersListContext.Provider>
  )
}

export default DashboardUsersList





const NoUsersToDisplay = () => {
  return (
    <div className="no-users">
      No users match your search.
    </div>
  )
}




const DashboardHeaderTab = ({ children, title }: {
  children: ReactNode;
  title: string;
}) => {
  const { convertToLowercase } = useAppContext()
  const { dashboardInfo } = useDashboardContext()

  // This function checks the dashboardInfo object for the appropriate number of users 
  const findDashboardStats = (text: string) => {
    if (dashboardInfo) {
      const { userStats } = dashboardInfo

      if (userStats) {
        const statObj = userStats.find(stat => convertToLowercase(stat.title) === convertToLowercase(text))

        return statObj ? statObj.count : 0

      }
    }
    return 0
  }


  
  return (
    <div className="dashboard-header-tab">
      <span className={`tab-icon ${title}`}>
        {children}
      </span>

      <span className='tab-title'>
        {title}
      </span>

      <span className='tab-amount'>
        {findDashboardStats(title).toLocaleString('en-us')}
      </span>
    </div>
  )
}




const TableHead = ({ text }: {
  text: string;
}) => {
  const { handleModalClick } = useAppContext()
  const { setShowFilterMenu } = useDashboardUsersListContext()
  
  return (
    <th
      role="button" onClick={e => {
        handleModalClick(e)
        setShowFilterMenu(true)
      }}
    >
      <div>
        <span>
          {text}
        </span>

        <FilterListOutlinedIcon />
      </div>
    </th>
  )
}




const DashboardFilter = () => {
  const { handleModalClick } = useAppContext()
  const { searchParams, setSearchParams } = useDashboardContext()

  const { showFilterMenu, setShowFilterMenu } = useDashboardUsersListContext()

  // Different filterParameters. In this component, this variable only holds data gotten from the inputs fields and sets them in searchParams when the filterUsers function runs
  const [filterParameters, setFilterParameters] = useState<FilterParametersInterface>({
    organization: '',
    name: '',
    emailAddress: '',
    status: '',
    dateJoined: '',
    phoneNumber: ''
  })
  const { name, emailAddress, dateJoined, status, phoneNumber, organization } = filterParameters


  const resetFilters = () => {
    const newFilterParameters: FilterParametersInterface = filterParameters

    Object.entries(filterParameters).map(([key, _]) => {
      newFilterParameters[key as keyof FilterParametersInterface] = ''
    })

    setFilterParameters({ ...newFilterParameters })
    setShowFilterMenu(false)
  }


  const filterUsers = () => {
    const newSearchParams = new URLSearchParams(searchParams); 

    Object.entries(filterParameters).forEach(([key, value]) => {
      if (value !== '') {
        newSearchParams.set(key, value);  
        
      } else {
        newSearchParams.delete(key);  
      }
    });

    setSearchParams(newSearchParams); 
    setShowFilterMenu(false)
  }


  

  return (
    <div
      className={`dashboard-filter ${showFilterMenu ? 'active' : ''}`}
      onClick={e => handleModalClick(e)}
    >
      <label htmlFor="organization-filter">
        Organization
        <select name="organization-filter" id="organization-filter" value={organization}
          onChange={e => setFilterParameters({...filterParameters, organization: e.target.value})}
        >
          <option value="">Select</option>
          <option value="Lendsqr">Lendsqr</option>
        </select>
      </label>

      
      <label htmlFor="username-filter">
        Username
        <input type="text" name="username-filter" id="username-filter" placeholder='User'
          value={name} 
          onChange={e => setFilterParameters({...filterParameters, name: e.target.value})}
        />
      </label>

      
      <label htmlFor="email-filter">
        Email
        <input type="text" name="email-filter" id="email-filter" placeholder='Email'
          value={emailAddress}
          onChange={e => setFilterParameters({...filterParameters, emailAddress: e.target.value})}
        />
      </label>

      
      <label htmlFor="date-filter">
        Date
        <input type="date" name="date-filter" id="date-filter" value={dateJoined} 
          onChange={e => setFilterParameters({...filterParameters, dateJoined: e.target.value})}
        />
      </label>

      
      <label htmlFor="phone-number-filter">
        Phone Number
        <input type="text" name="phone-number-filter" id="phone-number-filter"
          placeholder='Phone Number' value={phoneNumber}
          onChange={e => setFilterParameters({...filterParameters, phoneNumber: e.target.value})}
        />
      </label>

      
      <label htmlFor="status-filter">
        Status
        <select name="status-filter" id="status-filter" value={status}
          onChange={e => setFilterParameters({...filterParameters, status: e.target.value})}
        >
        <option value="">Select</option>
        <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
      </label>


      <div className="filter-btns">
        <button className="reset-btn"
          onClick={() => resetFilters()}
        >
          Reset
        </button>
        
        <button className="filter-btn"
          onClick={() => filterUsers()}
        >
          Filter
        </button>
      </div>
    </div>
  )
}