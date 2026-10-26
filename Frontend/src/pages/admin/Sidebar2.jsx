import React from "react";
import { ChartNoAxesColumn, GraduationCap, Users } from "lucide-react";
import DashboardShell from "../../component/DashboardShell";
const Sidebar2 = () => <DashboardShell label="Administration" items={[{ to: "dashboard", label: "Overview", icon: ChartNoAxesColumn }, { to: "instructor", label: "Instructors", icon: GraduationCap }, { to: "allusers", label: "Users", icon: Users }]} />;
export default Sidebar2;
