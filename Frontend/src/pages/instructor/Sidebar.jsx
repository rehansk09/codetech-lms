import React from "react";
import { CalendarDays, ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import DashboardShell from "../../component/DashboardShell";
const Sidebar = () => <DashboardShell label="Instructor workspace" items={[{ to: "dashboard", label: "Overview", icon: ChartNoAxesColumn }, { to: "course", label: "Courses", icon: SquareLibrary }, { to: "course/meeting", label: "Meetings", icon: CalendarDays }]} />;
export default Sidebar;
