import { Hunts } from "./hunts";
import { HuntPage } from "./hunt/hunt";
import { Route, Routes } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

export function DashboardPage() {
    return <div className="mx-auto max-w-7xl">
        <div className="flex mt-7 gap-5 mx-3 xl:mx-0">
            <Sidebar />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Hunts />} />
                    <Route path="/hunts/:id" element={<HuntPage />} />
                </Routes>
            </div>
        </div>
    </div>
}