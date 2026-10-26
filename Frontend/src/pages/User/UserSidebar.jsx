import React from "react";
import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import DashboardShell from "../../component/DashboardShell";
const UserSidebar = () => <DashboardShell label="Learning space" items={[{ to: "dashboard", label: "Overview", icon: ChartNoAxesColumn }, { to: "my-learning", label: "My learning", icon: SquareLibrary }]} />;
export default UserSidebar;
