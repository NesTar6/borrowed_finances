# Setup

1. Create new [Firebase project](https://console.firebase.google.com/) (or have an existing one)
2. Add app to your Firebase project (if not already)
3. Update the `FIREBASE_*` environment variables in .env and `./src/`
4. Run `firebase init` in project root
5. Enable `Email/Password` authentication method in Firebase project console

## Troubleshooting: 

> === Firestore Setup
>
> Error: Cloud resource location is not set for this project but the operation you are attempting to perform in Cloud Firestore requires it. Please see this documentation for more details: https://firebase.google.com/docs/projects/locations

Go to your project's dashboard > Storage > Get Started, and choose a "location" (eg. US-Centra). Re-run `firebase init`.

> Error: Error fetching Firestore indexes

Your project is using `Datastore` instead of `Native Firestore` for storage. Go to [Datastore in your project's Google Console](https://console.cloud.google.com/datastore) and choose "Switch to Native".  Re-run `firebase init`.


# Run Locally

Run `firebase`

# Deploy

Run `firebase deploy`