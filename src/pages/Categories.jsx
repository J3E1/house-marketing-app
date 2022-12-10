import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { db } from '../../firebase.config';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';

const Categories = () => {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListing, setLastFetchedListing] = useState(null);

	const params = useParams();

	useEffect(() => {
		const fetchListing = async () => {
			try {
				// const listingsRef = collection(db, 'listings');

				const q = query(
					collection(db, 'listings'),
					where('type', '==', params.categoryName),
					orderBy('timestamp', 'desc'),
					limit(5)
				);

				const querySnapshot = await getDocs(q);

				const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
				setLastFetchedListing(lastVisible);

				const listing = [];
				querySnapshot.forEach(doc => {
					listing.push({
						id: doc.id,
						data: doc.data(),
					});
					// console.log(listing);
				});
				setListings(listing);
				setLoading(false);
			} catch (error) {
				toast.error(error.message);
			}
		};
		fetchListing();
	}, [params.categoryName]);

	const onFetchMoreListings = async () => {
		setLoading(true);
		try {
			// Get reference
			const q = query(
				collection(db, 'listings'),
				where('type', '==', params.categoryName),
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(10)
			);

			const querySnapshot = await getDocs(q);

			const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			setLastFetchedListing(lastVisible);

			const listings = [];

			querySnapshot.forEach(doc => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(prevState => [...prevState, ...listings]);
			setLoading(false);
		} catch (error) {
			toast.error(error);
		}
	};

	return (
		<div className='category'>
			<header>
				<p className='pageHeader'>
					{params.categoryName === 'rent'
						? 'Places for rent'
						: 'Places for sale'}
				</p>
			</header>

			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className='categoryListings'>
							{listings.map(listing => (
								<ListingItem
									listing={listing.data}
									id={listing.id}
									key={listing.id}
								/>
							))}
						</ul>
					</main>

					<br />
					<br />
					{listings.length > 10 && lastFetchedListing && (
						<p className='loadMore' onClick={onFetchMoreListings}>
							Load More
						</p>
					)}
				</>
			) : (
				<p>No listings for {params.categoryName}</p>
			)}
		</div>
	);
};
export default Categories;
