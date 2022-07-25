import React, { useState, useEffect, cloneElement } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "d90c63222375a91d0a92934d5e7421fa";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...🛰");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  return (
    <View style={styles.container}>
      <StatusBar style="light"></StatusBar>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator="false"
        indicatorStyle="white"
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 20 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <View style={styles.wheatherDetails}>
                <Text style={styles.tempDetails}>
                  Min : {day.temp.min} °C / Max : {day.temp.max} °C
                </Text>
                <Text style={styles.tempDetails}>
                  Humidity : {day.humidity}%
                </Text>
                {day.weather[0].main == "Rain" ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        textAlign: "center",
                        justifyContent: "center",
                        marginTop: 30,
                        maxWidth: SCREEN_WIDTH,
                        overflow: "hidden",
                      }}
                    >
                      <Text style={styles.main}>{day.weather[0].main}</Text>
                      <Text style={styles.description}>
                        &nbsp; &nbsp; - {day.weather[0].description}
                      </Text>
                    </View>
                    <Text style={styles.rainNotice}>
                      You should take an umbrella&#127746;{"\n"}Maybe 😛
                    </Text>
                  </>
                ) : (
                  <View
                    style={{
                      flexDirection: "colmn",
                      alignItems: "baseline",
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: 30,
                      maxWidth: SCREEN_WIDTH,
                      overflow: "hidden",
                    }}
                  >
                    <Text style={styles.main}>{day.weather[0].main}</Text>
                    <Text style={styles.description}>
                      &nbsp; &nbsp; - {day.weather[0].description}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0984e3",
  },
  city: {
    marginTop: 25,
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "#F2DF3A",
    fontSize: 58,
    fontWeight: "600",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  temp: {
    color: "#fff",
    fontSize: 100,
    marginRight: 20,
    marginBottom: 10,
  },
  tempDetails: {
    color: "#c7ecee",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
  },
  main: {
    color: "#fff",
    fontSize: 90,
    textAlign: "center",
  },
  description: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    alignItems: "baseline",
  },
  rainNotice: {
    textAlign: "center",
    color: "#c7ecee",
    fontSize: 18,
    marginTop: 10,
  },
});
