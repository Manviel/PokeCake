const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const keys = require("./keys");

const baseClient = mbxGeocoding({ accessToken: keys.mapboxToken });

geoCoder = async location => {
  try {
    const response = await baseClient
      .forwardGeocode({
        query: location,
        limit: 2
      })
      .send();

    console.log(response.body);
  } catch (error) {
    console.log(error);
  }
};

geoCoder("Paris, France");
