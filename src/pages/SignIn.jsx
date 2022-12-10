import { useState } from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase.config';

import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import VisibilityIcon from '../assets/svg/visibilityIcon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import Spinner from '../components/Spinner';

const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const { email, password } = formData;

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
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;
			setLoading(false);

			if (user) {
				toast.success('Signed In Successfully!!');
				navigate('/');
			}
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			toast.error('Bad Credentials!!');
			// console.log(error);
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
					<Link to='/forgot-password' className='forgotPassword'>
						<p className='forgotPasswordLink'>Forgot Password</p>
					</Link>
					<div className='signInBar'>
						<p className='signInText'>Sign In</p>
						<button className='signInButton' type='submit'>
							<ArrowRightIcon fill='#fff' width='34px' height='34px' />
						</button>
					</div>
				</form>

				<OAuth />

				<Link to='/sign-up' className='registerLink'>
					Sign Up Instead
				</Link>
			</div>
		</>
	);
};
export default SignIn;
