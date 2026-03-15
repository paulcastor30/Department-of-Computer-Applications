import { PageHero } from "@/components/ui/hero-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { DownloadList } from "@/components/ui/download-block";
export default function CurrentStudents() { return (<><PageHero title="Current Students" subtitle="Resources and information for enrolled students." /><Section><SectionHeader title="Student Resources" /><DownloadList items={[{ title: "Academic Calendar 2024-2025", fileType: "pdf", href: "#" }, { title: "Student Handbook", fileType: "pdf", href: "#" }, { title: "Course Schedules", fileType: "pdf", href: "#" }, { title: "OJT Guidelines", fileType: "pdf", href: "#" }]} /></Section></>); }
