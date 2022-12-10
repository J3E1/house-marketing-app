import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, setDoc, serverTimestamp } from '@firebase/firestore';

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import Spinner from '../components/Spinner';

const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});
	const { name, email, password } = formData;

	const navigate = useNavigate();

	const onChangeHandler = e => {
		setFormData(prevState => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmitHandler = async e => {
		setLoading(true);
		e.preventDefault();

		// const auth = getAuth();
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;

			updateProfile(auth.currentUser, {
				displayName: name,
			});

			const formDataCopy = { ...formData };
			delete formDataCopy.password;
			formDataCopy.timestamp = serverTimestamp();

			await setDoc(doc(db, 'users', user.uid), formDataCopy);

			setLoading(false);
			toast.success('Signed Up Successfully!!');
			navigate('/');
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			setLoading(false);
			toast.error('Something went wrong!! Please try again..');
			// console.log(errorCode, errorMessage);
		}
	};

	if (loading) return <Spinner />;

	return (
		<>
			<div className='pageContainer'>
				<header>
					<p className='pageHeader'>Welcome back</p>
				</header>
				<form onSubmit={onSubmitHandler}>
					<input
						type='text'
						className='nameInput'
						value={name}
						onChange={onChangeHandler}
						id='name'
						placeholder='Name'
					/>
					<input
						type='email'
						className='emailInput'
						value={email}
						onChange={onChangeHandler}
						id='email'
						placeholder='Email'
					/>
					<div className='passwordInputDiv'>
						<input
							type={showPassword ? 'text' : 'password'}
							className='passwordInput'
							value={password}
							onChange={onChangeHandler}
							id='password'
							placeholder='Password'
						/>
						<img
							src={VisibilityIcon}
							alt='Arrow'
							className='showPassword'
							onClick={() => setShowPassword(prevState => !prevState)}
						/>
					</div>
					{/* <Link to='/forgot-password' className='forgotPassword'>
						<p className='forgotPasswordLink'>Forgot Password</p>
					</Link> */}
					<div className='signUpBar'>
						<p className='signInText'>Sign Up</p>
						<button className='signUpButton' type='submit'>
							<ArrowRightIcon fill='#fff' width='34px' height='34px' />
						</button>
					</div>
				</form>

				<OAuth />

				<Link to='/sign-in' className='registerLink'>
					Sign In Instead
				</Link>
			</div>
		</>
	);
};
export default SignUp;
