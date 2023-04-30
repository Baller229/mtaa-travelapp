import client from './client';

const endpoint_removereservation = '/removereservation/';
const endpoint_store_notification = '/notification/token/'; 
const endpoint_send_notification = '/sendNotification/'; 
const endpoint_trip_details = '/destinations/specs/'; 
const endpoint_store_image = '/destinations/image/'; 
const endpoint_destinations = '/destinations/'; 
const endpoint_users_all = '/users/all/'; 
const endpoint_user = '/users/current/'; 
const endpoint_history = '/history/'; 
const endpoint_reserve = '/reserve/'; 


// ==========================================================
//
// ==========================================================

const getListings = () => client.get(endpoint_destinations);

// ==========================================================
//
// ==========================================================

const getListingsHistory = (userId) => {
  const data = new FormData();
  data.append('user_id', userId);  
  return client.post(endpoint_history, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

const getListingsUsers = (userId) => {
  const data = new FormData();
  data.append('user', userId);  
  return client.post(endpoint_users_all, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

const deleteTrip = (tripName, userId) => {
  return client.delete(endpoint_removereservation, {}, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      user_id: userId,
      trip: tripName
    },
  });
};

// ==========================================================
//
// ==========================================================

const getCurrentUser = (userId) => {
  const data = new FormData();
  data.append('user', userId);  
  return client.post(endpoint_user, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

const putNotificationToken = (token, userId) => {
  const data = new FormData();
  data.append('user', userId);
  data.append('token', token);  
  return client.put(endpoint_store_notification, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

const notificationHandler = (tripName) => {
  const data = new FormData();
  data.append('trip', tripName);
  return client.post(endpoint_send_notification, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

const addListing = (listing, tripID) => {
    const data = new FormData();
    data.append('trip', tripID);  
    data.append('trip_image', {
        name: `image.png`,
        type: 'image/png',
        uri: listing.img,
      });

    return client.post(endpoint_store_image, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

// ==========================================================
//
// ==========================================================

const addReservation = (tripname, userId) => {
  console.log(tripname, userId);
  const data = new FormData();
  data.append('trip_name', tripname);  
  data.append('persons_no', 1);  
  data.append('user_id', userId);  
  
  return client.post(endpoint_reserve, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

const tripDetails = (tripname) => {
  const data = new FormData();
  data.append('trip_name', tripname);  
  
  return client.post(endpoint_trip_details, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ==========================================================
//
// ==========================================================

export default 
{
    addListing,
    getListings,
    getListingsHistory,
    getListingsUsers,
    getCurrentUser,
    addReservation,
    notificationHandler,
    putNotificationToken,
    deleteTrip,
    tripDetails,
}

