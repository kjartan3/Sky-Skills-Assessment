import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

dotenv.config();

export const getAccessToken = async () => {
  try {
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.CSOD_CLIENT_ID,
      client_secret: process.env.CSOD_CLIENT_SECRET,
      scope: 'all'
    });

    console.log("Client ID:", process.env.CSOD_CLIENT_ID?.slice(0, 4), "...");
    console.log("Secret loaded:", !!process.env.CSOD_CLIENT_SECRET);
    
    const res = await axios.post(
      'https://sky.csod.com/services/api/oauth2/token',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!res.data.access_token) {
      console.error('Token response:', res.data);
      throw new Error('Access token not found in response');
    }

    console.log('✅ Successfully obtained access token');
    return res.data.access_token;
  } catch (err) {
    console.error('❌ Failed to get access token from Cornerstone:');
    console.error('Status:', err.response?.status);
    console.error('Response:', err.response?.data);
    console.error('Message:', err.message);
    throw new Error('Unable to authenticate with external API');
  }
};

export const fetchUserProfile = async (userId, token) => {
  try {
    const url = `https://sky.csod.com/services/api/x/odata/api/views/vw_rpt_user?$select=user_ref,user_name_first,user_name_last,user_email&$filter=user_ref eq '${userId}'`;
    
    console.log(`🔍 Fetching user profile for userId: ${userId}`);
    
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.data.value || res.data.value.length === 0) {
      console.warn(`⚠️ No user profile found for user ID: ${userId}`);
      return null;
    }

    const rawProfile = res.data.value[0];
    
    // Transform to camelCase format for consistency
    const profile = {
      userId: rawProfile.user_ref,
      firstName: rawProfile.user_name_first,
      lastName: rawProfile.user_name_last,
      email: rawProfile.user_email
    };

    console.log(`✅ Successfully fetched profile for: ${profile.firstName} ${profile.lastName}`);
    return profile;

  } catch (err) {
    console.error(`❌ Failed to fetch user profile for ${userId}:`);
    console.error('Status:', err.response?.status);
    console.error('Response:', err.response?.data);
    console.error('Message:', err.message);
    throw new Error('Unable to retrieve user profile from external API');
  }
};

// Convenience function that handles token generation automatically
export const getUserProfile = async (userId) => {
  try {
    const token = await getAccessToken();

    // Step 1: Get base user info
    const userUrl = `https://sky.csod.com/services/api/x/odata/api/views/vw_rpt_user?$filter=user_ref eq '${userId}'&$select=user_id,user_ref,user_name_first,user_name_last,user_email`;
    const userRes = await axios.get(userUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const base = userRes.data?.value?.[0];
    if (!base) return null;

    // Step 2: Get OU Info
    const ouInfoUrl = `https://sky.csod.com/services/api/x/odata/api/views/vw_rpt_user_ou_info?$filter=user_ou_info_user_id eq ${base.user_id}&$select=user_ou_info_user_id,user_ou_id2,user_ou_id8`;
    const ouInfoRes = await axios.get(ouInfoUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const ouInfo = ouInfoRes.data?.value?.[0];
    const ouId = ouInfo?.user_ou_id2;
    console.log("data", ouInfoRes.data?.value)
    const bandId = ouInfo?.user_ou_id8

    // Step 3: Get OU Details
    let orgUnitTitle = null;
    let bandTitle = null;
    if (ouId) {
      const ouDetailsUrl = `https://sky.csod.com/services/api/x/odata/api/views/vw_rpt_ou?$filter=ou_id eq ${ouId}&$select=title`;
      const ouDetailsRes = await axios.get(ouDetailsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      orgUnitTitle = ouDetailsRes.data?.value?.[0]?.title || null;
    }

    const bandDetailsUrl = `https://sky.csod.com/services/api/x/odata/api/views/vw_rpt_ou?$filter=ou_id eq ${bandId}`;
    const bandDetailsRes = await axios.get(bandDetailsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("band data", bandDetailsRes.data)
      bandTitle = bandDetailsRes.data?.value?.[0]?.title || null
      console.log("band title", bandTitle)

    return {
      userId: base.user_ref,
      firstName: base.user_name_first,
      lastName: base.user_name_last,
      email: base.user_email,
      orgUnit: orgUnitTitle, // ✅ new field
      band: bandTitle
    };
  } catch (err) {
    console.error(`❌ Failed to fetch full user profile for ${userId}:`, err.message);
    throw err;
  }
};


// Batch function to get multiple user profiles
export const getUserProfiles = async (userIds) => {
  try {
    const token = await getAccessToken();
    const profiles = await Promise.all(
      userIds.map(userId => fetchUserProfile(userId, token))
    );
    return profiles.filter(profile => profile !== null);
  } catch (err) {
    console.error('❌ Failed to get user profiles:', err.message);
    throw err;
  }
};

