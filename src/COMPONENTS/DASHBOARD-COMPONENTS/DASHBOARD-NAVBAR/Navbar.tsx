import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import "./Navbar.scss"
import { NavLink } from 'react-router-dom';
import { ReactComponent as OrganizationIcon } from "./NAVBAR-ICONS/OrganizationIcon.svg"
import { ReactComponent as DashboardIcon } from "./NAVBAR-ICONS/DashboardIcon.svg"
import { ReactComponent as UsersIcon } from "./NAVBAR-ICONS/UsersIcon.svg"
import { ReactComponent as GuarantorsIcon } from "./NAVBAR-ICONS/GuarantorsIcon.svg"
import { ReactComponent as LoansIcon } from "./NAVBAR-ICONS/LoansIcon.svg"
import { ReactComponent as DecisionModelsIcon } from "./NAVBAR-ICONS/DecisionModelsIcon.svg"
import { ReactComponent as SavingsIcon } from "./NAVBAR-ICONS/SavingsIcon.svg"
import { ReactComponent as LoanIcon } from "./NAVBAR-ICONS/LoanIcon.svg"
import { ReactComponent as WhitelistIcon } from "./NAVBAR-ICONS/WhitelistIcon.svg"
import { ReactComponent as KarmaIcon } from "./NAVBAR-ICONS/KarmaIcon.svg"
import { ReactComponent as SavingsProductsIcon } from "./NAVBAR-ICONS/SavingsProductsIcon.svg"
import { ReactComponent as FeesAndChargesIcon } from "./NAVBAR-ICONS/FeesAndChargesIcon.svg"
import { ReactComponent as TransactionsIcon } from "./NAVBAR-ICONS/TransactionsIcon.svg"
import { ReactComponent as ServicesIcon } from "./NAVBAR-ICONS/ServicesIcon.svg"
import { ReactComponent as ServiceAccountIcon } from "./NAVBAR-ICONS/ServiceAccountIcon.svg"
import { ReactComponent as SettlementsIcon } from "./NAVBAR-ICONS/SettlementsIcon.svg"
import { ReactComponent as ReportsIcon } from "./NAVBAR-ICONS/ReportsIcon.svg"
import { ReactComponent as PreferencesIcon } from "./NAVBAR-ICONS/PreferencesIcon.svg"
import { ReactComponent as FeesAndPricingIcon } from "./NAVBAR-ICONS/FeesAndPricingIcon.svg"
import { ReactComponent as AuditLogsIcon } from "./NAVBAR-ICONS/AuditLogsIcon.svg"
import { ReactComponent as SystemsMessagesIcon } from "./NAVBAR-ICONS/SystemsMessagesIcon.svg"
import { ReactComponent as LogoutIcon } from "./NAVBAR-ICONS/LogoutIcon.svg"
import { useAppContext } from '../../../App';
import { useDashboardContext } from '../../../PAGES/DASHBOARD/Dashboard';



interface NavbarContextInterface {
  viewingUserDetails: boolean;
}


const NavbarContext = createContext<NavbarContextInterface | null>(null)


const useNavbarContext = () => {
  const context = useContext(NavbarContext)

  if (!context) {
    throw new Error("useNavbarContext must be used within an NavbarContext")

  } 
  return context
}



