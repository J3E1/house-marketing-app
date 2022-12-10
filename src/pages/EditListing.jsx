import { onAuthStateChanged } from 'firebase/auth';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage';
import { db, auth } from '../../firebase.config';
import { uuidv4 } from '@firebase/util';
import Spinner from '../components/Spinner';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc,
} from '@firebase/firestore';

const EditListing = () => {
	const isMounted = useRef(true);
	const [geolocationEnabled, setGeolocationEnabled] = useState(false);
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		if (listings && listings.userRef !== auth.currentUser.uid) {
			toast.error('You can not edit that listing');
			navigate('/');
		}
	});

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, user => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid });
				} else {
					navigate('/sign-in');
				}
			});
		}
		setLoading(false);
		return () => {
			isMounted.current = false;
		};
	}, [isMounted]);

	useEffect(() => {
		setLoading(true);
		const fetchListings = async () => {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListings(docSnap.data());
				setFormData({
					...docSnap.data(),
					address: docSnap.data().location,
					latitude: docSnap.data().geolocation.lat,
					longitude: docSnap.data().geolocation.lng,
				});
				setLoading(false);
			} else {
				navigate('/');
				toast.error('Listing does not exist');
			}
		};
		fetchListings();
	}, []);

	const onSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		if (discountedPrice > regularPrice) {
			setLoading(false);
			toast.error('Discounted price must be less than Regular price.');
			return;
		}
		if (images.length > 6) {
			setLoading(false);
			toast.error('Max ^Images.');
			return;
		}

		let geolocation = {};
		let location;
		if (geolocationEnabled) {
			//Todo : Google geolocation
		} else {
			geolocation.lat = parseFloat(latitude);
			geolocation.lng = parseFloat(longitude);
			location = address;
		}

		const storeImage = async image => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();

				const fileName = `${auth.currentUser.uid}--${image.name}--${uuidv4()}`;

				const storageRef = ref(storage, 'images/' + fileName);
				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					'state_changed',
					snapshot => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
							default:
								break;
						}
					},
					error => {
						reject(error);
					},
					() => {
						// Upload completed successfully, now we can get the download URL
						getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
							resolve(downloadURL);
						});
					}
				);
			});
		};
		//store images on firebase

		const imgUrls = await Promise.all(
			[...images].map(image =>
				storeImage(image).catch(() => {
					setLoading(false);
					toast.error('Images not uploaded :(');
					return;
				})
			)
		);

		const formDataCopy = {
			...formData,
			imgUrls,
			timestamp: serverTimestamp(),
		};

		delete formDataCopy.images;
		delete formDataCopy.address;
		formDataCopy.location;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;
		delete formDataCopy.latitude;
		delete formDataCopy.longitude;
		formDataCopy.imgUrls = imgUrls;
		if (geolocation.lat !== 0 && geolocation.lng !== 0)
			formDataCopy.geolocation = geolocation;

		//Update listing
		const docRef = doc(db, 'listings', params.listingId);
		await updateDoc(docRef, formDataCopy);
		setLoading(false);
		toast.success('Listing Updated');
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	};

	const onMutate = e => {
		let boolean = null;

		if (e.target.value === 'true') boolean = true;
		if (e.target.value === 'false') boolean = false;

		if (e.target.files)
			setFormData(prevState => ({ ...prevState, images: e.target.files }));
		if (!e.target.files)
			setFormData(prevState => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}));
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className='profile'>
			<header>
				<p className='pageHeader'>Edit Listing</p>
			</header>
			<main>
				<form onSubmit={onSubmit}>
					<label className='formLabel'>Sale / Rent</label>
					<div className='formButtons'>
						<button
							type='button'
							className={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='sale'
							onClick={onMutate}>
							Sale
						</button>
						<button
							type='button'
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='rent'
							onClick={onMutate}>
							Rent
						</button>
					</div>

					<label className='formLabel'>Name</label>
					<input
						className='formInputName'
						type='text'
						id='name'
						value={name}
						onChange={onMutate}
						maxLength='32'
						minLength='10'
						required
					/>

					<div className='formRooms flex'>
						<div>
							<label className='formLabel'>Bedrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bedrooms'
								value={bedrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
						</div>

						<div>
							<label className='formLabel'>Bathrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bathrooms'
								value={bathrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
						</div>
					</div>
					<label className='formLabel'>Parking spot</label>
					<div className='formButtons'>
						<button
							className={parking ? 'formButtonActive' : 'formButton'}
							type='button'
							id='parking'
							value={true}
							onClick={onMutate}
							min='1'
							max='50'>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='parking'
							value={false}
							onClick={onMutate}>
							No
						</button>
					</div>
					<label className='formLabel'>Furnished</label>
					<div className='formButtons'>
						<button
							className={furnished ? 'formButtonActive' : 'formButton'}
							type='button'
							id='furnished'
							value={true}
							onClick={onMutate}>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? 'formButtonActive'
									: 'formButton'
							}
							type='button'
							id='furnished'
							value={false}
							onClick={onMutate}>
							No
						</button>
					</div>
					<label className='formLabel'>Address</label>
					<textarea
						className='formInputAddress'
						type='text'
						id='address'
						value={address}
						onChange={onMutate}
						required
					/>

					{!geolocationEnabled && (
						<div className='formLatLng flex'>
							<div>
								<label className='formLabel'>Latitude</label>
								<input
									className='formInputSmall'
									type='number'
									id='latitude'
									value={latitude}
									onChange={onMutate}
									// required
								/>
							</div>
							<div>
								<label className='formLabel'>Longitude</label>
								<input
									className='formInputSmall'
									type='number'
									id='longitude'
									value={longitude}
									onChange={onMutate}
									// required
								/>
							</div>
						</div>
					)}

					<label className='formLabel'>Offer</label>
					<div className='formButtons'>
						<button
							className={offer ? 'formButtonActive' : 'formButton'}
							type='button'
							id='offer'
							value={true}
							onClick={onMutate}>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='offer'
							value={false}
							onClick={onMutate}>
							No
						</button>
					</div>

					<label className='formLabel'>Regular Price</label>
					<div className='formPriceDiv'>
						<input
							className='formInputSmall'
							type='number'
							id='regularPrice'
							value={regularPrice}
							onChange={onMutate}
							min='50'
							max='750000000'
							required
						/>
						{type === 'rent' && <p className='formPriceText'>$ / Month</p>}
					</div>

					{offer && (
						<>
							<label className='formLabel'>Discounted Price</label>
							<input
								className='formInputSmall'
								type='number'
								id='discountedPrice'
								value={discountedPrice}
								onChange={onMutate}
								min='50'
								max='750000000'
								required={offer}
							/>
						</>
					)}

					<label className='formLabel'>Images</label>
					<p className='imagesInfo'>
						The first image will be the cover (max 6).
					</p>
					<input
						className='formInputFile'
						type='file'
						id='images'
						onChange={onMutate}
						max='6'
						accept='.jpg,.png,.jpeg'
						multiple
						required
					/>
					<button type='submit' className='primaryButton createListingButton'>
						Edit Listing
					</button>
				</form>
			</main>
		</div>
	);
};
export default EditListing;
