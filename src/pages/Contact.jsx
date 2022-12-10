import { doc, getDoc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';

const Contact = () => {
	const [message, setMessage] = useState('');
	const [landlord, setLandlord] = useState(null);

	const params = useParams();

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const getLandlord = async () => {
			try {
				const docRef = doc(db, 'users', params.landlordId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) setLandlord(docSnap.data());
			} catch (error) {
				toast.error('Could not get the landlord :(');
			}
		};
		getLandlord();
	}, [params.landlordId]);

	const onChange = e => setMessage(e.target.value);

	return (
		<div className='pageContainer'>
			<header>
				<p className='pageHeader'>Contact Landlord</p>
			</header>

			{landlord !== null && (
				<main>
					<div className='contactLandlord'>
						<p className='landlordName'>Contact {landlord?.name}</p>
					</div>

					<form className='messageForm'>
						<div className='messageDiv'>
							<label htmlFor='message' className='messageLabel'>
								Message
							</label>
							<textarea
								name='message'
								id='message'
								className='textarea'
								value={message}
								onChange={onChange}></textarea>
						</div>

						<a
							href={`mailto:${landlord.email}?Subject=${searchParams.get(
								'listingName'
							)}&body=${message}`}>
							<button type='button' className='primaryButton'>
								Send Message
							</button>
						</a>
					</form>
				</main>
			)}
		</div>
	);
};
export default Contact;
