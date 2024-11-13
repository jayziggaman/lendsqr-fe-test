Good day, I will be explaining the project based on pages/key files. I have also added comments in each file and function where needed so whoever is reviewing the code can have an easy time going through it and understanding the flow.

OVERVIEW
The app I created contains 2 main pages. The login page and the dashboard page. It also contains a “catch-all routes” page that shows when the user is trying to access a page that does not exist.

• THE CATCH-ALL ROUTES PAGE
This page contains a single line of text and a link to redirect the user back to the dashboard page. When a user comes across this page, it is assumed that the user is lost and therefore needs to find their way back.

• THE APP.TSX COMPONENT
This component contains the universal resources i.e those resources that are needed in multiple places throughout the application. Resources like functions, variables etc. It also contains the main context of the app “AppContext” which is used to pass these variables and functions many levels deep without prop drilling.

• THE DASHBOARD PAGE (DASHBOARD.TSX)
This page, just like the App component, contains variables and functions to be by its children component, grandchildren components and so on. The difference is that the variables and functions it contains are not for the entire application. They are to be used only when on the dashboard page. E.g The searchParams variable, the deleteSearchParamsKey function and so an. The list if users are also fetched in this component.

The searchParams variable in this page is shared using the useContext hook to its children. This variable could contains a key called “userId” which determines whether it is the DashboardUserDetails component (details about a particular user) DashboardUsersList component (the list of all the users) that shows.

I chose to use searchParams to conditionally display DashboardUsersList or DashboardUserDetails instead of making them separate pages because of the filter functionality in the DashboardUsersList page.
Firstly, because I used this method, when I go from the userDetails page to the usersList page, I can easily preserve the user’s filters (if any were applied). The other options would be to pass them (the user’s filters) in state with the link element or to store them in local storage, both of which are more tedious.
Secondly, because I used this method, the app is a bit faster. Using local storage or the link element state would mean I have to fetch from local storage or the link element’s state.
While in the userDetails page, the “Back to users link simply deletes the “userId” key from search Params and returns the user to the usersList component.

The dashboard page displays the header component, the Navbar component.

- THE DASHBOARD USERSLIST COMPONENT (DASHBOARDUSERSLIST.TSX)
  This is the first component that is displayed when the user navigates to the dashboard page. This page contains a component to display the list of users, a component to filter the list of users to display and a component to display if no users are found matching the user’s filters. It also contains minor components which are part of the main component.

This components gets the searchParams variable from the dashboard component and alters the users to display depending on the keys in the searchParams variable.

- THE DASHBOARD USERDETAILS COMPONENT (DASHBOARDUSERDETAILS.JSX)
  This component contains details of each user. Using the userId gotten from searchParams, the particular user can be found by searching the users array.

      THE HEADER COMPONENT (HEADER.TSX)

  This component has the app’s logo, the search bar and information about which account is on. In order to prevent a cramped look, some of the details in the header are left out until certain screen sizes. In smaller screen sizes, this component also contains the “hamburger” menu to toggle the navbar.

THE NAVBAR COMPONENT (NAVBAR.TSX)
This component contains categories and subcategories to explore the dashboard. On smaller screen sizes it acts like a regular navbar (it can be opened and closed) but on smaller sizes, it remains open.

THE AUTH PAGE (AUTH.TSX)
This component authenticates the user. Since there is no real API to draw user data from and authenticate the user, It is done randomly. If the user is authenticated, they are redirected to the dashboard page else they are showed an error message.
