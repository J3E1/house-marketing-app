import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const matchRoute = path => {
		if (path === location.pathname) return true;
	};

	return (
		<footer className='navbar'>
			<nav className='navbarNav'>
				<ul className='navbarListItems'>
					<li className='navbarListItem' onClick={() => navigate('/')}>
						<ExploreIcon
							fill={matchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
							width='36px'
							height='36px'
						/>
						<p
							className={
								matchRoute('/')
									? 'navbarListItemNameActive'
									: 'navbarListNameItem'
							}>
							Explore
						</p>
					</li>
					<li className='navbarListItem' onClick={() => navigate('/offers')}>
						<OfferIcon
							fill={matchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
							width='36px'
							height='36px'
						/>
						<p
							className={
								matchRoute('/offers')
									? 'navbarListItemNameActive'
									: 'navbarListNameItem'
							}>
							Offers
						</p>
					</li>
					<li className='navbarListItem' onClick={() => navigate('/profile')}>
						<PersonOutlineIcon
							fill={matchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
							width='36px'
							height='36px'
						/>
						<p
							className={
								matchRoute('/profile')
									? 'navbarListItemNameActive'
									: 'navbarListNameItem'
							}>
							Profile
						</p>
					</li>
				</ul>
			</nav>
		</footer>
	);
};
export default NavBar;