// The navbar by the left of the screen (on large screens)
const Navbar = () => {
  // Variable for showing the navbar
  const { showDashboardNav } = useAppContext()

  // SearchParams from dashboard
  const { searchParams } = useDashboardContext()

  // Simple condition for the last options in the navbar
  const condition = searchParams.get("userId")
  const [viewingUserDetails, setViewingUserDetails] = useState<boolean>(
    condition ? true : false
  )


  useEffect(() => {
    const condition = searchParams.get("userId")
    if (condition) {
      setViewingUserDetails(true)

    } else {
      setViewingUserDetails(false)
    }
  }, [searchParams])
  

  
  return (
    <NavbarContext.Provider
      value={{ viewingUserDetails }}
    >
      <nav className={`app-nav ${showDashboardNav ? "active" : ""}`}>
        <div className="nav-div">
          <div className="switch-organization-div">
            <OrganizationIcon />

            <select name="switch-organization" id="switch-organization">
              <option value="">Switch Organization</option>
              <option value="Lendsqr">Lendsqr</option>
              <option value="Google">Google</option>
            </select>
          </div>
            

          <div className="nav-header">
            <DashboardIcon />

            <span>
              Dashboard
            </span>
          </div>

          <div className="nav-categories">
            <Customers />

            <Businesses />

            <Settings />
          </div>
        </div>

        {viewingUserDetails ?
          <div className="nav-footer">
            <NavSubCategory title='Logout' active={true}>
              <LogoutIcon />
            </NavSubCategory>

            <span>
              v1.2.0
            </span>
          </div>
          : <></>
        }
      </nav>
    </NavbarContext.Provider>
  )
}

export default Navbar




// A nav category (eg Customers, Businesses & Settings)
const NavCategory = ({ children, title }: {
  children: ReactNode;
  title: string;
}) => {
  
  return (
    <div className="category">
      {/* 
        The title of each category passed as props
      */}
      <h3 className='category-title'>
        {title}
      </h3>

      {/* 
        The list of sub categories for each category
      */}
      <ul className="sub-categories">
        {children}
      </ul>
    </div>
  )
}




// Sub categoies of each category (eg Users & Guarantors for CUSTOMERS, Organization & Loan Products for BUSINESSES)
const NavSubCategory = ({ children, title, active }: {
  children?: ReactNode;
  title: string;
  active?: boolean;
}) => {
  const { setShowDashboardNav } = useAppContext()
  
  return (
    <li className={`sub-category ${active ? 'active' : ''}`}
      onClick={() => setShowDashboardNav(false)}
    >
      {/* 
        Each navlink is supposed to have a callback function to check if it is "active". This will then give it that green highlight but since there isn't any extra data or routes to link to "Users" is fixed as the "active" Navlink. However, this can be changed easily 
      */}


      <NavLink to={`/dashboard?sub-category=${title.toLowerCase()}`}>
        {/* 
          The individual icons for each Sub Category is passed as the children props every component receives by default
        */}
        {children}

        {/* 
          The title of each sub category passed as props
        */}
        <span>
          {title}
        </span>
      </NavLink>
    </li>
  )
}




// The Customers Nav Category
const Customers = () => {
  return (
    <NavCategory title='Customers'>
      <NavSubCategory title='Users' active={true}>
        <UsersIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Guarantors'>
        <GuarantorsIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Loans'>
        <LoansIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Decison Models'>
        <DecisionModelsIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Savings'>
        <SavingsIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Loan Requests'>
        <LoanIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Whitelist'>
        <WhitelistIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Karma'>
        <KarmaIcon />
      </NavSubCategory>
    </NavCategory>
  )
}



// The Businesses Nav Category
const Businesses = () => {
  return (
    <NavCategory title="Businesses">
      <NavSubCategory title='Organization'>
        <OrganizationIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Loan Products'>
        <LoanIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Savings Products'>
        <SavingsProductsIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Fees and Charges'>
        <FeesAndChargesIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Transactions'>
        <TransactionsIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Services'>
        <ServicesIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Service Account'>
        <ServiceAccountIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Settlements'>
        <SettlementsIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Reports'>
        <ReportsIcon />
      </NavSubCategory>
    </NavCategory>
  )
}



// The Settings Nav Category
const Settings = () => {
  const { viewingUserDetails } = useNavbarContext()
  
  return (
    <NavCategory title="Settings">
      <NavSubCategory title='Preferences'>
        <PreferencesIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Fees and Pricing'>
        <FeesAndPricingIcon />
      </NavSubCategory>

      
      <NavSubCategory title='Audit Logs'>
        <AuditLogsIcon />
      </NavSubCategory>

      {viewingUserDetails ?
        <NavSubCategory title='Systems Messages'>
          <SystemsMessagesIcon />
        </NavSubCategory>
        :
        <></>
      }
    </NavCategory>
  )
}