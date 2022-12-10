import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase.config';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper';

import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';

const Listing = () => {
	const [listing, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListings(docSnap.data());
				setLoading(false);
			}
		};
		fetchListing();
	}, [params.listingId, navigate]);

	if (loading) return <Spinner />;

	return (
		<main>
			<Swiper
				scrollbar={{
					hide: false,
				}}
				loop={true}
				modules={[Scrollbar]}>
				{listing.imgUrls.map((url, index) => (
					<SwiperSlide key={index} className='swiper-container'>
						<div
							style={{
								background: `url(${url}) center no-repeat`,
								backgroundSize: 'cover',
							}}
							className='swiperSlideDiv'></div>
					</SwiperSlide>
				))}
			</Swiper>
			<div
				className='shareIconDiv'
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 3000);
				}}>
				<img src={shareIcon} alt='Share' className='shareIcon' />
			</div>
			{shareLinkCopied && <p className='linkCopied'>Link Copied</p>}

			<div className='listingDetails'>
				<p className='listingName'>
					{listing.name} - $
					{listing.offer
						? listing.discountedPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						: listing.regularPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				</p>
				<p className='listingLocation'>{listing.location}</p>
				<p className='listingType'>
					For {listing.type === 'rent' ? 'Rent' : 'Sale'}
				</p>
				{listing.offer && (
					<p className='discountPrice'>
						${listing.regularPrice - listing.discountedPrice} discount
					</p>
				)}

				<ul className='listingDetailsList'>
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: '1 Bedroom'}
					</li>
					<li>
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: '1 Bathroom'}
					</li>
					<li>{listing.parking && 'Parking Spot'}</li>
					<li>{listing.furnished && 'Furnished'}</li>
				</ul>

				<p className='listingLocationTitle'>Location</p>

				<div className='leafletContainer'>
					<MapContainer
						style={{ height: '100%', width: '100%' }}
						center={[listing.geolocation.lat, listing.geolocation.lng]}
						zoom={13}
						scrollWheelZoom={false}>
						<TileLayer
							// attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						/>
						<Marker
							position={[listing.geolocation.lat, listing.geolocation.lng]}>
							<Popup>{listing.location}</Popup>
						</Marker>
					</MapContainer>
				</div>

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className='primaryButton'>
						{/*  */}
						Contact Landlord
					</Link>
				)}
			</div>
		</main>
	);
};
export default Listing;
