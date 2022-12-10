import { doc, getDoc, serverTimestamp, setDoc } from '@firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db } from '../../firebase.config';

import GoogleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoogleClick = async e => {
		try {
			const provider = new GoogleAuthProvider();

			const result = await signInWithPopup(auth, provider);

			const user = result.user;

			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				await setDoc(doc(db, 'users', user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			navigate('/');
		} catch (error) {
			toast.error('Could not authorize with google');
		}
	};

	return (
		<div className='socialLogin'>
			<p>
				Sign {location.pathname === '/sign-up' ? 'Up ' : 'In '}
				With
				<button className='socialIconDiv' onClick={onGoogleClick}>
					<img src={GoogleIcon} alt='Google Icon' className='socialIconImg' />
				</button>
			</p>
		</div>
	);
};
export default OAuth;
