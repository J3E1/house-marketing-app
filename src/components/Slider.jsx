import {
	collection,
	query,
	orderBy,
	limit,
	getDocs,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase.config';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const Slider = () => {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchListing = async () => {
			try {
				// const listingsRef = collection(db, 'listings');

				const q = query(
					collection(db, 'listings'),
					orderBy('timestamp', 'desc'),
					limit(5)
				);

				const querySnapshot = await getDocs(q);
				const listing = [];
				querySnapshot.forEach(doc => {
					listing.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setListings(listing);
				setLoading(false);
			} catch (error) {
				toast.error(error.message);
			}
		};
		fetchListing();
	}, []);

	if (!listings || listings.length === 0) return <></>;
	if (loading) return <Spinner />;

	return (
		<>
			<h3>Recommended</h3>
			<Swiper
				slidesPerView={1}
				loop={true}
				scrollbar={{
					hide: false,
				}}
				modules={[Scrollbar]}>
				{listings.map(({ id, data }) => (
					<SwiperSlide
						key={id}
						className='swiper-container'
						onClick={() => navigate(`/category/${data.type}/${id}`)}>
						<div
							style={{
								background: `url(${data.imgUrls[0]}) center no-repeat`,
								backgroundSize: 'cover',
							}}
							className='swiperSlideDiv'>
							<p className='swiperSlideText'>{data.name}</p>
							<p className='swiperSlidePrice'>
								${data.discountedPrice ?? data.regularPrice}{' '}
								{data.type === 'rent' && '/ month'}
							</p>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
};
export default Slider;
