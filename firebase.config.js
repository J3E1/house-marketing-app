// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBr3_9oBVHmqayPSiI8FNa3cgQjN19bJOg',
	authDomain: 'house-marketplace-app-34d53.firebaseapp.com',
	projectId: 'house-marketplace-app-34d53',
	storageBucket: 'house-marketplace-app-34d53.appspot.com',
	messagingSenderId: '307855364888',
	appId: '1:307855364888:web:2e0414f28c05475cae046d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
