import axios from "axios";
import moment from 'moment';


export const fetchProgramList = async () => {
  const progresList = [];
  const url = "https://dev.hakini.net/api/get-categories-optimized";

  try {
    const response = await axios.get(url);
    const progresAndTraining = response.data;
    const mainCategories = progresAndTraining['main_categories'];
    const mainCategoryPrograms = mainCategories[0]?.programs || [];

    mainCategoryPrograms.forEach((program) => {
      progresList.push( program.title, program.cover );
    });

    return progresList; 

  } catch (error) {
    console.error("Error fetching data:", error);
    return []; 
  }
};



export const fetchTherapistNames = async () => {
  const therapistNamesList = [];
  const urls = [];

  for (let url = 1; url <= 11; url++) {
    urls.push(`https://dev.hakini.net/api/therapists-filter-new?page=${url}`);
  }

  try {
    const results = await Promise.all(urls.map(async (url) => {
      const response = await axios.get(url);
      return response.data;
    }));

    results.forEach((dataJson) => {
      if (dataJson && dataJson.data) {
        const dataJsonList = dataJson.data;
        dataJsonList.forEach((therapist) => {
          therapistNamesList.push({
            name: therapist.author_name,
            title: therapist.author_title,
            img: therapist.author_img,
            user_id: therapist.user_id
          });
        });
      }
    });


    return therapistNamesList;

  } catch (error) {
    console.error("Error fetching therapist data:", error);
    return [];
  }
};



export const getTherapistDates = async (userId) => {
  const url = `https://dev.hakini.net/api/nearest-availabilities/${userId}`;
  
  const response = await fetch(url);
  const dataJsonDateTime = await response.json();
  const dayDate = [];

  for (let day = 1; day <= Object.keys(dataJsonDateTime).length; day++) {
    dayDate.push(dataJsonDateTime[`day${day}`]?.date);
  }

  return dayDate;
};



export const getTherapistTimes = async (userId, date) => {
  const url = `https://dev.hakini.net/api/nearest-availabilities/${userId}`;
  
  try {
    const response = await axios.get(url);
    const dataJsonDateTime = response.data;
    
    const dayDates = Object.keys(dataJsonDateTime).map(
      (key) => dataJsonDateTime[key].date
    );

    let timeDayDate = [];
    dayDates.forEach((dayDate, index) => {
      if (date === dayDate) {
        timeDayDate = dataJsonDateTime[`day${index + 1}`].times;
      }
    });

    const timeDayDateConverter = timeDayDate.map((time) =>
      moment(time, "HH:mm").format("HH:mm")
    );

    const timeRange = [];
    for (let j = 0; j < timeDayDateConverter.length - 1; j += 2) {
      timeRange.push(timeDayDateConverter[j]);
      timeRange.push(timeDayDateConverter[j + 1]);
    }
    console.log(TimeRanges);
    return timeRange;
  } catch (error) {
    console.error("Error fetching therapist times:", error);
    return [];
  }
}



export const payPlan = async(userId) => {
  const url = `https://dev.hakini.net/api/get-therapist-plans?therapist_id=${userId}`;
  
  try {
    const response = await axios.get(url);
    const dataJsonDateTime = response.data;
 
    const payPlanList = dataJsonDateTime['data'].map((plan) => ({
      cost: plan['cost'],
      no_sessions: plan['no_sessions'],
    }));
    
    return payPlanList;
  } catch (error) {
    console.error("Error fetching payment plans:", error);
    return [];
  }
}



export const searchTherapist = async (name) => {
  const urls = [];
  for (let page = 1; page <= 11; page++) {
    urls.push(`https://dev.hakini.net/api/therapists-filter-new?page=${page}`);
  }

  const fetchPage = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData;
      } else {
        console.error(`Error: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    }
    return null;
  };

  const results = await Promise.all(urls.map(fetchPage));

  for (const [index, result] of results.entries()) {
    if (result && result.data) {
      for (const item of result.data) {
        const authorName = item.author_name ? item.author_name.toLowerCase() : '';
        const authorNameEn = item.author_name_en ? item.author_name_en.toLowerCase() : '';
        const username = name ? name.toLowerCase() : '';
        if (authorName.includes(username) || authorNameEn.includes(username)) {
          return {  status: "الدكتور موجود", user_id: item.user_id, authorName: item.author_name };
        };
      }
    } else {
      console.log(`No data found for result at index ${index}`);
    }
  }

  return { status: "الدكتور غير موجود", authorName: null, user_id: null };
};
