import React, { createContext, useContext, useEffect, useState } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import Header from '../../COMPONENTS/GENERAL-COMPONENTS/HEADER/Header'
import "./Dashboard.scss"
import DashboardUsersList from '../../COMPONENTS/DASHBOARD-COMPONENTS/DASHBOARD-USERS-LIST/DashboardUsersList';
import DashboardUserDetails from '../../COMPONENTS/DASHBOARD-COMPONENTS/DASHBOARD-USER-DETAILS/DashboardUserDetails';
import axios from 'axios'
import { faker } from '@faker-js/faker';
import Navbar from '../../COMPONENTS/DASHBOARD-COMPONENTS/DASHBOARD-NAVBAR/Navbar';
import FetchFailed from '../../COMPONENTS/GENERAL-COMPONENTS/FETCH-FAILED/FetchFailed';



interface DashboardInfoInterface {
  filterOptions: { options: string[], title: string }[];
  userStats: { count: number, icon: string, title: string }[];
}



export interface UserInterface {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: string;
  avatar: string;
  personalInformation: {
    fullName: string,  
    phoneNumber: string,  
    emailAddress: string,  
    bvn: string,  
    gender: string,  
    maritalStatus: string, 
    children: string, 
    typeOfResidence: string,  
  };
  educationAndEmployment: {
    levelOfEducation: string, 
    employmentStatus: string,  
    sectorOfEmployment: string,  
    durationOfEmployment: string, 
    officeEmail: string, 
    monthlyIncome: number[],
    loanRepayment: { min: number, max: number },
  };
  socials: {
    twitter: string,  
    facebook: string,  
    instagram: string, 
  };
  guarantor: {
    fullName: string, 
    phoneNumber: string,  
    address: string,  
    emailAdress: string,
    relationship: string, 
  }[];
  accountBalance: string;
  accountNumber: string;
  bankName: string;
  userTier: string;
}


// Define the context interface
interface DashboardContextInterface {
  dashboardInfo: DashboardInfoInterface | null;
  users: UserInterface[] | null;

  userId: string | null;
  formatter: Intl.NumberFormat;

  loading: boolean;

  searchParams: URLSearchParams;
  setSearchParams: (nextInit: URLSearchParamsInit, navigateOptions?: { replace?: boolean; state?: any }) => void;

  updateSearchParamsValue: (key: string, value: string) => void;
  deleteSearchParamsKey: (key: string) => void;
  formatKey: (key: string) => string;
}



// DASHBOARD INFO //
// PHONE NUMBERS //
// DATE JOINED //
// DURATION OF EMPLOYMENT //
// EACH USER SHOULD HAVE ONE NAME //
// GUARANTOR SHOULD BE AN ARRAY (UP TO 3) //
// EDUCATION - SECTOR OF EMPLOYMENT, - DURATION OF EMPLOYMENT //
// MAKE EMAILS AND SOCIALS SIMILAR TO THE USER'S NAME //
// MAKE THE USER'S PROFILE RELATE TO EACHOTHER //
// ADD USER ORGANIZATION //
// CHANGE NAME TO USER FOR USERS




export const DashboardContext = createContext<DashboardContextInterface | null>(null)

const Dashboard = () => {
  const [searchParams, setSearchParams]: [URLSearchParams, (nextInit: URLSearchParamsInit, navigateOptions?: { replace?: boolean; state?: any }) => void] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true)
  const [fetchFailed, setFetchFailed] = useState<boolean>(false)
  const [dashboardInfo, setDashBoardInfo] = useState<DashboardInfoInterface | null>(null)
  const [users, setUsers] = useState<UserInterface[] | null>(null)

  // This checks which user to display in userDetails
  const [userId, setUserId] = useState<string | null>(null)

  // Formats money to Nigeria Naira
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });


  // Fetching data from the mock API
  useEffect(() => {
    const API_KEY: string = `https://run.mocky.io/v3/7a1c16a4-28e9-4319-be15-49faa958d991`

    axios.get(API_KEY)
    .then(response => {
      const { data } = response
      const { dashboardInfo, users } = data

      const parsedUsers: UserInterface[] = []

      users.map((user: string) => {
        if (user) {
          parsedUsers.push(JSON.parse(user))
        }
      })

      setDashBoardInfo(dashboardInfo)
      setUsers(parsedUsers)
    })
      
    .catch(error => {
      setLoading(false)
      setFetchFailed(true)
    })

  }, [])



  useEffect(() => {
    if (users && dashboardInfo) {
      setLoading(false)
      setFetchFailed(false)
    }
  }, [users, dashboardInfo])




  
  useEffect(() => {
    // Checks to see if a user has been selected to view details
    setUserId(searchParams.get('userId'))
  }, [searchParams])

  


  function formatKey(key: string) {
    // Insert space before each uppercase letter and convert the result to title case
    return key
      .replace(/([A-Z])/g, ' $1')    // Insert space before each uppercase letter
      .replace(/^./, (str: string) => str.toUpperCase()); // Capitalize the first letter
  }


  // This function deleted a key from searchParams. Mainly used when a user clears a search field.
  const deleteSearchParamsKey = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    setSearchParams(newSearchParams);
  }



  // This function updates the value of a key in searchParams. Eg changing the page number in pagination.
  const updateSearchParamsValue = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams); 
    newSearchParams.set(key, value); 

    setSearchParams(newSearchParams);   
  }



  return (
    <DashboardContext.Provider
      value={{
        dashboardInfo, users, userId, formatter, loading, searchParams, setSearchParams, updateSearchParamsValue, deleteSearchParamsKey, formatKey
      }}
    >
      <Header />
      <Navbar />

      <main className="dashboard-main">
        {fetchFailed ?
          <FetchFailed 
            message={`Couldn't fetch data. Please refresh`}
          />
        :
        <>
          {userId ?
            <DashboardUserDetails />
            :
            <DashboardUsersList />
          }
          </>
        }
      </main>
    </DashboardContext.Provider>
  )
}

export default Dashboard






export function useDashboardContext() {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboardContext must be used within an DashboardContextProvider');
  }
  return context;
}