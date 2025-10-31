import Calendar from "@/components/Calendar/Calendar"
import { getAllPrayerTimes, getMetaData } from "@/services/EnhancedMosqueDataService"
import { MosqueMetadataType } from "@/types/MosqueDataType"
import { Metadata } from "next"
import { translations } from "@/constants/translations"

export async function generateMetadata(): Promise<Metadata> {
  const mosqueMetadata: MosqueMetadataType = await getMetaData()

  return {
    title: `${mosqueMetadata.name} ${translations.labels.prayerTimes} | ${translations.meta.title}`,
    description: `${mosqueMetadata.address} | ${mosqueMetadata.name} | ${translations.meta.description}`,
  }
}

export default async function FullYear() {
  const prayerTimes = await getAllPrayerTimes()
  const mosqueMetadata: MosqueMetadataType = await getMetaData()

  return (
    <div className="bg-white min-w-full min-h-screen">
      <Calendar prayerTimes={prayerTimes} metadata={mosqueMetadata} />
    </div>
  )
}
