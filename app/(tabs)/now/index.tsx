import { useContext, useEffect } from "react";

import { GlobalContext } from "@/context/global";
import { ApiDataContext } from "@/context/apidata";

import { DayType } from "@/types/api";

import { PageScrollView, Section } from "@/components/ui/Containers";
import Loading from "@/components/ui/Loading";
import { DividerH } from "@/components/ui/Elements";

import WindInfo from "@/components/WindInfo";
import RealTime from "@/components/RealTime";
import Alert from "@/components/Alert";
import AstroInfo from "@/components/AstroInfo";
import DayDetails from "@/components/DayDetails";
import RainInfo from "@/components/RainInfo";

import { Charts } from "@/components/Charts";

import AirQualityOverView from "@/components/AirQualityOverView";
import { UserContext } from "@/context/user";

const HomePage = () => {
  const { state } = useContext(GlobalContext);
  const { userState } = useContext(UserContext);
  const {
    apiDataState: {
      current,
      location,
      alerts,
      forecast,
      googleairquality,
      googlepollen,
    },
  } = useContext(ApiDataContext);

  if (!current || !location || state.loading) {
    return <Loading />;
  }

  const day = forecast.forecastday[0];

  const todaysLeftHours = forecast.forecastday[0].hour.filter(
    (hour: any) =>
      new Date(location?.localtime).getHours() <= new Date(hour.time).getHours()
  );
  const todayHours = [
    ...todaysLeftHours,
    ...forecast.forecastday[1].hour.slice(0, 24 - todaysLeftHours.length),
  ];

  return (
    <PageScrollView center noPadding>
      <Section noPadding>
        {alerts.alert.length > 0 && <Alert alerts={alerts.alert} />}
      </Section>
      <Section>
        <RealTime
          cloud={current.cloud}
          condition={current.condition}
          is_day={current.is_day}
          humidity={current.humidity}
          temp={{
            c: current.temp_c,
            f: current.temp_f,
          }}
          feelslike={{
            c: current.feelslike_c,
            f: current.feelslike_f,
          }}
          location={{
            name: location.name,
            country: location.country,
          }}
        />

        <DividerH />
      </Section>
      <Section>
        <WindInfo
          wind_degree={current.wind_degree}
          wind_dir={current.wind_dir}
          wind_kph={current.wind_kph}
          wind_mph={current.wind_mph}
          gust_kph={current.gust_kph}
          gust_mph={current.gust_mph}
          vis_km={current.vis_km}
          vis_miles={current.vis_miles}
          precip_in={current.precip_in}
          precip_mm={current.precip_mm}
        />
        <DividerH />
      </Section>
      {userState.settings.allergy === 0 &&
        (googleairquality !== null || googlepollen !== null) && (
          <Section>
            <AirQualityOverView
              airQuality={googleairquality}
              pollen={googlepollen}
              temperature={current.temp_c}
              humidity={current.humidity}
            />
            <DividerH />
          </Section>
        )}
      <>
        <Charts hours={todayHours} />
        <Section style={{ marginTop: 16 }}>
          <DividerH />
        </Section>
      </>
      <Section>
        <DayDetails day={day.day as DayType} />
        <DividerH />
      </Section>
      {(day.day.daily_will_it_rain === 1 || day.day.daily_will_it_snow === 1) && (
        <Section>
          <RainInfo
            chance_of_rain={day.day.daily_chance_of_rain}
            chance_of_snow={day.day.daily_chance_of_snow}
            will_it_rain={day.day.daily_will_it_rain}
            will_it_snow={day.day.daily_will_it_snow}
            precip_in={day.day.totalprecip_in}
            precip_mm={day.day.totalprecip_mm}
            snow_cm={day.day.totalsnow_cm}
          />
          <DividerH />
        </Section>
      )}
      <Section>
        <AstroInfo astro={day.astro} />
      </Section>
    </PageScrollView>
  );
};

export default HomePage;
