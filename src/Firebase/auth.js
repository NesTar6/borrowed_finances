import { auth } from "./firebase"



//Sign Up
export const createUser = async (email, password) => 
  await auth.createUserWithEmailAndPassword(email,password).then(() => {console.log('Signed up!')});

//Log In
export const logIn = async (email, password) => 
  await auth.signInWithEmailAndPassword(email,password).then(() => {console.log('Logged in!')});

//Sign Out
export const signOut = async () => 
  await auth.signOut().then(() => {console.log('logged out!')});