import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { auth } from '../../firebase.config';

const useAuthStatus = () => {
	const isMounted = useRef(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [checkingStatus, setCheckingStatus] = useState(true);

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, user => {
				if (user) setLoggedIn(true);
				setCheckingStatus(false);
			});
		}
		return () => {
			isMounted.current = false;
		};
	}, [isMounted]);

	return [loggedIn, checkingStatus];
};
export default useAuthStatus;
