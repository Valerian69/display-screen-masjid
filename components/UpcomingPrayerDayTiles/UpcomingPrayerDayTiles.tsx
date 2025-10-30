import { UpcomingPrayerTimes } from "@/types/DailyPrayerTimeType"
import moment from "moment"
import { getPrayerName, translations } from "@/constants/translations"

export default function UpcomingPrayerDayTiles({
  times,
}: {
  times: UpcomingPrayerTimes
}) {
  return (
    <dl
      className={`grid justify-items-stretch lg:grid-cols-6 text-center gap-0 md:gap-3`}
    >
      <div className="bg-mosqueGreen-dark text-white p-4 lg:p-6 lg:col-auto">
        <dt className="text-sm lg:text-2xl font-medium">
          {translations.labels.jamaahTimesFor}
        </dt>
        <dd className="mt-2 text-xl lg:text-3xl font-bold tracking-tight">
          {times.display_date}
        </dd>
      </div>
      <div className="bg-mosqueGreen-dark text-white p-4 lg:p-6 lg:col-auto">
        <dt className="text-sm lg:text-2xl font-medium">
          {getPrayerName("Fajr")} ({times.display_day_label})
        </dt>
        <dd className="mt-2 text-xl lg:text-3xl font-bold tracking-tight">
          {moment(times.fajr.congregation_start, ["HH:mm"]).format("h:mm")}
        </dd>
      </div>
      <div className="bg-mosqueGreen-dark text-white p-4 lg:p-6 lg:col-auto">
        <dt className="text-sm lg:text-2xl font-medium">
          {getPrayerName("Zuhr")} ({times.display_day_label})
        </dt>
        <dd className="mt-2 text-xl lg:text-3xl font-bold tracking-tight">
          {moment(times.zuhr.congregation_start, ["HH:mm"]).format("h:mm")}
        </dd>
      </div>
      <div className="bg-mosqueGreen-dark text-white p-4 lg:p-6 lg:col-auto">
        <dt className="text-sm lg:text-2xl font-medium">
          {getPrayerName("Asr")} ({times.display_day_label})
        </dt>
        <dd className="mt-2 text-xl lg:text-3xl font-bold tracking-tight">
          {moment(times.asr.congregation_start, ["HH:mm"]).format("h:mm")}
        </dd>
      </div>
      <div className="bg-mosqueGreen-dark text-white p-4 lg:p-6 lg:col-auto">
        <dt className="text-sm lg:text-2xl font-medium">
          {getPrayerName("Maghrib")} ({times.display_day_label})
        </dt>
        <dd className="mt-2 text-xl lg:text-3xl font-bold tracking-tight">
          {moment(times.maghrib.congregation_start, ["HH:mm"]).format("h:mm")}
        </dd>
      </div>
      <div className="bg-mosqueGreen-dark text-white p-4 lg:p-6 lg:col-auto">
        <dt className="text-sm lg:text-2xl font-medium">
          {getPrayerName("Isha")} ({times.display_day_label})
        </dt>
        <dd className="mt-2 text-xl lg:text-3xl font-bold tracking-tight">
          {moment(times.isha.congregation_start, ["HH:mm"]).format("h:mm")}
        </dd>
      </div>
    </dl>
  )
}
