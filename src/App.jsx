import { Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import About from '../src/pages/About';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import CreateListings from './pages/CreateListings';
import EditListing from './pages/EditListing';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Listing from './pages/Listing';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<Explore />} />
				<Route path='/about' element={<About />} />
				<Route path='/offers' element={<Offers />} />
				<Route path='/offers' element={<Offers />} />
				<Route path='/category/:categoryName' element={<Categories />} />
				<Route
					path='/category/:categoryName/:listingId'
					element={<Listing />}
				/>
				<Route path='/profile' element={<PrivateRoute />}>
					<Route path='/profile' element={<Profile />} />
				</Route>
				<Route path='/sign-in' element={<SignIn />} />
				<Route path='/sign-up' element={<SignUp />} />
				<Route path='/create-listing' element={<CreateListings />} />
				<Route path='/edit-listing/:listingId' element={<EditListing />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route path='/contact/:landlordId' element={<Contact />} />
			</Routes>
			<NavBar />
			<ToastContainer />
		</>
	);
}

export default App;
